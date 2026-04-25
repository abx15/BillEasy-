# BillEasy Security and Performance Hardening Guide

This guide covers security best practices and performance optimizations for the BillEasy production environment.

## Table of Contents

1. [Security Hardening](#security-hardening)
2. [Performance Optimization](#performance-optimization)
3. [Database Optimization](#database-optimization)
4. [Caching Strategy](#caching-strategy)
5. [Monitoring and Alerting](#monitoring-and-alerting)
6. [Security Audits](#security-audits)

## Security Hardening

### 1. Application Security

#### Rate Limiting

Rate limiting is already implemented in Nginx configuration:

```nginx
# API endpoints: 10 requests/second
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Auth endpoints: 5 requests/minute  
limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/m;

# Upload endpoints: 2 requests/second
limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/s;
```

#### Input Validation

- All API endpoints validate input using DTOs with class-validator
- SQL injection prevention through Prisma ORM
- XSS prevention through proper output escaping
- CSRF protection implemented in Next.js

#### Authentication & Authorization

```typescript
// JWT token configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '15m',
  issuer: 'billeasy',
  audience: 'billeasy-users'
};

// Refresh token configuration
const refreshTokenConfig = {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: '7d',
  issuer: 'billeasy',
  audience: 'billeasy-users'
};
```

#### Password Security

```typescript
// Password hashing with bcrypt
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

### 2. Infrastructure Security

#### Docker Security

```dockerfile
# Run as non-root user
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Minimal base images
FROM node:20-alpine AS runner
FROM python:3.11-slim

# Remove package manager cache
RUN npm cache clean --force
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
```

#### Network Security

```yaml
# Docker network isolation
networks:
  billeasy-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16

# Only expose necessary ports
ports:
  - "80:80"
  - "443:443"
```

#### SSL/TLS Configuration

```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';" always;
```

### 3. Database Security

#### PostgreSQL Security

```sql
-- Create dedicated database user
CREATE USER billeasy WITH PASSWORD 'secure_password';

-- Grant limited permissions
GRANT CONNECT ON DATABASE billeasy TO billeasy;
GRANT USAGE ON SCHEMA public TO billeasy;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO billeasy;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO billeasy;

-- Enable row-level security
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY business_isolation ON bills
  FOR ALL TO billeasy
  USING (business_id = current_setting('app.current_business_id')::uuid);
```

#### Redis Security

```bash
# Redis configuration
redis-server --requirepass $REDIS_PASSWORD --appendonly yes
```

### 4. Environment Security

#### Environment Variables

```bash
# Secure environment file
chmod 600 .env.production
chown appuser:appuser .env.production

# Use Docker secrets for sensitive data
echo "database_password" | docker secret create db_password -
```

#### File Permissions

```bash
# Secure application directories
chmod 755 /opt/billeasy
chmod 700 /opt/billeasy/backups
chmod 600 /opt/billeasy/.env.production
```

## Performance Optimization

### 1. Database Performance

#### Connection Pooling

```typescript
// Prisma connection pool configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Connection pool settings in DATABASE_URL
// postgresql://user:password@localhost:5432/db?connection_limit=20&pool_timeout=20
```

#### Database Indexing

```sql
-- Performance indexes
CREATE INDEX CONCURRENTLY idx_bills_business_id ON bills(business_id);
CREATE INDEX CONCURRENTLY idx_bills_created_at ON bills(created_at DESC);
CREATE INDEX CONCURRENTLY idx_bills_customer_id ON bills(customer_id);
CREATE INDEX CONCURRENTLY idx_products_business_id ON products(business_id);
CREATE INDEX CONCURRENTLY idx_customers_business_id ON customers(business_id);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_bills_business_status ON bills(business_id, payment_status);
CREATE INDEX CONCURRENTLY idx_bills_business_date ON bills(business_id, created_at DESC);
```

#### Query Optimization

```typescript
// Efficient pagination
const bills = await prisma.bill.findMany({
  where: { businessId },
  include: {
    customer: true,
    items: true,
  },
  orderBy: { createdAt: 'desc' },
  take: limit,
  skip: (page - 1) * limit,
});

// Selective field loading
const summary = await prisma.bill.aggregate({
  where: { businessId },
  _sum: { totalAmount: true },
  _count: { id: true },
});
```

### 2. Application Performance

#### Caching Strategy

```typescript
// Redis caching implementation
@Injectable()
export class CacheService {
  constructor(@Inject('REDIS') private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Cache decorator
export function Cache(ttl: number = 3600) {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const cacheKey = `${target.constructor.name}:${propertyName}:${JSON.stringify(args)}`;
      
      let result = await this.cacheService.get(cacheKey);
      if (!result) {
        result = await method.apply(this, args);
        await this.cacheService.set(cacheKey, result, ttl);
      }
      
      return result;
    };
  };
}
```

#### Response Compression

```typescript
// NestJS compression middleware
import * as compression from 'compression';

app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
}));
```

### 3. Frontend Performance

#### Code Splitting

```typescript
// Next.js dynamic imports
import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('../components/Dashboard'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Reports = dynamic(() => import('../components/Reports'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});
```

#### Image Optimization

```tsx
// Next.js Image component
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="BillEasy Logo"
  width={200}
  height={100}
  priority
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

#### Bundle Optimization

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
};
```

### 4. Caching Strategy

#### Multi-Level Caching

```typescript
// Cache levels
enum CacheLevel {
  MEMORY = 'memory',      // Application memory (fastest)
  REDIS = 'redis',        // Redis cache (fast)
  DATABASE = 'database',  // Database query (slow)
}

@Injectable()
export class MultiLevelCacheService {
  private memoryCache = new Map<string, { data: any; expiry: number }>();

  async get<T>(key: string): Promise<T | null> {
    // Level 1: Memory cache
    const memoryData = this.memoryCache.get(key);
    if (memoryData && memoryData.expiry > Date.now()) {
      return memoryData.data;
    }

    // Level 2: Redis cache
    const redisData = await this.redis.get(key);
    if (redisData) {
      const parsed = JSON.parse(redisData);
      // Store in memory cache
      this.memoryCache.set(key, {
        data: parsed,
        expiry: Date.now() + 300000, // 5 minutes
      });
      return parsed;
    }

    return null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    // Set in Redis
    await this.redis.setex(key, ttl, JSON.stringify(value));
    
    // Set in memory cache
    this.memoryCache.set(key, {
      data: value,
      expiry: Date.now() + Math.min(ttl * 1000, 300000), // Max 5 minutes
    });
  }
}
```

#### Cache Invalidation Strategy

```typescript
// Cache invalidation on data changes
@Injectable()
export class CacheInvalidationService {
  constructor(
    private cacheService: CacheService,
    private eventEmitter: EventEmitter2,
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Invalidate business-related caches
    this.eventEmitter.on('business.updated', (event) => {
      this.cacheService.invalidatePattern(`business:${event.businessId}:*`);
    });

    // Invalidate bill-related caches
    this.eventEmitter.on('bill.created', (event) => {
      this.cacheService.invalidatePattern(`business:${event.businessId}:bills:*`);
      this.cacheService.invalidatePattern(`business:${event.businessId}:dashboard`);
    });

    // Invalidate product-related caches
    this.eventEmitter.on('product.updated', (event) => {
      this.cacheService.invalidatePattern(`business:${event.businessId}:products:*`);
    });
  }
}
```

### 5. Monitoring and Alerting

#### Performance Metrics

```typescript
// Performance monitoring middleware
@Injectable()
export class PerformanceMonitorService {
  constructor(private logger: Logger) {}

  monitorRequest(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      // Log slow requests
      if (duration > 1000) {
        this.logger.warn(`Slow request: ${req.method} ${req.url} - ${duration}ms`);
      }
      
      // Track metrics
      this.trackMetrics(req, res, duration);
    });
    
    next();
  }

  private trackMetrics(req: Request, res: Response, duration: number) {
    // Send metrics to monitoring system
    const metrics = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
    };
    
    // Send to Prometheus, DataDog, or similar
    this.sendMetrics(metrics);
  }
}
```

#### Health Checks

```typescript
// Comprehensive health check
@Controller('health')
export class HealthController {
  constructor(
    private prisma: PrismaService,
    private redis: Redis,
  ) {}

  @Get()
  async healthCheck() {
    const checks = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      disk: await this.checkDiskSpace(),
    };

    const isHealthy = Object.values(checks).every(
      check => typeof check === 'object' ? check.status === 'healthy' : true
    );

    return {
      ...checks,
      status: isHealthy ? 'healthy' : 'unhealthy',
    };
  }

  private async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'healthy', responseTime: Date.now() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  private async checkRedis() {
    try {
      const start = Date.now();
      await this.redis.ping();
      return { status: 'healthy', responseTime: Date.now() - start };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  private async checkDiskSpace() {
    const stats = await fs.promises.statfs('.');
    const freeSpace = stats.bavail * stats.bsize;
    const totalSpace = stats.blocks * stats.bsize;
    const usagePercent = ((totalSpace - freeSpace) / totalSpace) * 100;

    return {
      status: usagePercent > 90 ? 'unhealthy' : 'healthy',
      usage: `${usagePercent.toFixed(2)}%`,
      free: `${(freeSpace / 1024 / 1024 / 1024).toFixed(2)}GB`,
    };
  }
}
```

## Security Audits

### 1. Automated Security Scanning

```yaml
# GitHub Actions security scan
- name: Run security audit
  run: |
    npm audit --audit-level=high
    safety check
    docker run --rm -v "$PWD":/app clair-scanner:latest
```

### 2. Dependency Security

```json
// .npmrc
audit=false
fund=false
audit-level=moderate
```

```bash
# Regular security updates
npm audit fix
pip-audit --fix
docker image scan billeasy:latest
```

### 3. Security Headers Testing

```bash
# Test security headers
curl -I https://billeasy.yourdomain.com

# Expected headers:
# Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Content-Security-Policy: default-src 'self'...
```

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| API Response Time | < 200ms (95th percentile) | TBD |
| Page Load Time | < 2s | TBD |
| Database Query Time | < 100ms (95th percentile) | TBD |
| Cache Hit Rate | > 80% | TBD |
| Memory Usage | < 1GB per container | TBD |
| CPU Usage | < 70% average | TBD |

### Load Testing

```bash
# Install artillery
npm install -g artillery

# Load test configuration
cat > load-test.yml << 'EOF'
config:
  target: 'https://billeasy.yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100

scenarios:
  - name: "API Load Test"
    requests:
      - get:
          url: "/api/health"
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
EOF

# Run load test
artillery run load-test.yml
```

## Maintenance Schedule

### Daily

- [ ] Monitor application health
- [ ] Check error logs
- [ ] Verify backup completion
- [ ] Review security alerts

### Weekly

- [ ] Update dependencies
- [ ] Review performance metrics
- [ ] Check SSL certificate expiration
- [ ] Clean up old logs

### Monthly

- [ ] Security audit
- [ ] Performance optimization review
- [ ] Database maintenance
- [ ] Capacity planning

### Quarterly

- [ ] Security penetration testing
- [ ] Disaster recovery testing
- [ ] Architecture review
- [ ] Cost optimization review

---

This security and performance hardening guide should be reviewed and updated regularly to ensure the BillEasy application remains secure and performant.
