#!/usr/bin/env node

/**
 * BillEasy Database Seeder
 * This script seeds the database with initial data for testing and demonstration
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Sample data
const businesses = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'MediCare Pharmacy',
    ownerName: 'Dr. Rajesh Kumar',
    email: 'rajesh@medicare.com',
    phone: '+91-9876543210',
    address: '123 Main Street, Mumbai, Maharashtra 400001',
    gstNumber: '27AAAPL1234C1ZV',
    panNumber: 'ABCDE1234F',
    isActive: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'QuickHealth Medical',
    ownerName: 'Dr. Priya Sharma',
    email: 'priya@quickhealth.com',
    phone: '+91-9876543211',
    address: '456 Park Avenue, Delhi, Delhi 110001',
    gstNumber: '27AAAPL5678C2ZV',
    panNumber: 'FGHIJ5678G',
    isActive: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Wellness Center',
    ownerName: 'Dr. Amit Patel',
    email: 'amit@wellness.com',
    phone: '+91-9876543212',
    address: '789 Cross Road, Bangalore, Karnataka 560001',
    gstNumber: '27AAAPL9012C3ZV',
    panNumber: 'KLMNO9012H',
    isActive: true
  }
];

const users = [
  {
    id: '660e8400-e29b-41d4-a716-446655440000',
    email: 'rajesh@medicare.com',
    password: 'password123',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    phone: '+91-9876543210',
    role: 'owner',
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440001',
    email: 'priya@quickhealth.com',
    password: 'password123',
    firstName: 'Priya',
    lastName: 'Sharma',
    phone: '+91-9876543211',
    role: 'owner',
    businessId: '550e8400-e29b-41d4-a716-446655440001'
  },
  {
    id: '660e8400-e29b-41d4-a716-446655440002',
    email: 'amit@wellness.com',
    password: 'password123',
    firstName: 'Amit',
    lastName: 'Patel',
    phone: '+91-9876543212',
    role: 'owner',
    businessId: '550e8400-e29b-41d4-a716-446655440002'
  }
];

const customers = [
  {
    id: '770e8400-e29b-41d4-a716-446655440000',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91-9876543210',
    address: '123 Customer Lane, Mumbai',
    gstNumber: '27AAAPL9999C1ZV',
    isWalkIn: false,
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440001',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+91-9876543211',
    address: '456 Customer Street, Mumbai',
    gstNumber: '27AAAPL8888C1ZV',
    isWalkIn: false,
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    id: '770e8400-e29b-41d4-a716-446655440002',
    name: 'Walk-in Customer',
    isWalkIn: true,
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  }
];

const categories = [
  {
    id: '880e8400-e29b-41d4-a716-446655440000',
    name: 'Medicines',
    description: 'Pharmaceutical medicines and drugs',
    hsnCode: '3004',
    gstSlab: '12',
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440001',
    name: 'Medical Devices',
    description: 'Medical equipment and devices',
    hsnCode: '9018',
    gstSlab: '18',
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    id: '880e8400-e29b-41d4-a716-446655440002',
    name: 'Personal Care',
    description: 'Personal care and hygiene products',
    hsnCode: '3304',
    gstSlab: '18',
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  }
];

const products = [
  {
    id: '990e8400-e29b-41d4-a716-446655440000',
    name: 'Paracetamol 500mg',
    description: 'Pain relief medication',
    sku: 'PARA-500',
    barcode: '8901234567890',
    unit: 'pcs',
    price: 10.50,
    costPrice: 7.50,
    gstSlab: '18',
    hsnCode: '3004',
    stockQuantity: 100,
    minStockLevel: 20,
    isActive: true,
    categoryId: '880e8400-e29b-41d4-a716-446655440000',
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440001',
    name: 'Azithromycin 250mg',
    description: 'Antibiotic medication',
    sku: 'AZI-250',
    barcode: '8901234567891',
    unit: 'pcs',
    price: 85.00,
    costPrice: 65.00,
    gstSlab: '12',
    hsnCode: '3004',
    stockQuantity: 50,
    minStockLevel: 10,
    isActive: true,
    categoryId: '880e8400-e29b-41d4-a716-446655440000',
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  },
  {
    id: '990e8400-e29b-41d4-a716-446655440002',
    name: 'Blood Pressure Monitor',
    description: 'Digital BP monitoring device',
    sku: 'BPM-001',
    barcode: '8901234567892',
    unit: 'pcs',
    price: 2500.00,
    costPrice: 1800.00,
    gstSlab: '18',
    hsnCode: '9018',
    stockQuantity: 25,
    minStockLevel: 5,
    isActive: true,
    categoryId: '880e8400-e29b-41d4-a716-446655440001',
    businessId: '550e8400-e29b-41d4-a716-446655440000'
  }
];

async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await prisma.stockMovement.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.billItem.deleteMany();
    await prisma.bill.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.business.deleteMany();

    // Seed businesses
    console.log('🏢 Seeding businesses...');
    for (const business of businesses) {
      await prisma.business.create({ data: business });
    }

    // Hash passwords and seed users
    console.log('👤 Seeding users...');
    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      await prisma.user.create({
        data: {
          ...user,
          passwordHash: hashedPassword
        }
      });
    }

    // Seed customers
    console.log('👥 Seeding customers...');
    for (const customer of customers) {
      await prisma.customer.create({ data: customer });
    }

    // Seed categories
    console.log('📁 Seeding categories...');
    for (const category of categories) {
      await prisma.category.create({ data: category });
    }

    // Seed products
    console.log('💊 Seeding products...');
    for (const product of products) {
      await prisma.product.create({ data: product });
    }

    // Create initial stock movements
    console.log('📦 Creating initial stock movements...');
    for (const product of products) {
      await prisma.stockMovement.create({
        data: {
          id: uuidv4(),
          movementType: 'IN',
          quantity: product.stockQuantity,
          reason: 'Initial stock',
          productId: product.id,
          businessId: product.businessId
        }
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Businesses: ${businesses.length}`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Customers: ${customers.length}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Products: ${products.length}`);
    console.log(`- Stock Movements: ${products.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
