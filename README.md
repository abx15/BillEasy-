# 🧾 BillEasy

<div align="center">

![BillEasy Logo](https://img.shields.io/badge/BillEasy-SaaS%20Billing%20Software-blue?style=for-the-badge)

**A comprehensive SaaS billing solution designed for Indian small businesses**

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red)](https://nestjs.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com/)

[▶️ Live Demo](https://billeasy-demo.vercel.app) | [📖 Documentation](./docs) | [🚀 Getting Started](#-getting-started)

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔧 Development](#-development)
- [🧪 Testing](#-testing)
- [🐳 Docker Setup](#-docker-setup)
- [📊 Monitoring](#-monitoring)
- [🚀 Deployment](#-deployment)
- [📝 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🌟 Features

### 💼 Business Management
- **Multi-tenant Architecture**: Support for multiple businesses from single instance
- **User Roles**: Owner, Manager, Staff with granular permissions
- **Business Profiles**: Complete business information management
- **Customer Management**: Comprehensive customer database with billing history

### 🧾 Billing & Invoicing
- **GST Compliant**: Full GST support with multiple slabs (0%, 5%, 12%, 18%, 28%)
- **Invoice Generation**: Professional PDF invoices with QR codes
- **Payment Tracking**: Multiple payment methods (Cash, UPI, Card, Credit)
- **Recurring Bills**: Automated recurring billing setup
- **Estimates & Proforma**: Convert estimates to invoices seamlessly

### 📦 Product & Inventory
- **Product Catalog**: Manage products with pricing, GST, and stock
- **Stock Management**: Real-time inventory tracking with movement history
- **Categories**: Organize products by categories and subcategories
- **Low Stock Alerts**: Automated notifications for low inventory

### 📊 Analytics & Reports
- **Financial Reports**: P&L statements, balance sheets, cash flow
- **Sales Analytics**: Product-wise sales, customer analysis, trends
- **GST Reports**: GSTR-1, GSTR-3B compatible reports
- **Dashboard Insights**: Real-time business metrics and KPIs

### 🤖 AI/ML Features
- **GST Prediction**: AI-powered GST slab recommendations
- **Invoice OCR**: Extract data from invoice images
- **Anomaly Detection**: Identify unusual billing patterns
- **Smart Insights**: Business recommendations based on data

### 🔒 Security & Compliance
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Granular permissions system
- **Data Encryption**: End-to-end encryption for sensitive data
- **Audit Logs**: Complete activity tracking for compliance

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   API Gateway   │    │   ML Services   │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (FastAPI)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────┐
         │              Data Layer                          │
         │  ┌─────────────┐  ┌─────────────┐               │
         │  │ PostgreSQL  │  │    Redis    │               │
         │  │   Port:5432 │  │   Port:6379 │               │
         │  └─────────────┘  └─────────────┘               │
         └─────────────────────────────────────────────────┘
```

### 🔄 Microservices Architecture

- **Web App**: React/Next.js frontend with modern UI
- **API Service**: NestJS backend handling business logic
- **ML Service**: Python FastAPI for AI/ML features
- **Shared Packages**: Common types and utilities
- **Infrastructure**: Docker, monitoring, deployment

---

## 🛠️ Tech Stack

### 🎨 Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: Zustand + React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### 🔧 Backend
- **API Framework**: NestJS 10 (Node.js/TypeScript)
- **Database**: PostgreSQL 15 with Prisma ORM
- **Cache**: Redis 7 for session and caching
- **Authentication**: JWT with refresh tokens
- **File Storage**: Cloudinary for documents
- **Payments**: Razorpay integration

### 🤖 ML/AI
- **Framework**: FastAPI (Python 3.11)
- **ML Libraries**: scikit-learn, pandas, numpy
- **PDF Generation**: ReportLab for invoice PDFs
- **OCR**: Tesseract for invoice scanning
- **QR Codes**: qrcode library

### 🐳 Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx with SSL termination
- **Monitoring**: Prometheus + Grafana + Loki
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm with Turborepo

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** >= 20.0.0
- **Python** >= 3.11
- **pnpm** >= 10.26.1
- **Docker** & Docker Compose
- **PostgreSQL** & Redis (or use Docker)

### ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/abx15/BillEasy-.git
   cd BillEasy
   ```

2. **Install dependencies**
   ```bash
   # Install Node.js dependencies
   pnpm install
   
   # Install Python dependencies
   cd apps/ml-api
   pip install -r requirements.txt
   cd ../..
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start databases**
   ```bash
   docker-compose up -d postgres redis
   ```

5. **Setup database**
   ```bash
   # Generate Prisma client
   cd apps/api
   pnpm db:generate
   
   # Run database migrations
   pnpm db:push
   
   # Seed database with sample data
   pnpm db:seed
   cd ../..
   ```

6. **Start development servers**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individual services
   pnpm dev:api     # API server on :3001
   pnpm dev:web     # Web app on :3000
   pnpm dev:ml      # ML API on :8000
   ```

7. **Access the application**
   - 🌐 Web App: http://localhost:3000
   - 📡 API Docs: http://localhost:3001/docs
   - 🤖 ML API: http://localhost:8000/docs

---

## 📁 Project Structure

```
BillEasy/
├── 📂 apps/                    # Application services
│   ├── 📂 api/                 # NestJS backend API
│   │   ├── 📂 src/            # Source code
│   │   ├── 📂 prisma/         # Database schema & migrations
│   │   ├── 📂 test/           # Test files
│   │   └── 📄 package.json
│   ├── 📂 ml-api/             # FastAPI ML service
│   │   ├── 📂 app/            # Python source
│   │   ├── 📂 tests/          # Test files
│   │   └── 📄 requirements.txt
│   └── 📂 web/                # Next.js frontend
│       ├── 📂 src/            # React source
│       ├── 📂 public/         # Static assets
│       └── 📄 package.json
├── 📂 packages/               # Shared packages
│   ├── 📂 types/              # TypeScript type definitions
│   ├── 📂 utils/              # Shared utility functions
│   ├── 📂 ui/                 # Reusable UI components
│   └── 📂 config/             # Shared configurations
├── 📂 infra/                  # Infrastructure code
│   ├── 📂 docker/              # Dockerfiles
│   ├── 📂 nginx/               # Nginx configuration
│   └── 📂 scripts/            # Deployment scripts
├── 📂 monitoring/             # Monitoring stack
│   ├── 📂 prometheus/         # Metrics configuration
│   ├── 📂 grafana/            # Dashboards
│   ├── 📂 loki/               # Log aggregation
│   └── 📂 alertmanager/       # Alert rules
├── 📂 .github/                # GitHub workflows
│   └── 📂 workflows/          # CI/CD pipelines
├── 📄 docker-compose.yml      # Development containers
├── 📄 docker-compose.prod.yml # Production containers
├── 📄 package.json            # Root package configuration
├── 📄 pnpm-workspace.yaml     # pnpm workspace config
└── 📄 turbo.json              # Turborepo configuration
```

---

## 🔧 Development

### 📜 Available Scripts

```bash
# 🚀 Development
pnpm dev              # Start all services in development
pnpm dev:api          # Start API server only
pnpm dev:web          # Start web app only
pnpm dev:ml           # Start ML API only

# 🏗️ Building
pnpm build            # Build all applications
pnpm build:api        # Build API for production
pnpm build:web        # Build web app for production

# 🧪 Testing
pnpm test             # Run all tests
pnpm test:api         # Run API tests
pnpm test:web         # Run web app tests
pnpm test:ml          # Run ML API tests
pnpm test:e2e         # Run end-to-end tests
pnpm test:coverage    # Run tests with coverage

# 🔍 Code Quality
pnpm lint             # Lint all code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code with Prettier
pnpm typecheck        # Type checking

# 🗄️ Database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database

# 🐳 Docker
pnpm docker:build     # Build Docker images
pnpm docker:up         # Start containers
pnpm docker:down       # Stop containers
pnpm docker:logs       # View container logs

# 📊 Monitoring
pnpm monitoring:up    # Start monitoring stack
pnpm monitoring:down  # Stop monitoring stack

# 🚀 Deployment
pnpm deploy           # Deploy to production
pnpm deploy:rollback  # Rollback deployment
```

### 🔧 Environment Variables

Create a `.env` file from `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/billeasy"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# API URLs
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_ML_API_URL="http://localhost:8000/ml"

# External Services
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES="pdf,jpg,jpeg,png"
```

---

## 🧪 Testing

### 🎯 Test Strategy

- **Unit Tests**: Jest for individual component/function testing
- **Integration Tests**: API endpoint testing with test database
- **E2E Tests**: Playwright for full user journey testing
- **Security Tests**: npm audit and safety checks
- **Performance Tests**: Load testing with Artillery

### 🏃 Running Tests

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:api          # API tests with coverage
pnpm test:web          # Frontend tests
pnpm test:ml           # ML API tests

# Watch mode for development
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

### 📊 Coverage Reports

Coverage reports are generated in:
- API: `apps/api/coverage/`
- Web: `apps/web/coverage/`
- ML API: `apps/ml-api/coverage/`

---

## 🐳 Docker Setup

### 🏗️ Development Environment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 🚀 Production Environment

```bash
# Build and start production containers
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale api=3

# View production logs
docker-compose -f docker-compose.prod.yml logs -f api
```

### 📦 Available Images

- `billeasy-web`: Next.js frontend application
- `billeasy-api`: NestJS backend API
- `billeasy-ml`: FastAPI ML service

---

## 📊 Monitoring

### 🔍 Monitoring Stack

- **Prometheus**: Metrics collection and storage
- **Grafana**: Visualization and dashboards
- **Loki**: Log aggregation and querying
- **AlertManager**: Alert management and notifications

### 🚀 Start Monitoring

```bash
# Start monitoring stack
pnpm monitoring:up

# Access dashboards
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
# Loki: http://localhost:3100
```

### 📈 Available Dashboards

- **Business Metrics**: Revenue, customers, invoices
- **Infrastructure**: CPU, memory, disk usage
- **Application**: Response times, error rates
- **Database**: Query performance, connections

---

## 🚀 Deployment

### 🎯 Production Deployment

1. **Setup Server**
   ```bash
   # Clone repository
   git clone https://github.com/abx15/BillEasy-.git
   cd BillEasy
   
   # Run setup script
   chmod +x infra/scripts/setup.sh
   ./infra/scripts/setup.sh
   ```

2. **Configure Environment**
   ```bash
   # Copy and edit environment file
   cp .env.example .env
   # Update with production values
   ```

3. **Deploy Application**
   ```bash
   # Run deployment script
   chmod +x infra/scripts/deploy.sh
   ./infra/scripts/deploy.sh
   ```

### 🔄 CI/CD Pipeline

The GitHub Actions pipeline includes:

- **Linting**: Code quality checks
- **Testing**: Unit and integration tests
- **Security**: Vulnerability scanning
- **Building**: Docker image creation
- **Deployment**: Automated production deployment

### 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database migrations applied
- [ ] Monitoring stack running
- [ ] Backup procedures in place
- [ ] Health checks passing

---

## 📝 API Documentation

### 🌐 REST API

The API documentation is available at:
- **Swagger UI**: http://localhost:3001/docs
- **ReDoc**: http://localhost:3001/redoc

### 🔗 Key Endpoints

#### Authentication
```http
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
DELETE /api/auth/logout
```

#### Business Management
```http
GET /api/businesses
POST /api/businesses
PUT /api/businesses/:id
DELETE /api/businesses/:id
```

#### Billing
```http
GET /api/bills
POST /api/bills
GET /api/bills/:id
PUT /api/bills/:id
POST /api/bills/:id/send
```

#### Customers
```http
GET /api/customers
POST /api/customers
PUT /api/customers/:id
GET /api/customers/:id/bills
```

### 🤖 ML API

ML API documentation at: http://localhost:8000/docs

#### Features
```http
POST /ml/gst/predict
POST /ml/invoice/ocr
POST /ml/anomaly/detect
GET /ml/insights/business
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 🍴 Fork & Clone

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch

### 🛠️ Development Setup

```bash
# Install dependencies
pnpm install

# Setup development environment
cp .env.example .env
docker-compose up -d postgres redis

# Start development
pnpm dev
```

### 📝 Contribution Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Use conventional commit messages
- Ensure CI passes

### 🐛 Bug Reports

Please report bugs using the GitHub issue tracker with:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details

### 💡 Feature Requests

We love feature suggestions! Please provide:
- Use case description
- Proposed implementation
- Potential challenges

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- **NestJS Team** - Excellent framework for building APIs
- **Next.js Team** - Amazing React framework
- **Prisma Team** - Modern database toolkit
- **Vercel Team** - For hosting and deployment tools

---

## 📞 Support

Need help? We're here for you!

- 📧 **Email**: support@billeasy.in
- 💬 **Discord**: [Join our community](https://discord.gg/billeasy)
- 📱 **WhatsApp**: +91-XXXXX-XXXXX
- 📖 **Documentation**: [docs.billeasy.in](https://docs.billeasy.in)

---

<div align="center">

**⭐ Star this repository if it helped you!**

Made with ❤️ for Indian Small Businesses

[🔝 Back to Top](#-billeasy)

</div>