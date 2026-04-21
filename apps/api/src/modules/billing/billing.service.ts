// Billing Service - Bill management business logic
import { 
  Injectable, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import axios from 'axios';

export interface CreateBillItemDto {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateBillDto {
  customerId?: string;
  customerPhone?: string;
  items: CreateBillItemDto[];
  discountAmount?: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface BillQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  from?: string;
  to?: string;
}

export interface UpdatePaymentDto {
  amount: number;
  method: PaymentMethod;
}

export interface PaginatedBills {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class BillingService {
  constructor(
    private prisma: PrismaService,
    private productsService: ProductsService,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
  ) {}

  async createBill(businessId: string, userId: string, createDto: CreateBillDto) {
    const { customerId, customerPhone, items, discountAmount = 0, paymentStatus, paymentMethod, notes } = createDto;

    return await this.prisma.$transaction(async (tx) => {
      // STEP 1: Validate products and stock
      const productIds = items.map(item => item.productId);
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          businessId,
          isActive: true,
        },
      });

      if (products.length !== productIds.length) {
        throw new BadRequestException('Some products are not found or inactive');
      }

      // Check stock availability
      for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product: ${product.name}`);
        }
      }

      // STEP 2: Calculate amounts
      let subtotal = 0;
      let totalGST = 0;
      const billItems = [];

      for (const item of items) {
        const product = products.find(p => p.id === item.productId);
        const itemTotal = item.price * item.quantity;
        const gstAmount = itemTotal * (product.gstPercent / 100);
        
        subtotal += itemTotal;
        totalGST += gstAmount;
        
        billItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          gstAmount,
        });
      }

      const totalAmount = subtotal + totalGST - discountAmount;

      // STEP 3: Generate invoice number
      const invoiceNumber = await this.generateInvoiceNumber(tx, businessId);

      // STEP 4: Handle customer (walk-in or existing)
      let finalCustomerId = customerId;
      if (!finalCustomerId && customerPhone) {
        // Create walk-in customer
        const walkInCustomer = await tx.customer.create({
          data: {
            businessId,
            name: 'Walk-in Customer',
            phone: customerPhone,
          },
        });
        finalCustomerId = walkInCustomer.id;
      }

      if (!finalCustomerId) {
        throw new BadRequestException('Customer ID or phone is required');
      }

      // STEP 5: Create bill
      const bill = await tx.bill.create({
        data: {
          businessId,
          customerId: finalCustomerId,
          invoiceNumber,
          subtotal,
          discountAmount,
          gstAmount: totalGST,
          totalAmount,
          paymentStatus,
          paymentMethod,
          notes,
        },
      });

      // STEP 6: Create bill items
      for (const item of billItems) {
        await tx.billItem.create({
          data: {
            billId: bill.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            gstAmount: item.gstAmount,
          },
        });
      }

      // STEP 7: Reduce stock
      for (const item of items) {
        await this.productsService.adjustStock(item.productId, {
          quantity: item.quantity,
          operation: 'decrement',
        });
      }

      // STEP 8: Create payment record if paid
      if (paymentStatus === PaymentStatus.PAID && paymentMethod) {
        await tx.payment.create({
          data: {
            billId: bill.id,
            amount: totalAmount,
            method: paymentMethod,
          },
        });
      }

      // STEP 9: Generate PDF (async - don't wait)
      this.generateAndSendPDF(bill.id, businessId, finalCustomerId).catch(error => {
        console.error('Failed to generate PDF:', error);
      });

      // STEP 10: Send notifications (async - fire and forget)
      if (finalCustomerId) {
        this.notificationsService.sendBillNotifications(bill.id, finalCustomerId).catch(error => {
          console.error('Failed to send notifications:', error);
        });
      }

      // Return created bill with items
      return await this.findOne(businessId, bill.id);
    });
  }

  async findAll(businessId: string, query: BillQuery): Promise<PaginatedBills> {
    const { page = 1, limit = 10, status, from, to } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      businessId,
    };

    if (status) {
      where.paymentStatus = status;
    }

    if (from || to) {
      where.createdAt = {};
      if (from) {
        where.createdAt.gte = new Date(from);
      }
      if (to) {
        where.createdAt.lte = new Date(to);
      }
    }

    const [bills, total] = await Promise.all([
      this.prisma.bill.findMany({
        where,
        include: {
          customer: {
            select: { name: true, phone: true },
          },
          items: {
            include: {
              product: {
                select: { name: true, sku: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bill.count({ where }),
    ]);

    return {
      data: bills,
      total,
      page,
      limit,
    };
  }

  async findOne(businessId: string, billId: string) {
    const bill = await this.prisma.bill.findFirst({
      where: {
        id: billId,
        businessId,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              select: { name: true, sku: true, gstPercent: true },
            },
          },
        },
        payments: {
          orderBy: { paidAt: 'desc' },
        },
      },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    return bill;
  }

  async updatePayment(businessId: string, billId: string, updateDto: UpdatePaymentDto) {
    return await this.prisma.$transaction(async (tx) => {
      // Check if bill belongs to this business
      const bill = await this.findOne(businessId, billId);

      // Calculate total paid amount
      const existingPayments = await tx.payment.findMany({
        where: { billId },
      });
      const totalPaid = existingPayments.reduce((sum, payment) => sum + payment.amount, 0) + updateDto.amount;

      // Create new payment record
      await tx.payment.create({
        data: {
          billId,
          amount: updateDto.amount,
          method: updateDto.method,
        },
      });

      // Update payment status
      let newStatus: PaymentStatus;
      if (totalPaid >= bill.totalAmount) {
        newStatus = PaymentStatus.PAID;
      } else if (totalPaid > 0) {
        newStatus = PaymentStatus.PARTIAL;
      } else {
        newStatus = PaymentStatus.PENDING;
      }

      const updatedBill = await tx.bill.update({
        where: { id: billId },
        data: { paymentStatus: newStatus },
      });

      return updatedBill;
    });
  }

  async resendBill(businessId: string, billId: string) {
    const bill = await this.findOne(businessId, billId);
    
    // Regenerate PDF and send notifications
    await this.generateAndSendPDF(billId, businessId, bill.customerId);
    await this.notificationsService.sendBillNotifications(billId, bill.customerId);

    return { message: 'Bill resent successfully' };
  }

  private async generateInvoiceNumber(tx: any, businessId: string): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Count existing bills for today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    const count = await tx.bill.count({
      where: {
        businessId,
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    
    // Get business invoice prefix
    const business = await tx.business.findUnique({
      where: { id: businessId },
      select: { invoicePrefix: true },
    });

    const prefix = business?.invoicePrefix || 'INV';
    
    return `${prefix}-${year}-${month}${day}-${sequence}`;
  }

  private async generateAndSendPDF(billId: string, businessId: string, customerId: string) {
    try {
      // Get complete bill data
      const bill = await this.findOne(businessId, customerId);
      
      // Call ML API for PDF generation
      const mlApiUrl = this.configService.get<string>('ML_API_URL');
      const response = await axios.post(`${mlApiUrl}/pdf/invoice`, {
        bill,
        business: bill.business,
        customer: bill.customer,
      });

      // Update bill with PDF URL if provided
      if (response.data.pdfUrl) {
        await this.prisma.bill.update({
          where: { id: billId },
          data: { /* Add pdfUrl field if needed in schema */ },
        });
      }
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new InternalServerErrorException('Failed to generate PDF');
    }
  }
}
