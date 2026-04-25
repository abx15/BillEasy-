// Billing Service Tests
import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from '../billing.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProductsService } from '../../products/products.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { createMockBill, createMockBillItem, createMockProduct } from '../../../test/factories/bill.factory';
import { createMockCustomer } from '../../../test/factories/customer.factory';
import { mockPrismaService } from '../../../test/mocks/prisma.mock';
import { mockNotificationsService } from '../../../test/mocks/notifications.mock';

describe('BillingService', () => {
  let service: BillingService;
  let prismaMock: typeof mockPrismaService;
  let productsServiceMock: jest.Mocked<ProductsService>;
  let notificationsServiceMock: typeof mockNotificationsService;
  let configServiceMock: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    prismaMock = { ...mockPrismaService };
    productsServiceMock = {
      adjustStock: jest.fn(),
    } as any;
    notificationsServiceMock = { ...mockNotificationsService };
    configServiceMock = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: ProductsService,
          useValue: productsServiceMock,
        },
        {
          provide: NotificationsService,
          useValue: notificationsServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBill', () => {
    const businessId = 'business-123';
    const userId = 'user-123';
    
    const createBillDto = {
      customerId: 'customer-123',
      items: [
        {
          productId: 'product-123',
          quantity: 2,
          price: 100,
        },
      ],
      discountAmount: 0,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.CASH,
      notes: 'Test bill',
    };

    it('should create bill and reduce stock', async () => {
      // Arrange
      const mockProduct = createMockProduct({ 
        id: 'product-123', 
        stockQuantity: 50,
        gstPercent: 18,
      });
      const mockCustomer = createMockCustomer({ id: 'customer-123' });
      const mockBill = createMockBill();

      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      prismaMock.customer.create.mockResolvedValue(mockCustomer);
      prismaMock.bill.create.mockResolvedValue(mockBill);
      prismaMock.billItem.create.mockResolvedValue(createMockBillItem());
      prismaMock.payment.create.mockResolvedValue({} as any);
      prismaMock.bill.findFirst.mockResolvedValue(mockBill);
      
      // Mock the findOne method call within createBill
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBill);

      // Act
      const result = await service.createBill(businessId, userId, createBillDto);

      // Assert
      expect(prismaMock.product.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ['product-123'] },
          businessId,
          isActive: true,
        },
      });
      expect(productsServiceMock.adjustStock).toHaveBeenCalledWith('product-123', {
        quantity: 2,
        operation: 'decrement',
      });
      expect(prismaMock.bill.create).toHaveBeenCalled();
      expect(prismaMock.billItem.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException if stock insufficient', async () => {
      // Arrange
      const mockProduct = createMockProduct({ 
        id: 'product-123', 
        stockQuantity: 1, // Less than requested quantity
      });

      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      prismaMock.product.findMany.mockResolvedValue([mockProduct]);

      // Act & Assert
      await expect(service.createBill(businessId, userId, createBillDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should calculate GST correctly', async () => {
      // Arrange
      const mockProduct = createMockProduct({ 
        id: 'product-123', 
        stockQuantity: 50,
        gstPercent: 18,
      });
      const mockCustomer = createMockCustomer({ id: 'customer-123' });
      
      const expectedBill = createMockBill({
        subtotal: 200, // 100 * 2
        gstAmount: 36, // 200 * 18%
        totalAmount: 236, // 200 + 36
      });

      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      prismaMock.customer.create.mockResolvedValue(mockCustomer);
      prismaMock.bill.create.mockResolvedValue(expectedBill);
      prismaMock.billItem.create.mockResolvedValue(createMockBillItem());
      prismaMock.payment.create.mockResolvedValue({} as any);
      prismaMock.bill.findFirst.mockResolvedValue(expectedBill);
      
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedBill);

      // Act
      const result = await service.createBill(businessId, userId, createBillDto);

      // Assert
      expect(prismaMock.bill.create).toHaveBeenCalledWith(
        expect.objectContaining({
          subtotal: 200,
          gstAmount: 36,
          totalAmount: 236,
        })
      );
    });

    it('should fire notifications without awaiting', async () => {
      // Arrange
      const mockProduct = createMockProduct({ 
        id: 'product-123', 
        stockQuantity: 50,
        gstPercent: 18,
      });
      const mockCustomer = createMockCustomer({ id: 'customer-123' });
      const mockBill = createMockBill();

      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      prismaMock.customer.create.mockResolvedValue(mockCustomer);
      prismaMock.bill.create.mockResolvedValue(mockBill);
      prismaMock.billItem.create.mockResolvedValue(createMockBillItem());
      prismaMock.payment.create.mockResolvedValue({} as any);
      prismaMock.bill.findFirst.mockResolvedValue(mockBill);
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBill);

      // Mock the notification service to track calls
      const sendBillNotificationsSpy = jest.spyOn(notificationsServiceMock, 'sendBillNotifications');
      sendBillNotificationsSpy.mockResolvedValue(undefined);

      // Act
      await service.createBill(businessId, userId, createBillDto);

      // Assert - Notifications should be called but not awaited
      expect(sendBillNotificationsSpy).toHaveBeenCalledWith(mockBill.id, 'customer-123');
    });

    it('should create walk-in customer when only phone is provided', async () => {
      // Arrange
      const createBillDtoWithPhone = {
        ...createBillDto,
        customerId: undefined,
        customerPhone: '+1234567890',
      };

      const mockProduct = createMockProduct({ 
        id: 'product-123', 
        stockQuantity: 50,
        gstPercent: 18,
      });
      const mockWalkInCustomer = createMockCustomer({ 
        id: 'walkin-123',
        name: 'Walk-in Customer',
        phone: '+1234567890',
      });
      const mockBill = createMockBill();

      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      prismaMock.product.findMany.mockResolvedValue([mockProduct]);
      prismaMock.customer.create.mockResolvedValue(mockWalkInCustomer);
      prismaMock.bill.create.mockResolvedValue(mockBill);
      prismaMock.billItem.create.mockResolvedValue(createMockBillItem());
      prismaMock.payment.create.mockResolvedValue({} as any);
      prismaMock.bill.findFirst.mockResolvedValue(mockBill);
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockBill);

      // Act
      await service.createBill(businessId, userId, createBillDtoWithPhone);

      // Assert
      expect(prismaMock.customer.create).toHaveBeenCalledWith({
        data: {
          businessId,
          name: 'Walk-in Customer',
          phone: '+1234567890',
        },
      });
    });

    it('should throw BadRequestException when no customer provided', async () => {
      // Arrange
      const createBillDtoNoCustomer = {
        ...createBillDto,
        customerId: undefined,
        customerPhone: undefined,
      };

      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      // Act & Assert
      await expect(service.createBill(businessId, userId, createBillDtoNoCustomer))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('updatePayment', () => {
    const businessId = 'business-123';
    const billId = 'bill-123';
    
    const updatePaymentDto = {
      amount: 100,
      method: PaymentMethod.CASH,
    };

    it('should mark bill as PAID when full amount received', async () => {
      // Arrange
      const mockBill = createMockBill({
        totalAmount: 100,
        paymentStatus: PaymentStatus.PENDING,
      });

      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      jest.spyOn(service, 'findOne').mockResolvedValue(mockBill);
      prismaMock.payment.findMany.mockResolvedValue([]);
      prismaMock.payment.create.mockResolvedValue({} as any);
      prismaMock.bill.update.mockResolvedValue({
        ...mockBill,
        paymentStatus: PaymentStatus.PAID,
      });

      // Act
      const result = await service.updatePayment(businessId, billId, updatePaymentDto);

      // Assert
      expect(prismaMock.bill.update).toHaveBeenCalledWith({
        where: { id: billId },
        data: { paymentStatus: PaymentStatus.PAID },
      });
    });

    it('should mark bill as PARTIAL when partial amount received', async () => {
      // Arrange
      const mockBill = createMockBill({
        totalAmount: 200,
        paymentStatus: PaymentStatus.PENDING,
      });

      prismaMock.$transaction.mockImplementation(async (callback) => {
        return callback(prismaMock);
      });

      jest.spyOn(service, 'findOne').mockResolvedValue(mockBill);
      prismaMock.payment.findMany.mockResolvedValue([]);
      prismaMock.payment.create.mockResolvedValue({} as any);
      prismaMock.bill.update.mockResolvedValue({
        ...mockBill,
        paymentStatus: PaymentStatus.PARTIAL,
      });

      // Act
      const result = await service.updatePayment(businessId, billId, updatePaymentDto);

      // Assert
      expect(prismaMock.bill.update).toHaveBeenCalledWith({
        where: { id: billId },
        data: { paymentStatus: PaymentStatus.PARTIAL },
      });
    });
  });

  describe('findOne', () => {
    const businessId = 'business-123';
    const billId = 'bill-123';

    it('should return bill with all relations', async () => {
      // Arrange
      const mockBill = createMockBill();
      prismaMock.bill.findFirst.mockResolvedValue(mockBill);

      // Act
      const result = await service.findOne(businessId, billId);

      // Assert
      expect(prismaMock.bill.findFirst).toHaveBeenCalledWith({
        where: {
          id: billId,
          businessId,
        },
        include: {
          customer: true,
          items: {
            include: {
              product: {
                select: { name: true, sku: true, gstPercent: true },
              },
            },
          },
          payments: {
            orderBy: { paidAt: 'desc' },
          },
        },
      });
      expect(result).toEqual(mockBill);
    });

    it('should throw NotFoundException if bill not found', async () => {
      // Arrange
      prismaMock.bill.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(businessId, billId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const businessId = 'business-123';

    it('should return paginated bills', async () => {
      // Arrange
      const mockBills = [createMockBill(), createMockBill()];
      prismaMock.bill.findMany.mockResolvedValue(mockBills);
      prismaMock.bill.count.mockResolvedValue(2);

      // Act
      const result = await service.findAll(businessId, {});

      // Assert
      expect(result).toEqual({
        data: mockBills,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('should filter bills by status', async () => {
      // Arrange
      const mockBills = [createMockBill({ paymentStatus: PaymentStatus.PAID })];
      prismaMock.bill.findMany.mockResolvedValue(mockBills);
      prismaMock.bill.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll(businessId, { status: PaymentStatus.PAID });

      // Assert
      expect(prismaMock.bill.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            businessId,
            paymentStatus: PaymentStatus.PAID,
          },
        })
      );
    });

    it('should filter bills by date range', async () => {
      // Arrange
      const mockBills = [createMockBill()];
      prismaMock.bill.findMany.mockResolvedValue(mockBills);
      prismaMock.bill.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll(businessId, { 
        from: '2026-01-01', 
        to: '2026-01-31' 
      });

      // Assert
      expect(prismaMock.bill.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            businessId,
            createdAt: {
              gte: new Date('2026-01-01'),
              lte: new Date('2026-01-31'),
            },
          },
        })
      );
    });
  });
});
