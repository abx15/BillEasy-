// Product Factory - Create mock products for testing
export const createMockProduct = (overrides: Partial<any> = {}) => ({
  id: 'product-123',
  businessId: 'business-123',
  sku: 'PARA-500',
  name: 'Paracetamol 500mg',
  description: 'Paracetamol tablet 500mg',
  category: 'Medicine',
  price: 10.50,
  cost: 5.25,
  stock: 100,
  minStock: 20,
  gstRate: 18,
  hsnCode: '30049099',
  imageUrl: null,
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  ...overrides,
});

export const createMockLowStockProduct = (overrides: Partial<any> = {}) => 
  createMockProduct({
    stock: 5,
    minStock: 20,
    ...overrides,
  });

export const createMockProducts = (count: number, baseOverrides: Partial<any> = {}) => 
  Array.from({ length: count }, (_, index) => 
    createMockProduct({
      id: `product-${index + 1}`,
      sku: `SKU-${index + 1}`,
      name: `Product ${index + 1}`,
      ...baseOverrides,
    })
  );
