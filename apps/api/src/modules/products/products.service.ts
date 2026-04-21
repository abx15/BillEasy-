// Products Service - Product management business logic
import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface CreateProductDto {
  name: string;
  sku?: string;
  price: number;
  gstPercent: number;
  stockQuantity: number;
  lowStockAlert?: number;
  unit?: string;
  category?: string;
  expiryDate?: Date;
  batchNumber?: string;
}

export interface UpdateProductDto {
  name?: string;
  sku?: string;
  price?: number;
  gstPercent?: number;
  stockQuantity?: number;
  lowStockAlert?: number;
  unit?: string;
  category?: string;
  expiryDate?: Date;
  batchNumber?: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  lowStock?: boolean;
}

export interface PaginatedProducts {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

export interface StockAdjustmentDto {
  quantity: number;
  operation: 'increment' | 'decrement';
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(businessId: string, query: ProductQuery): Promise<PaginatedProducts> {
    const { page = 1, limit = 10, search, category, lowStock } = query;
    const skip = (page - 1) * limit;

    const where: any = {
      businessId,
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (lowStock === true) {
      where.stockQuantity = { lte: this.prisma.product.fields.lowStockAlert };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
      page,
      limit,
    };
  }

  async findOne(businessId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        businessId,
        isActive: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(businessId: string, createDto: CreateProductDto) {
    const { sku, gstPercent } = createDto;

    // Validate GST percentage
    if (![0, 5, 12, 18, 28].includes(gstPercent)) {
      throw new BadRequestException('GST percentage must be one of: 0, 5, 12, 18, 28');
    }

    // Generate SKU if not provided
    let finalSku = sku;
    if (!finalSku) {
      finalSku = await this.generateSKU(businessId, createDto.name);
    }

    // Check if SKU is unique within the business
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        businessId,
        sku: finalSku,
      },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    const product = await this.prisma.product.create({
      data: {
        businessId,
        ...createDto,
        sku: finalSku,
        lowStockAlert: createDto.lowStockAlert || 10,
        unit: createDto.unit || 'pcs',
      },
    });

    return product;
  }

  async update(businessId: string, productId: string, updateDto: UpdateProductDto) {
    // Check if product belongs to this business
    await this.findOne(businessId, productId);

    // Validate GST percentage if provided
    if (updateDto.gstPercent !== undefined && ![0, 5, 12, 18, 28].includes(updateDto.gstPercent)) {
      throw new BadRequestException('GST percentage must be one of: 0, 5, 12, 18, 28');
    }

    // Check if SKU is unique within the business (if being updated)
    if (updateDto.sku) {
      const duplicateProduct = await this.prisma.product.findFirst({
        where: {
          businessId,
          sku: updateDto.sku,
          id: { not: productId },
        },
      });

      if (duplicateProduct) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: updateDto,
    });

    return updatedProduct;
  }

  async remove(businessId: string, productId: string) {
    // Check if product belongs to this business
    await this.findOne(businessId, productId);

    // Soft delete - deactivate product
    await this.prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    return { message: 'Product deleted successfully' };
  }

  async searchProducts(businessId: string, query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10, // Limit for autocomplete
      orderBy: { name: 'asc' },
    });

    return products;
  }

  async getLowStockProducts(businessId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        stockQuantity: { lte: this.prisma.product.fields.lowStockAlert },
      },
      orderBy: { stockQuantity: 'asc' },
    });

    return products;
  }

  async adjustStock(productId: string, adjustmentDto: StockAdjustmentDto) {
    const { quantity, operation } = adjustmentDto;

    return await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      let newStockQuantity: number;
      
      if (operation === 'increment') {
        newStockQuantity = product.stockQuantity + quantity;
      } else {
        newStockQuantity = product.stockQuantity - quantity;
        if (newStockQuantity < 0) {
          throw new BadRequestException('Insufficient stock');
        }
      }

      const updatedProduct = await tx.product.update({
        where: { id: productId },
        data: { stockQuantity: newStockQuantity },
      });

      return updatedProduct;
    });
  }

  private async generateSKU(businessId: string, productName: string): Promise<string> {
    // Generate SKU from product name (first 3 letters + random number)
    const prefix = productName.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const sku = `${prefix}${random}`;

    // Ensure uniqueness
    const existingProduct = await this.prisma.product.findFirst({
      where: { businessId, sku },
    });

    if (existingProduct) {
      return this.generateSKU(businessId, productName); // Recursive call to generate new SKU
    }

    return sku;
  }
}
