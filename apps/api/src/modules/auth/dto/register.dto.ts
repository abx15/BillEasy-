// Register DTO - Registration request validation
import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  MinLength, 
  Matches, 
  IsNotEmpty 
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'Business name must be at least 2 characters long' })
  @IsNotEmpty({ message: 'Business name is required' })
  businessName: string;

  @IsString()
  @MinLength(2, { message: 'Owner name must be at least 2 characters long' })
  @IsNotEmpty({ message: 'Owner name is required' })
  ownerName: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian phone number' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, { 
    message: 'Password must contain at least one number and one special character' 
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, { 
    message: 'Invalid GST number format' 
  })
  gstNumber?: string;

  @IsString()
  @MinLength(5, { message: 'Address must be at least 5 characters long' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;
}
