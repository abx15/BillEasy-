#!/bin/bash

# BillEasy Database Setup Script
# This script sets up the database schema and seeds initial data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable is not set"
    echo "Please set DATABASE_URL and try again"
    exit 1
fi

print_status "Starting BillEasy database setup..."

# Change to the API directory
cd "$(dirname "$0")/.."

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Run database migrations
print_status "Running database migrations..."
npx prisma db push --force-reset

# Seed the database
print_status "Seeding database with initial data..."
node scripts/seed-database.js

# Verify the setup
print_status "Verifying database setup..."
if npx prisma db seed --preview-feature 2>/dev/null; then
    print_success "Database setup completed successfully!"
    echo ""
    echo "📊 Database Summary:"
    echo "- 3 Sample businesses created"
    echo "- 3 Sample users created (password: password123)"
    echo "- 9 Sample customers created (including walk-in customers)"
    echo "- 9 Sample categories created"
    echo "- 9 Sample products created"
    echo "- Initial stock movements recorded"
    echo ""
    echo "🔑 Login Credentials:"
    echo "- Email: rajesh@medicare.com"
    echo "- Password: password123"
    echo ""
    echo "🚀 You can now start the application with: npm run dev"
else
    print_error "Database setup verification failed"
    exit 1
fi
