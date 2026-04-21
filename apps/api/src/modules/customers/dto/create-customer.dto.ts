// Create Customer DTO - Customer creation validation
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  Matches, 
  IsNotEmpty 
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian phone number' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
