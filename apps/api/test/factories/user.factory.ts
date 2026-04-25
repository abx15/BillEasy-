// User Factory - Create mock users for testing
import { UserRole } from '@prisma/client';

export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: 'user-123',
  businessId: 'business-123',
  name: 'John Doe',
  email: 'john@example.com',
  password: '$2b$12$hashedpassword123456789012345678901234567890123456789012345678',
  role: UserRole.OWNER,
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

export const createMockBusiness = (overrides: Partial<any> = {}) => ({
  id: 'business-123',
  name: 'Test Medical Store',
  ownerName: 'John Doe',
  phone: '+1234567890',
  email: 'john@example.com',
  gstNumber: '27AAAPL1234C1ZV',
  address: '123 Test Street, Test City',
  logoUrl: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

export const createMockUserWithBusiness = (overrides: Partial<any> = {}) => ({
  user: createMockUser(overrides.user),
  business: createMockBusiness(overrides.business),
});
