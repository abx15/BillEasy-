// Auth Service - Authentication business logic
import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

export interface RegisterDto {
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  gstNumber?: string;
  address: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthTokens> {
    const { businessName, ownerName, phone, email, password, gstNumber, address } = registerDto;

    // Check if business already exists
    const existingBusiness = await this.prisma.business.findFirst({
      where: { email },
    });

    if (existingBusiness) {
      throw new ConflictException('Business with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create business and owner user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name: businessName,
          ownerName,
          phone,
          email,
          gstNumber,
          address,
        },
      });

      const user = await tx.user.create({
        data: {
          businessId: business.id,
          firstName: ownerName,
          email,
          passwordHash: hashedPassword,
          role: UserRole.OWNER,
        },
      });

      return { business, user };
    });

    return this.generateTokens(result.user.id, result.business.id, result.user.role, result.user.email);
  }

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    const { email, password } = loginDto;

    // Find user with business
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { business: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return this.generateTokens(user.id, user.businessId, user.role, user.email);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign({
        sub: user.id,
        businessId: user.businessId,
        role: user.role,
        email: user.email,
      }, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    // In a real app, you might want to invalidate the refresh token
    // For now, we'll just return success
    // You could store refresh tokens in database and delete them here
  }

  private generateTokens(userId: string, businessId: string, role: UserRole, email: string): AuthTokens {
    const payload = { sub: userId, businessId, role, email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            ownerName: true,
            phone: true,
            email: true,
            gstNumber: true,
            address: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from response
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
