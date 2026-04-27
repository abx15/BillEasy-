// Create Product DTO - Product creation validation
import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  Min, 
  Max, 
  IsEnum, 
  IsNotEmpty,
  IsDate 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsNumber()
  @Min(0, { message: 'Price must be 0 or greater' })
  @Type(() => Number)
  price: number;

  @IsNumber()
  @IsEnum([0, 5, 12, 18, 28], { message: 'GST percentage must be one of: 0, 5, 12, 18, 28' })
  @Type(() => Number)
  gstPercent: number;

  @IsNumber()
  @Min(0, { message: 'Stock quantity must be 0 or greater' })
  @Type(() => Number)
  stockQuantity: number;

  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'Low stock alert must be at least 1' })
  @Type(() => Number)
  minStockLevel?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  batchNumber?: string;
}
