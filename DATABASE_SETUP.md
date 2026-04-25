# BillEasy Database Setup Guide

This guide covers setting up the BillEasy database with schema creation and data seeding.

## Overview

The BillEasy database uses PostgreSQL with the following main entities:
- **Businesses** - Medical stores/pharmacies
- **Users** - Application users with business associations
- **Customers** - Customer records (including walk-in customers)
- **Categories** - Product categories with GST information
- **Products** - Inventory items with stock tracking
- **Bills** - Invoice records with payment tracking
- **Bill Items** - Line items for each bill
- **Payments** - Payment transaction records
- **Stock Movements** - Inventory movement tracking

## Quick Setup

### Prerequisites

1. **PostgreSQL** installed and running
2. **Node.js** and **npm** installed
3. **Environment variables** configured

### Environment Setup

Create a `.env` file in the `apps/api` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/billeasy"

# Other required environment variables
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"
REDIS_URL="redis://localhost:6379"
```

### Automated Setup

The easiest way to set up the database is using the automated script:

```bash
# Navigate to the API directory
cd apps/api

# Run the setup script
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

This script will:
1. ✅ Install dependencies
2. ✅ Generate Prisma client
3. ✅ Create database schema
4. ✅ Seed initial data
5. ✅ Verify setup

### Manual Setup

If you prefer manual setup:

#### 1. Install Dependencies

```bash
cd apps/api
npm install
```

#### 2. Generate Prisma Client

```bash
npx prisma generate
```

#### 3. Create Database Schema

```bash
# Option A: Using Prisma migrations
npx prisma db push

# Option B: Using SQL file
psql -d billeasy -f prisma/migrations/001_create_initial_tables.sql
```

#### 4. Seed Database

```bash
# Using Node.js seeder
node scripts/seed-database.js

# Using SQL file
psql -d billeasy -f prisma/seed.sql
```

## Database Schema

### Core Tables

#### Businesses
```sql
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    gst_number VARCHAR(15),
    pan_number VARCHAR(10),
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Products
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(50),
    barcode VARCHAR(50),
    unit VARCHAR(20) DEFAULT 'pcs',
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    gst_slab gst_slab DEFAULT '18',
    hsn_code VARCHAR(8),
    stock_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 1000,
    is_active BOOLEAN DEFAULT true,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(business_id, sku)
);
```

#### Bills
```sql
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(12,2) NOT NULL,
    gst_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_status payment_status DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    notes TEXT,
    pdf_url VARCHAR(500),
    is_walk_in_customer BOOLEAN DEFAULT false,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(business_id, invoice_number)
);
```

### Enums

```sql
-- Payment status types
CREATE TYPE payment_status AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED');

-- GST slab types
CREATE TYPE gst_slab AS ENUM ('0', '5', '12', '18', '28');
```

## Sample Data

### Test Businesses

1. **MediCare Pharmacy** - Dr. Rajesh Kumar
   - Email: `rajesh@medicare.com`
   - GST: `27AAAPL1234C1ZV`

2. **QuickHealth Medical** - Dr. Priya Sharma
   - Email: `priya@quickhealth.com`
   - GST: `27AAAPL5678C2ZV`

3. **Wellness Center** - Dr. Amit Patel
   - Email: `amit@wellness.com`
   - GST: `27AAAPL9012C3ZV`

### Test Users

All test users have the password: `password123`

- **rajesh@medicare.com** - Owner (MediCare)
- **priya@quickhealth.com** - Owner (QuickHealth)
- **amit@wellness.com** - Owner (Wellness Center)

### Sample Products

1. **Paracetamol 500mg** - ₹10.50 (18% GST)
2. **Azithromycin 250mg** - ₹85.00 (12% GST)
3. **Blood Pressure Monitor** - ₹2,500.00 (18% GST)

## Verification

### Check Database Connection

```bash
# Test database connection
npx prisma db pull

# View database schema
npx prisma db pull --print
```

### Check Seeded Data

```sql
-- Count businesses
SELECT COUNT(*) FROM businesses;

-- Count products
SELECT COUNT(*) FROM products;

-- View sample bills
SELECT * FROM bills LIMIT 5;

-- Check stock levels
SELECT name, stock_quantity FROM products WHERE stock_quantity < min_stock_level;
```

## Common Operations

### Reset Database

```bash
# Complete reset (schema + data)
npx prisma db push --force-reset

# Reset data only (keep schema)
node scripts/seed-database.js
```

### Backup Database

```bash
# Create backup
pg_dump -h localhost -U username -d billeasy > backup.sql

# Restore backup
psql -h localhost -U username -d billeasy < backup.sql
```

### View Database in Prisma Studio

```bash
npx prisma studio
```

This will open a web interface at `http://localhost:5555` to browse the database.

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Ensure database exists

2. **Migration Failed**
   - Check PostgreSQL version compatibility
   - Verify SQL syntax
   - Check permissions

3. **Seed Failed**
   - Ensure schema is created first
   - Check foreign key constraints
   - Verify data types

### Debug Mode

Enable debug logging:

```bash
# Set debug environment
export DEBUG=prisma:*

# Run with verbose output
npx prisma db push --debug
```

## Production Considerations

### Security

1. Use strong database passwords
2. Enable SSL connections
3. Restrict database user permissions
4. Regular backups

### Performance

1. Add indexes for frequently queried columns
2. Monitor query performance
3. Optimize slow queries
4. Regular maintenance (VACUUM, ANALYZE)

### Monitoring

1. Monitor connection pool usage
2. Track slow queries
3. Monitor disk space
4. Set up alerting for issues

## Next Steps

After database setup:

1. **Start the application**: `npm run dev`
2. **Test authentication**: Login with test users
3. **Create sample data**: Add products, customers, bills
4. **Verify workflows**: Test complete billing flow

## Support

For database-related issues:

1. Check the [Prisma Documentation](https://www.prisma.io/docs/)
2. Review PostgreSQL logs
3. Test with different connection strings
4. Verify environment variables

---

**Note**: The sample data is for testing and demonstration purposes. In production, you should use your own business data and ensure proper data validation and security measures.
