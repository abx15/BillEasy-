// Auth Service Tests
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createMockUser, createMockBusiness } from '../../../test/factories/user.factory';
import { mockPrismaService } from '../../../test/mocks/prisma.mock';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaMock: typeof mockPrismaService;
  let jwtServiceMock: jest.Mocked<JwtService>;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    prismaMock = { ...mockPrismaService };
    jwtServiceMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;
    
    configServiceMock = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      businessName: 'Test Medical Store',
      ownerName: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      password: 'password123',
      gstNumber: '27AAAPL1234C1ZV',
      address: '123 Test Street',
    };

    it('should register a new business and user', async () => {
      // Arrange
      const mockBusiness = createMockBusiness({ email: registerDto.email });
      const mockUser = createMockUser({ email: registerDto.email });
      
      prismaMock.business.findFirst.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      
      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });
      
      prismaMock.business.create.mockResolvedValue(mockBusiness);
      prismaMock.user.create.mockResolvedValue(mockUser);
      
      jwtServiceMock.sign.mockReturnValue('mock-token');
      configServiceMock.get.mockReturnValue('test-secret');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(prismaMock.business.findFirst).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(prismaMock.business.create).toHaveBeenCalledWith({
        data: {
          name: registerDto.businessName,
          ownerName: registerDto.ownerName,
          phone: registerDto.phone,
          email: registerDto.email,
          gstNumber: registerDto.gstNumber,
          address: registerDto.address,
        },
      });
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          businessId: mockBusiness.id,
          name: registerDto.ownerName,
          email: registerDto.email,
          password: 'hashedPassword',
          role: 'OWNER',
        },
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw ConflictException if email exists', async () => {
      // Arrange
      const existingBusiness = createMockBusiness({ email: registerDto.email });
      prismaMock.business.findFirst.mockResolvedValue(existingBusiness);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(prismaMock.business.findFirst).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should login with correct credentials', async () => {
      // Arrange
      const mockUser = createMockUser({ email: loginDto.email });
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        business: createMockBusiness(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      
      jwtServiceMock.sign.mockReturnValue('mock-token');
      configServiceMock.get.mockReturnValue('test-secret');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        include: { business: true },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      // Arrange
      const mockUser = createMockUser({ email: loginDto.email });
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        business: createMockBusiness(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      // Arrange
      const mockUser = createMockUser({ email: loginDto.email, isActive: false });
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        business: createMockBusiness(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    const refreshToken = 'valid-refresh-token';

    it('should return new access token for valid refresh token', async () => {
      // Arrange
      const mockUser = createMockUser();
      const payload = { sub: mockUser.id, businessId: mockUser.businessId, role: mockUser.role, email: mockUser.email };
      
      jwtServiceMock.verify.mockReturnValue(payload);
      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      jwtServiceMock.sign.mockReturnValue('new-access-token');
      configServiceMock.get.mockReturnValue('test-secret');

      // Act
      const result = await service.refreshToken(refreshToken);

      // Assert
      expect(jwtServiceMock.verify).toHaveBeenCalledWith(refreshToken, {
        secret: 'test-secret',
      });
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual({ accessToken: 'new-access-token' });
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      // Arrange
      jwtServiceMock.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found during refresh', async () => {
      // Arrange
      const payload = { sub: 'non-existent-user' };
      jwtServiceMock.verify.mockReturnValue(payload);
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getMe', () => {
    const userId = 'user-123';

    it('should return user without password', async () => {
      // Arrange
      const mockUser = createMockUser({ id: userId });
      prismaMock.user.findUnique.mockResolvedValue({
        ...mockUser,
        business: createMockBusiness(),
      });

      // Act
      const result = await service.getMe(userId);

      // Assert
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
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
      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(userId);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getMe(userId)).rejects.toThrow(UnauthorizedException);
    });
  });
});
