// Customers Service - Customer management business logic
import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CustomerQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedCustomers {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query: CustomerQuery): Promise<PaginatedCustomers> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      businessId,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      total,
      page,
      limit,
    };
  }

  async findOne(businessId: string, customerId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id: customerId,
        businessId,
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async create(businessId: string, createDto: CreateCustomerDto) {
    const { phone } = createDto;

    // Check if phone number is unique within the business
    if (phone) {
      const existingCustomer = await this.prisma.customer.findFirst({
        where: {
          businessId,
          phone,
        },
      });

      if (existingCustomer) {
        throw new ConflictException('Customer with this phone number already exists');
      }
    }

    const customer = await this.prisma.customer.create({
      data: {
        businessId,
        ...createDto,
      },
    });

    return customer;
  }

  async update(businessId: string, customerId: string, updateDto: UpdateCustomerDto) {
    // Check if customer belongs to this business
    const existingCustomer = await this.findOne(businessId, customerId);

    // Check if phone number is unique within the business (if being updated)
    if (updateDto.phone && updateDto.phone !== existingCustomer.phone) {
      const duplicateCustomer = await this.prisma.customer.findFirst({
        where: {
          businessId,
          phone: updateDto.phone,
          id: { not: customerId },
        },
      });

      if (duplicateCustomer) {
        throw new ConflictException('Customer with this phone number already exists');
      }
    }

    const updatedCustomer = await this.prisma.customer.update({
      where: { id: customerId },
      data: updateDto,
    });

    return updatedCustomer;
  }

  async remove(businessId: string, customerId: string) {
    // Check if customer belongs to this business
    await this.findOne(businessId, customerId);

    // Check if customer has bills
    const billCount = await this.prisma.bill.count({
      where: { customerId },
    });

    if (billCount > 0) {
      throw new BadRequestException('Cannot delete customer with existing bills');
    }

    // Soft delete - deactivate customer
    await this.prisma.customer.delete({
      where: { id: customerId },
    });

    return { message: 'Customer deleted successfully' };
  }

  async getCustomerBills(businessId: string, customerId: string, query: CustomerQuery) {
    // Check if customer belongs to this business
    await this.findOne(businessId, customerId);

    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const [bills, total] = await Promise.all([
      this.prisma.bill.findMany({
        where: {
          customerId,
          businessId,
        },
        include: {
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
      this.prisma.bill.count({
        where: {
          customerId,
          businessId,
        },
      }),
    ]);

    // Calculate total amount for this customer
    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    return {
      data: bills,
      total,
      page,
      limit,
      totalAmount,
    };
  }
}
