#!/bin/bash
# BillEasy Server Setup Script

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/billeasy"
DOMAIN_NAME=""
DB_PASSWORD=""
REDIS_PASSWORD=""
JWT_SECRET=""
JWT_REFRESH_SECRET=""

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Function to get user input
get_user_input() {
    print_status "Please provide the following configuration:"
    
    read -p "Domain name (e.g., billeasy.yourdomain.com): " DOMAIN_NAME
    if [[ -z "$DOMAIN_NAME" ]]; then
        print_error "Domain name is required"
        exit 1
    fi
    
    read -p "Your email for SSL certificate: " EMAIL
    if [[ -z "$EMAIL" ]]; then
        print_error "Email is required for SSL certificate"
        exit 1
    fi
    
    # Generate secure passwords
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    JWT_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    JWT_REFRESH_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)
    
    print_status "Generated secure passwords and secrets"
}

# Function to update system
update_system() {
    print_status "Updating system packages..."
    apt update && apt upgrade -y
    print_success "System updated"
}

# Function to install Docker
install_docker() {
    print_status "Installing Docker..."
    
    # Install prerequisites
    apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Set up the stable repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker Engine
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    print_success "Docker installed successfully"
}

# Function to install additional tools
install_tools() {
    print_status "Installing additional tools..."
    apt install -y git curl wget htop unzip certbot python3-certbot-nginx
    print_success "Additional tools installed"
}

# Function to configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    # Enable UFW
    ufw --force enable
    
    # Allow SSH, HTTP, HTTPS
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    print_success "Firewall configured"
}

# Function to create project directory
create_project_dir() {
    print_status "Creating project directory..."
    
    # Create directory
    mkdir -p "$PROJECT_DIR"
    
    # Create subdirectories
    mkdir -p "$PROJECT_DIR/backups"
    mkdir -p "$PROJECT_DIR/logs"
    mkdir -p "$PROJECT_DIR/infra/nginx/ssl"
    
    # Set permissions
    chown -R $SUDO_USER:$SUDO_USER "$PROJECT_DIR"
    
    print_success "Project directory created"
}

# Function to clone repository
clone_repository() {
    print_status "Cloning BillEasy repository..."
    
    cd "$PROJECT_DIR"
    
    # Check if directory is not empty
    if [[ -n "$(ls -A)" ]]; then
        print_warning "Directory is not empty. Skipping clone."
        return
    fi
    
    # Clone repository (replace with actual repo URL)
    git clone https://github.com/yourusername/billeasy.git .
    
    # Set ownership
    chown -R $SUDO_USER:$SUDO_USER "$PROJECT_DIR"
    
    print_success "Repository cloned"
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    cd "$PROJECT_DIR"
    
    # Create .env.production file
    cat > .env.production << EOF
# Database Configuration
DB_PASSWORD=$DB_PASSWORD
DB_NAME=billeasy
DB_USER=billeasy

# Redis Configuration
REDIS_PASSWORD=$REDIS_PASSWORD

# JWT Configuration
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET

# Production Configuration
PRODUCTION_URL=https://$DOMAIN_NAME
DOMAIN_NAME=$DOMAIN_NAME

# SSL Certificate Email
SSL_EMAIL=$EMAIL

# External Services (Configure if needed)
WATI_API_KEY=
SENDGRID_API_KEY=

# Application Configuration
NODE_ENV=production
PORT=3001
EOF

    # Set permissions
    chown $SUDO_USER:$SUDO_USER .env.production
    chmod 600 .env.production
    
    print_success "Environment configuration created"
}

# Function to setup SSL certificate
setup_ssl() {
    print_status "Setting up SSL certificate..."
    
    cd "$PROJECT_DIR"
    
    # Create temporary nginx config for certificate generation
    cat > infra/nginx/nginx.temp.conf << EOF
events {}
http {
    server {
        listen 80;
        server_name $DOMAIN_NAME;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://\$server_name\$request_uri;
        }
    }
}
EOF

    # Create certbot directories
    mkdir -p certbot_www certbot_conf
    
    # Start temporary nginx for certificate challenge
    docker run -d --name temp-nginx \
        -p 80:80 \
        -v $(pwd)/infra/nginx/nginx.temp.conf:/etc/nginx/nginx.conf \
        -v $(pwd)/certbot_www:/var/www/certbot \
        nginx:alpine
    
    # Wait for nginx to start
    sleep 10
    
    # Generate SSL certificate
    if certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        -d "$DOMAIN_NAME"; then
        
        print_success "SSL certificate generated"
    else
        print_error "Failed to generate SSL certificate"
        docker stop temp-nginx
        docker rm temp-nginx
        exit 1
    fi
    
    # Stop temporary nginx
    docker stop temp-nginx
    docker rm temp-nginx
    
    # Copy certificates to nginx ssl directory
    cp certbot_conf/live/$DOMAIN_NAME/fullchain.pem infra/nginx/ssl/
    cp certbot_conf/live/$DOMAIN_NAME/privkey.pem infra/nginx/ssl/
    
    # Set ownership
    chown -R $SUDO_USER:$SUDO_USER infra/nginx/ssl/
    
    print_success "SSL certificate setup completed"
}

# Function to setup automatic SSL renewal
setup_ssl_renewal() {
    print_status "Setting up automatic SSL renewal..."
    
    # Create renewal script
    cat > /usr/local/bin/ssl-renewal.sh << 'EOF'
#!/bin/bash
# SSL Certificate Renewal Script

PROJECT_DIR="/opt/billeasy"
DOMAIN_NAME=$(grep DOMAIN_NAME $PROJECT_DIR/.env.production | cut -d'=' -f2)

# Renew certificate
certbot renew --quiet

# Copy new certificates
cp /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem $PROJECT_DIR/infra/nginx/ssl/
cp /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem $PROJECT_DIR/infra/nginx/ssl/

# Restart nginx
docker-compose -f $PROJECT_DIR/docker-compose.prod.yml restart nginx

echo "SSL certificate renewed and nginx restarted"
EOF

    chmod +x /usr/local/bin/ssl-renewal.sh
    
    # Add to crontab (renewal at 3 AM daily)
    (crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/ssl-renewal.sh >> /var/log/ssl-renewal.log 2>&1") | crontab -
    
    print_success "Automatic SSL renewal configured"
}

# Function to create backup script
create_backup_script() {
    print_status "Creating backup script..."
    
    cat > /usr/local/bin/billeasy-backup.sh << 'EOF'
#!/bin/bash
# BillEasy Backup Script

PROJECT_DIR="/opt/billeasy"
BACKUP_DIR="$PROJECT_DIR/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create database backup
docker-compose -f $PROJECT_DIR/docker-compose.prod.yml exec -T postgres pg_dump -U billeasy billeasy > $BACKUP_DIR/database_backup_$DATE.sql 2>/dev/null
gzip $BACKUP_DIR/database_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: database_backup_$DATE.sql.gz"
EOF

    chmod +x /usr/local/bin/billeasy-backup.sh
    
    # Add to crontab (backup at 2 AM daily)
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/billeasy-backup.sh >> /var/log/billeasy-backup.log 2>&1") | crontab -
    
    print_success "Backup script created and scheduled"
}

# Function to create log rotation
setup_log_rotation() {
    print_status "Setting up log rotation..."
    
    cat > /etc/logrotate.d/billeasy << 'EOF'
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
    
    print_success "Log rotation configured"
}

# Function to display setup summary
show_summary() {
    print_status "Setup Summary"
    echo "=================="
    echo "Domain: $DOMAIN_NAME"
    echo "Project directory: $PROJECT_DIR"
    echo "Database password: $DB_PASSWORD"
    echo "Redis password: $REDIS_PASSWORD"
    echo ""
    echo "Next steps:"
    echo "1. Review and customize .env.production file"
    echo "2. Run deployment: cd $PROJECT_DIR && ./infra/scripts/deploy.sh"
    echo "3. Monitor logs: docker-compose -f $PROJECT_DIR/docker-compose.prod.yml logs -f"
    echo ""
    echo "Important files:"
    echo "- Environment: $PROJECT_DIR/.env.production"
    echo "- Deployment: $PROJECT_DIR/infra/scripts/deploy.sh"
    echo "- Backup: /usr/local/bin/billeasy-backup.sh"
    echo "- SSL renewal: /usr/local/bin/ssl-renewal.sh"
    echo ""
    print_success "BillEasy setup completed successfully! 🎉"
    
    # Save credentials to file for reference
    cat > "$PROJECT_DIR/setup-credentials.txt" << EOF
BillEasy Setup Credentials
========================
Domain: $DOMAIN_NAME
Email: $EMAIL
Database Password: $DB_PASSWORD
Redis Password: $REDIS_PASSWORD
JWT Secret: $JWT_SECRET
JWT Refresh Secret: $JWT_REFRESH_SECRET

Generated on: $(date)
EOF
    
    chmod 600 "$PROJECT_DIR/setup-credentials.txt"
    chown $SUDO_USER:$SUDO_USER "$PROJECT_DIR/setup-credentials.txt"
    
    print_warning "Credentials saved to $PROJECT_DIR/setup-credentials.txt"
    print_warning "Keep this file secure and delete after use"
}

# Main setup function
main() {
    print_status "Starting BillEasy server setup..."
    
    check_root
    get_user_input
    update_system
    install_docker
    install_tools
    configure_firewall
    create_project_dir
    clone_repository
    create_env_file
    setup_ssl
    setup_ssl_renewal
    create_backup_script
    setup_log_rotation
    show_summary
    
    print_success "Setup completed successfully!"
}

# Run main function
main "$@"