# BillEasy Production Deployment Guide

This guide covers deploying BillEasy to a production environment using Docker Compose, Nginx, and SSL with Let's Encrypt.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Application Configuration](#application-configuration)
4. [SSL Certificate Setup](#ssl-certificate-setup)
5. [Deployment Process](#deployment-process)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Backup and Recovery](#backup-and-recovery)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Server Requirements

- **OS**: Ubuntu 20.04 LTS or later
- **RAM**: Minimum 4GB, recommended 8GB
- **Storage**: Minimum 50GB SSD, recommended 100GB
- **CPU**: Minimum 2 cores, recommended 4 cores
- **Network**: Static IP address
- **Domain**: Registered domain name pointing to server IP

### Software Requirements

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- Nginx (managed by Docker)
- Let's Encrypt Certbot

### Domain Requirements

- Domain name (e.g., `billeasy.yourdomain.com`)
- DNS A record pointing to server IP
- Optional: Wildcard certificate for subdomains

## Server Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 3. Install Additional Tools

```bash
sudo apt install -y git curl wget htop
```

### 4. Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### 5. Create Application Directory

```bash
sudo mkdir -p /opt/billeasy
sudo chown $USER:$USER /opt/billeasy
cd /opt/billeasy
```

## Application Configuration

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/billeasy.git .
```

### 2. Environment Configuration

Create `.env.production` file:

```bash
cp .env.example .env.production
nano .env.production
```

Configure the following variables:

```env
# Database
DB_PASSWORD=your_secure_db_password
DB_NAME=billeasy
DB_USER=billeasy

# Redis
REDIS_PASSWORD=your_secure_redis_password

# JWT
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_minimum_32_characters

# Production URL
PRODUCTION_URL=https://billeasy.yourdomain.com
DOMAIN_NAME=billeasy.yourdomain.com

# External Services (Optional)
WATI_API_KEY=your_wati_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

### 3. Create SSL Directory

```bash
mkdir -p infra/nginx/ssl
```

## SSL Certificate Setup

### 1. Initial Nginx Configuration (HTTP only)

Create temporary nginx config for certificate generation:

```bash
# Create temporary nginx config
cat > infra/nginx/nginx.temp.conf << 'EOF'
events {}
http {
    server {
        listen 80;
        server_name ${DOMAIN_NAME};
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$server_name$request_uri;
        }
    }
}
EOF
```

### 2. Generate SSL Certificate

```bash
# Start temporary nginx for certificate challenge
docker run -d --name temp-nginx \
  -p 80:80 \
  -v $(pwd)/infra/nginx/nginx.temp.conf:/etc/nginx/nginx.conf \
  -v $(pwd)/certbot_www:/var/www/certbot \
  nginx:alpine

# Generate certificate
docker run --rm \
  -v $(pwd)/certbot_www:/var/www/certbot \
  -v $(pwd)/certbot_conf:/etc/letsencrypt \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@yourdomain.com \
  --agree-tos \
  --no-eff-email \
  -d ${DOMAIN_NAME}

# Stop temporary nginx
docker stop temp-nginx
docker rm temp-nginx

# Copy certificates to nginx ssl directory
sudo cp certbot_conf/live/${DOMAIN_NAME}/fullchain.pem infra/nginx/ssl/
sudo cp certbot_conf/live/${DOMAIN_NAME}/privkey.pem infra/nginx/ssl/
sudo chown $USER:$USER infra/nginx/ssl/*
```

### 3. Verify Certificates

```bash
ls -la infra/nginx/ssl/
# Should show: fullchain.pem, privkey.pem
```

## Deployment Process

### 1. Deploy Application

```bash
# Deploy to production
./infra/scripts/deploy.sh
```

Or manually:

```bash
# Build and start services
docker-compose -f docker-compose.prod.yml up -d --build

# Wait for services to be healthy
sleep 60

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### 2. Verify Deployment

```bash
# Check health endpoints
curl -f https://${DOMAIN_NAME}/health
curl -f https://${DOMAIN_NAME}/api/health
curl -f https://${DOMAIN_NAME}/ml/health

# Check SSL certificate
openssl s_client -connect ${DOMAIN_NAME}:443 -servername ${DOMAIN_NAME} </dev/null
```

### 3. Database Setup

```bash
# Run database migrations
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

# Seed initial data (optional)
docker-compose -f docker-compose.prod.yml exec api npx prisma db seed
```

## Monitoring and Maintenance

### 1. Log Management

```bash
# View logs for all services
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f web
docker-compose -f docker-compose.prod.yml logs -f ml-api
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 2. Health Monitoring

```bash
# Check service health
docker-compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats

# Check disk usage
df -h
```

### 3. Log Rotation

Setup log rotation for Docker containers:

```bash
# Create logrotate config
sudo tee /etc/logrotate.d/billeasy << 'EOF'
/opt/billeasy/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose -f /opt/billeasy/docker-compose.prod.yml restart nginx
    endscript
}
EOF
```

### 4. Performance Monitoring

Install monitoring tools:

```bash
# Install htop for system monitoring
sudo apt install htop

# Monitor Docker containers
watch -n 5 'docker-compose -f /opt/billeasy/docker-compose.prod.yml ps'
```

## Backup and Recovery

### 1. Database Backup

Create backup script:

```bash
# Create backup directory
mkdir -p backups/database

# Backup script
cat > backups/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/billeasy/backups/database"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/billeasy_backup_$DATE.sql"

# Create backup
docker-compose -f /opt/billeasy/docker-compose.prod.yml exec -T postgres pg_dump -U billeasy billeasy > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
EOF

chmod +x backups/backup-db.sh
```

### 2. Automated Backups

Setup cron job for daily backups:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/billeasy/backups/backup-db.sh >> /opt/billeasy/backups/backup.log 2>&1
```

### 3. File Backup

```bash
# Backup application files
tar -czf backups/app_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=backups \
  .
```

### 4. Recovery Process

```bash
# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U billeasy -d billeasy < backup_file.sql

# Restore application files
tar -xzf app_backup_YYYYMMDD_HHMMSS.tar.gz
```

## Troubleshooting

### Common Issues

#### 1. Services Not Starting

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs [service_name]

# Check resource usage
docker stats

# Restart specific service
docker-compose -f docker-compose.prod.yml restart [service_name]
```

#### 2. SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in infra/nginx/ssl/fullchain.pem -text -noout

# Renew certificate
docker run --rm \
  -v $(pwd)/certbot_www:/var/www/certbot \
  -v $(pwd)/certbot_conf:/etc/letsencrypt \
  certbot/certbot renew

# Restart nginx after renewal
docker-compose -f docker-compose.prod.yml restart nginx
```

#### 3. Database Connection Issues

```bash
# Check database status
docker-compose -f docker-compose.prod.yml exec postgres pg_isready

# Check database logs
docker-compose -f docker-compose.prod.yml logs postgres

# Test connection from API container
docker-compose -f docker-compose.prod.yml exec api npx prisma db pull
```

#### 4. High Memory Usage

```bash
# Check memory usage
free -h
docker stats

# Restart services if needed
docker-compose -f docker-compose.prod.yml restart

# Clear Docker cache
docker system prune -a
```

### Performance Optimization

#### 1. Database Optimization

```bash
# Connect to database
docker-compose -f docker-compose.prod.yml exec postgres psql -U billeasy -d billeasy

# Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

#### 2. Nginx Optimization

Monitor Nginx performance:

```bash
# Check Nginx status
curl http://localhost/nginx_status

# Analyze access logs
docker-compose -f docker-compose.prod.yml exec nginx tail -f /var/log/nginx/access.log
```

### Security Checklist

- [ ] Regularly update system packages
- [ ] Use strong passwords for all services
- [ ] Enable automatic security updates
- [ ] Monitor access logs
- [ ] Use fail2ban for SSH protection
- [ ] Regularly backup data
- [ ] Test disaster recovery procedures
- [ ] Monitor SSL certificate expiration
- [ ] Review Docker container security
- [ ] Implement rate limiting

## Emergency Procedures

### 1. Service Outage

```bash
# Quick restart all services
docker-compose -f docker-compose.prod.yml restart

# If that fails, full redeploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### 2. Database Corruption

```bash
# Stop all services
docker-compose -f docker-compose.prod.yml down

# Restore from latest backup
docker-compose -f docker-compose.prod.yml up -d postgres
sleep 30
docker-compose -f docker-compose.prod.yml exec postgres psql -U billeasy -d billeasy < latest_backup.sql

# Start remaining services
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Security Incident

```bash
# Immediately change all passwords
# Rotate JWT secrets
# Check access logs for suspicious activity
# Update all containers
# Enable additional monitoring
```

## Support

For additional support:

1. Check the [GitHub Issues](https://github.com/yourusername/billeasy/issues)
2. Review the [Documentation](https://docs.billeasy.com)
3. Contact the development team

---

**Note**: This deployment guide assumes you have administrative access to the server and domain. Adjust configurations based on your specific requirements and security policies.
