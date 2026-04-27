// Bill Factory - Create mock bills for testing
import { PaymentStatus } from '@prisma/client';

export const createMockBillItem = (overrides: Partial<any> = {}) => ({
  id: 'bill-item-123',
  billId: 'bill-123',
  productId: 'product-123',
  productName: 'Paracetamol 500mg',
  sku: 'PARA-500',
  quantity: 2,
  price: 10.50,
  gstRate: 18,
  cgst: 3.78,
  sgst: 3.78,
  igst: 0,
  total: 23.56,
  ...overrides,
});

export const createMockBill = (overrides: Partial<any> = {}) => ({
  id: 'bill-123',
  businessId: 'business-123',
  customerId: 'customer-123',
  invoiceNumber: 'INV-2026-001',
  subtotal: 100.00,
  discount: 0,
  cgst: 9.00,
  sgst: 9.00,
  igst: 0,
  total: 118.00,
  paymentStatus: PaymentStatus.PAID,
  paymentMethod: 'CASH',
  notes: 'Test bill',
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  items: [createMockBillItem()],
  ...overrides,
});

export const createMockUnpaidBill = (overrides: Partial<any> = {}) => 
  createMockBill({
    paymentStatus: PaymentStatus.PENDING,
    paymentMethod: null,
    ...overrides,
  });

export const createMockPartialBill = (overrides: Partial<any> = {}) => 
  createMockBill({
    paymentStatus: PaymentStatus.PARTIAL,
    ...overrides,
  });

export const createMockBills = (count: number, baseOverrides: Partial<any> = {}) => 
  Array.from({ length: count }, (_, index) => 
    createMockBill({
      id: `bill-${index + 1}`,
      invoiceNumber: `INV-2026-${String(index + 1).padStart(3, '0')}`,
      ...baseOverrides,
    })
  );
