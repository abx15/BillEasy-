import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async createBill(businessId: string, billData: any) {
    try {
      const invoiceNumber = this.generateInvoiceNumber();
      
      const bill = await this.prisma.bill.create({
        data: {
          businessId,
          invoiceNumber,
          customerId: billData.customerId,
          subtotal: billData.subtotal || 0,
          totalAmount: billData.totalAmount || 0,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: billData.paymentMethod,
        },
      });

      return bill;
    } catch (error) {
      throw new BadRequestException('Failed to create bill');
    }
  }

  async getBills(businessId: string, query: any = {}) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [bills, total] = await Promise.all([
      this.prisma.bill.findMany({
        where: { businessId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bill.count({ where: { businessId } }),
    ]);

    return {
      data: bills,
      total,
      page,
      limit,
    };
  }

  private generateInvoiceNumber(): string {
    return `INV-${Date.now()}`;
  }
}
