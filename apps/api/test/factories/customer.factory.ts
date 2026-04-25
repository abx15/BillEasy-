// Customer Factory - Create mock customers for testing
export const createMockCustomer = (overrides: Partial<any> = {}) => ({
  id: 'customer-123',
  businessId: 'business-123',
  name: 'Jane Smith',
  phone: '+1234567890',
  email: 'jane@example.com',
  address: '456 Customer Lane, Test City',
  gstNumber: null,
  creditLimit: 0,
  currentBalance: 0,
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

export const createMockCustomers = (count: number, baseOverrides: Partial<any> = {}) => 
  Array.from({ length: count }, (_, index) => 
    createMockCustomer({
      id: `customer-${index + 1}`,
      name: `Customer ${index + 1}`,
      phone: `+123456789${index}`,
      email: `customer${index + 1}@example.com`,
      ...baseOverrides,
    })
  );
