import { PrismaClient, GstSlab } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  await prisma.payment.deleteMany();
  await prisma.billItem.deleteMany();
  await prisma.bill.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.business.deleteMany();

  // Create demo business
  const business = await prisma.business.create({
    data: {
      name: 'MediPlus Pharmacy',
      ownerName: 'Dr. Rajesh Kumar',
      phone: '+919876543210',
      email: 'rajesh@mediplus.in',
      gstNumber: '27AAAPL1234C1ZV',
      address: '123 MG Road, Bangalore, Karnataka - 560001',
    },
  });

  console.log('Created business:', business.name);

  // Create owner user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      businessId: business.id,
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'rajesh@mediplus.in',
      passwordHash: hashedPassword,
      role: 'OWNER',
    },
  });

  console.log('Created user:', user.email);

  const categoryMedical = await prisma.category.create({
    data: {
      name: 'Medicines',
      businessId: business.id,
      gstSlab: GstSlab.TWELVE,
    }
  });

  const categoryGeneral = await prisma.category.create({
    data: {
      name: 'General',
      businessId: business.id,
      gstSlab: GstSlab.EIGHTEEN,
    }
  });

  // Create sample products (mix of medical and general items)
  const products = [
    // Medical items
    {
      name: 'Paracetamol 500mg',
      sku: 'MED001',
      price: 15.50,
      costPrice: 10.00,
      gstSlab: GstSlab.TWELVE,
      stockQuantity: 100,
      minStockLevel: 20,
      unit: 'strips',
      categoryId: categoryMedical.id,
    },
    {
      name: 'Dolo 650mg',
      sku: 'MED002',
      price: 25.00,
      costPrice: 15.00,
      gstSlab: GstSlab.TWELVE,
      stockQuantity: 50,
      minStockLevel: 15,
      unit: 'strips',
      categoryId: categoryMedical.id,
    },
    // General items
    {
      name: 'Hand Sanitizer',
      sku: 'GEN001',
      price: 45.00,
      costPrice: 25.00,
      gstSlab: GstSlab.EIGHTEEN,
      stockQuantity: 60,
      minStockLevel: 20,
      unit: 'bottles',
      categoryId: categoryGeneral.id,
    },
    {
      name: 'Face Mask',
      sku: 'GEN002',
      price: 10.00,
      costPrice: 5.00,
      gstSlab: GstSlab.TWELVE,
      stockQuantity: 200,
      minStockLevel: 50,
      unit: 'pieces',
      categoryId: categoryGeneral.id,
    }
  ];

  // @ts-ignore
  for (const productData of products) {
    await prisma.product.create({
      data: {
        businessId: business.id,
        // @ts-ignore
        ...productData,
      },
    });
  }

  console.log('Created sample products');

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
    }
  ];

  for (const customerData of customers) {
    await prisma.customer.create({
      data: {
        businessId: business.id,
        ...customerData,
      },
    });
  }

  console.log('Created sample customers');
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
