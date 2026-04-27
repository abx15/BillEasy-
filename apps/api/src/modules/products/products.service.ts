// Products Service - Product management business logic
import { 
  Injectable, 
  NotFoundException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { GstSlab } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(businessId: string, createDto: CreateProductDto) {
    // Generate SKU if not provided
    const finalSku = createDto.sku || this.generateSku(createDto.name);

    // Check for duplicate SKU
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
        name: createDto.name,
        sku: finalSku,
        price: createDto.price,
        costPrice: createDto.price * 0.8, // 80% of selling price
        gstSlab: this.mapGstPercentToSlab(createDto.gstPercent),
        stockQuantity: createDto.stockQuantity,
        minStockLevel: createDto.minStockLevel || 10,
        unit: createDto.unit || 'pcs',
      },
    });

    return product;
  }

  async findAll(businessId: string) {
    return this.prisma.product.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(businessId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        businessId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(businessId: string, productId: string, updateDto: any) {
    // Check if product belongs to this business
    await this.findOne(businessId, productId);

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: updateDto,
    });

    return updatedProduct;
  }

  async remove(businessId: string, productId: string) {
    await this.findOne(businessId, productId);

    return this.prisma.product.delete({
      where: { id: productId },
    });
  }

  async getLowStockProducts(businessId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        stockQuantity: { lte: this.prisma.product.fields.minStockLevel },
      },
      orderBy: { stockQuantity: 'asc' },
    });

    return products;
  }

  private generateSku(name: string): string {
    return name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 8)
      .padEnd(8, '0');
  }

  private mapGstPercentToSlab(percent: number): GstSlab {
    switch (percent) {
      case 0: return GstSlab.ZERO;
      case 5: return GstSlab.FIVE;
      case 12: return GstSlab.TWELVE;
      case 18: return GstSlab.EIGHTEEN;
      case 28: return GstSlab.TWENTYEIGHT;
      default: return GstSlab.EIGHTEEN;
    }
  }
}
