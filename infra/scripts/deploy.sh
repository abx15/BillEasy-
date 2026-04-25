#!/bin/bash
# BillEasy Production Deployment Script

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/opt/billeasy"
BACKUP_DIR="$PROJECT_DIR/backups"
LOG_FILE="$PROJECT_DIR/deploy.log"
COMPOSE_FILE="docker-compose.prod.yml"

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

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "This script should not be run as root for security reasons"
        exit 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check if in project directory
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        print_error "docker-compose.prod.yml not found. Please run from project root."
        exit 1
    fi
    
    # Check environment file
    if [[ ! -f ".env.production" ]]; then
        print_error ".env.production file not found"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    log_message "Prerequisites check passed"
}

# Function to create backup
create_backup() {
    print_status "Creating backup..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
    DB_BACKUP_FILE="$BACKUP_DIR/database_backup_$BACKUP_DATE.sql"
    
    if docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U "${DB_USER:-billeasy}" "${DB_NAME:-billeasy}" > "$DB_BACKUP_FILE" 2>/dev/null; then
        gzip "$DB_BACKUP_FILE"
        print_success "Database backup created: ${DB_BACKUP_FILE}.gz"
        log_message "Database backup created: ${DB_BACKUP_FILE}.gz"
    else
        print_warning "Database backup failed (container might not be running)"
    fi
    
    # Backup application files
    APP_BACKUP_FILE="$BACKUP_DIR/app_backup_$BACKUP_DATE.tar.gz"
    tar -czf "$APP_BACKUP_FILE" \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=backups \
        --exclude="*.log" \
        . 2>/dev/null
    
    print_success "Application backup created: $APP_BACKUP_FILE"
    log_message "Application backup created: $APP_BACKUP_FILE"
}

# Function to pull latest code
pull_code() {
    print_status "Pulling latest code..."
    
    # Stash any local changes
    if [[ -n $(git status --porcelain) ]]; then
        print_warning "Local changes detected. Stashing changes..."
        git stash push -m "Auto-stash before deploy $(date)"
    fi
    
    # Pull latest changes
    git pull origin main
    
    print_success "Code updated successfully"
    log_message "Code updated from git"
}

# Function to build and deploy services
deploy_services() {
    print_status "Building and deploying services..."
    
    # Stop existing services
    print_status "Stopping existing services..."
    docker-compose -f "$COMPOSE_FILE" down
    
    # Pull latest images
    print_status "Pulling latest images..."
    docker-compose -f "$COMPOSE_FILE" pull
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    print_success "Services deployed successfully"
    log_message "Services deployed and started"
}

# Function to wait for services to be healthy
wait_for_health() {
    print_status "Waiting for services to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        print_status "Health check attempt $attempt/$max_attempts..."
        
        # Check if all services are healthy
        local healthy_services=$(docker-compose -f "$COMPOSE_FILE" ps --format "table {{.Service}}\t{{.Status}}" | grep -c "healthy" || true)
        local total_services=$(docker-compose -f "$COMPOSE_FILE" ps --services | wc -l)
        
        if [[ $healthy_services -eq $total_services ]]; then
            print_success "All services are healthy"
            log_message "All services are healthy after $attempt attempts"
            return 0
        fi
        
        sleep 10
        ((attempt++))
    done
    
    print_error "Services failed to become healthy within expected time"
    log_message "Services failed to become healthy after $max_attempts attempts"
    
    # Show service status
    docker-compose -f "$COMPOSE_FILE" ps
    
    return 1
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    if docker-compose -f "$COMPOSE_FILE" exec -T api npx prisma migrate deploy; then
        print_success "Database migrations completed"
        log_message "Database migrations completed successfully"
    else
        print_error "Database migrations failed"
        log_message "Database migrations failed"
        return 1
    fi
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Get domain from environment
    local domain=$(grep DOMAIN_NAME .env.production | cut -d'=' -f2)
    
    if [[ -z "$domain" ]]; then
        print_warning "DOMAIN_NAME not found in .env.production"
        domain="localhost"
    fi
    
    # Check health endpoints
    local endpoints=(
        "http://localhost/health"
        "http://localhost/api/health"
        "http://localhost/ml/health"
    )
    
    for endpoint in "${endpoints[@]}"; do
        if curl -f -s "$endpoint" > /dev/null; then
            print_success "✓ $endpoint is responding"
        else
            print_error "✗ $endpoint is not responding"
            return 1
        fi
    done
    
    print_success "Deployment verification completed"
    log_message "Deployment verification successful"
}

# Function to cleanup old backups
cleanup_backups() {
    print_status "Cleaning up old backups..."
    
    # Remove backups older than 30 days
    find "$BACKUP_DIR" -name "*.gz" -mtime +30 -delete 2>/dev/null || true
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete 2>/dev/null || true
    
    print_success "Old backups cleaned up"
    log_message "Old backups cleaned up"
}

# Function to show deployment summary
show_summary() {
    print_status "Deployment Summary"
    echo "=================="
    echo "Deployment completed at: $(date)"
    echo "Services running:"
    docker-compose -f "$COMPOSE_FILE" ps --format "table {{.Service}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Logs location: $LOG_FILE"
    echo "Backups location: $BACKUP_DIR"
    echo ""
    print_success "BillEasy deployment completed successfully! 🎉"
}

# Function to handle rollback
rollback() {
    print_status "Rolling back deployment..."
    
    # Find latest backup
    local latest_backup=$(ls -t "$BACKUP_DIR"/app_backup_*.tar.gz 2>/dev/null | head -1)
    
    if [[ -z "$latest_backup" ]]; then
        print_error "No backup found for rollback"
        exit 1
    fi
    
    print_status "Using backup: $latest_backup"
    
    # Stop services
    docker-compose -f "$COMPOSE_FILE" down
    
    # Restore from backup
    tar -xzf "$latest_backup"
    
    # Restart services
    docker-compose -f "$COMPOSE_FILE" up -d
    
    print_success "Rollback completed"
    log_message "Rollback completed using: $latest_backup"
}

# Main deployment function
main() {
    print_status "Starting BillEasy deployment..."
    log_message "Deployment started"
    
    # Check if rollback requested
    if [[ "$1" == "rollback" ]]; then
        rollback
        exit 0
    fi
    
    # Run deployment steps
    check_root
    check_prerequisites
    
    # Ask for backup confirmation
    read -p "Create backup before deployment? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        create_backup
    fi
    
    pull_code
    deploy_services
    wait_for_health
    run_migrations
    verify_deployment
    cleanup_backups
    show_summary
    
    log_message "Deployment completed successfully"
}

# Handle script arguments
case "$1" in
    "rollback")
        rollback
        ;;
    "backup")
        create_backup
        ;;
    "status")
        docker-compose -f "$COMPOSE_FILE" ps
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" logs -f "${2:-}"
        ;;
    "health")
        wait_for_health
        ;;
    *)
        main "$@"
        ;;
esac