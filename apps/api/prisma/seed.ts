// Prisma Seed - Demo data for BillEasy
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create demo business
  const business = await prisma.business.create({
    data: {
      name: 'MediPlus Pharmacy',
      ownerName: 'Dr. Rajesh Kumar',
      phone: '+919876543210',
      email: 'rajesh@mediplus.in',
      gstNumber: '27AAAPL1234C1ZV',
      address: '123 MG Road, Bangalore, Karnataka - 560001',
      invoicePrefix: 'MED',
    },
  });

  console.log('Created business:', business.name);

  // Create owner user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      businessId: business.id,
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh@mediplus.in',
      password: hashedPassword,
      role: 'OWNER',
    },
  });

  console.log('Created user:', user.email);

  // Create sample products (mix of medical and general items)
  const products = [
    // Medical items
    {
      name: 'Paracetamol 500mg',
      sku: 'MED001',
      price: 15.50,
      gstPercent: 12,
      stockQuantity: 100,
      lowStockAlert: 20,
      unit: 'strips',
      category: 'Medicines',
      expiryDate: new Date('2025-12-31'),
      batchNumber: 'P2024001',
    },
    {
      name: 'Dolo 650mg',
      sku: 'MED002',
      price: 25.00,
      gstPercent: 12,
      stockQuantity: 50,
      lowStockAlert: 15,
      unit: 'strips',
      category: 'Medicines',
      expiryDate: new Date('2025-08-15'),
      batchNumber: 'D2024002',
    },
    {
      name: 'Azithromycin 250mg',
      sku: 'MED003',
      price: 120.00,
      gstPercent: 12,
      stockQuantity: 30,
      lowStockAlert: 10,
      unit: 'strips',
      category: 'Antibiotics',
      expiryDate: new Date('2025-06-30'),
      batchNumber: 'A2024003',
    },
    {
      name: 'Volini Spray',
      sku: 'MED004',
      price: 180.00,
      gstPercent: 18,
      stockQuantity: 25,
      lowStockAlert: 8,
      unit: 'pieces',
      category: 'Pain Relief',
      expiryDate: new Date('2025-10-20'),
      batchNumber: 'V2024004',
    },
    {
      name: 'Betadine Solution',
      sku: 'MED005',
      price: 85.00,
      gstPercent: 18,
      stockQuantity: 40,
      lowStockAlert: 12,
      unit: 'bottles',
      category: 'Antiseptics',
      expiryDate: new Date('2026-01-15'),
      batchNumber: 'B2024005',
    },
    // General items
    {
      name: 'Hand Sanitizer',
      sku: 'GEN001',
      price: 45.00,
      gstPercent: 18,
      stockQuantity: 60,
      lowStockAlert: 20,
      unit: 'bottles',
      category: 'General',
    },
    {
      name: 'Face Mask',
      sku: 'GEN002',
      price: 10.00,
      gstPercent: 12,
      stockQuantity: 200,
      lowStockAlert: 50,
      unit: 'pieces',
      category: 'General',
    },
    {
      name: 'Gloves (Latex)',
      sku: 'GEN003',
      price: 25.00,
      gstPercent: 18,
      stockQuantity: 100,
      lowStockAlert: 30,
      unit: 'boxes',
      category: 'General',
    },
    {
      name: 'Thermometer',
      sku: 'GEN004',
      price: 150.00,
      gstPercent: 18,
      stockQuantity: 20,
      lowStockAlert: 5,
      unit: 'pieces',
      category: 'Equipment',
    },
    {
      name: 'BP Monitor',
      sku: 'GEN005',
      price: 1200.00,
      gstPercent: 18,
      stockQuantity: 8,
      lowStockAlert: 3,
      unit: 'pieces',
      category: 'Equipment',
    },
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: {
        businessId: business.id,
        ...productData,
      },
    });
  }

  console.log('Created 10 sample products');

  // Create sample customers
  const customers = [
    {
      name: 'Mrs. Priya Sharma',
      phone: '+919876543211',
      email: 'priya.sharma@email.com',
      address: '45 Brigade Road, Bangalore',
    },
    {
      name: 'Mr. Amit Patel',
      phone: '+919876543212',
      email: 'amit.patel@email.com',
      address: '22 Indiranagar, Bangalore',
    },
    {
      name: 'Dr. Sunita Reddy',
      phone: '+919876543213',
      email: 'sunita.reddy@hospital.com',
      address: 'MG Hospital, Bangalore',
    },
  ];

  for (const customerData of customers) {
    await prisma.customer.create({
      data: {
        businessId: business.id,
        ...customerData,
      },
    });
  }

  console.log('Created 3 sample customers');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
