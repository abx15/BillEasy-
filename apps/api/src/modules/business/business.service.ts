// Business Service - Business profile business logic
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { v2 as cloudinary } from 'cloudinary';

export interface UpdateBusinessDto {
  name?: string;
  ownerName?: string;
  phone?: string;
  gstNumber?: string;
  address?: string;
}

@Injectable()
export class BusinessService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async getProfile(businessId: string) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        _count: {
          select: {
            users: true,
            customers: true,
            products: true,
            bills: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  async updateProfile(businessId: string, updateDto: UpdateBusinessDto) {
    const { gstNumber } = updateDto;

    // Validate GST number format if provided
    if (gstNumber && !this.isValidGSTNumber(gstNumber)) {
      throw new BadRequestException('Invalid GST number format');
    }

    const updatedBusiness = await this.prisma.business.update({
      where: { id: businessId },
      data: updateDto,
    });

    return updatedBusiness;
  }

  async uploadLogo(businessId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.buffer, {
        folder: 'billeasy/logos',
        resource_type: 'auto',
        public_id: `business_${businessId}_logo`,
      });

      // Update business with logo URL
      const updatedBusiness = await this.prisma.business.update({
        where: { id: businessId },
        data: {
          logoUrl: result.secure_url,
        },
      });

      return {
        logoUrl: updatedBusiness.logoUrl,
        publicId: result.public_id,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload logo');
    }
  }

  private isValidGSTNumber(gstNumber: string): boolean {
    // GST number format: 22AAAAA0000A1ZV
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
  }
}
