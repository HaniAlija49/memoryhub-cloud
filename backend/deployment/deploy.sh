#!/bin/bash
set -euo pipefail  # Exit on error, undefined vars, pipe failures

# ============================================================================
# MemoryHub Backend Deployment Script
# ============================================================================
# This script performs zero-downtime deployments with health checks and rollback
# ============================================================================

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOYMENT_DIR="$SCRIPT_DIR"
ENV_FILE="$DEPLOYMENT_DIR/.env.production"
COMPOSE_FILE="$DEPLOYMENT_DIR/docker-compose.yml"
HEALTH_CHECK_URL="http://localhost:3000/api/status"
MAX_HEALTH_CHECK_ATTEMPTS=30
HEALTH_CHECK_INTERVAL=2

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# Helper Functions
# ============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as non-root
check_user() {
    if [ "$EUID" -eq 0 ]; then
        log_error "Do not run this script as root"
        exit 1
    fi
}

# Validate environment file exists
validate_env() {
    log_info "Validating environment configuration..."

    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file not found: $ENV_FILE"
        log_error "Copy .env.production.example to .env.production and configure it"
        exit 1
    fi

    # Check for required variables
    required_vars=(
        "MEMORYHUB_DATABASE_URL"
        "CLERK_SECRET_KEY"
        "CRON_SECRET"
        "DODO_API_KEY"
        "DODO_WEBHOOK_SECRET"
        "DODO_MODE"
    )

    missing_vars=()
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$ENV_FILE"; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_error "Missing required environment variables:"
        printf '%s\n' "${missing_vars[@]}"
        exit 1
    fi

    # Warn if DODO_MODE is still in test mode
    if grep -q "^DODO_MODE=test" "$ENV_FILE"; then
        log_warn "DODO_MODE is set to 'test' - ensure this is intentional for production"
        read -p "Continue? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    log_info "Environment validation passed"
}

# Pull latest code from git
pull_code() {
    log_info "Pulling latest code from git..."
    cd "$BACKEND_ROOT"

    # Stash any local changes
    if ! git diff-index --quiet HEAD --; then
        log_warn "Local changes detected, stashing..."
        git stash
    fi

    # Pull latest
    git pull origin master || {
        log_error "Failed to pull latest code"
        exit 1
    }

    log_info "Code updated successfully"
}

# Build new Docker image
build_image() {
    log_info "Building new Docker image..."
    cd "$DEPLOYMENT_DIR"

    # Tag with timestamp for rollback capability
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    NEW_TAG="memoryhub-backend:$TIMESTAMP"

    docker compose build backend || {
        log_error "Docker build failed"
        exit 1
    }

    # Tag the new image
    docker tag memoryhub-backend:latest "$NEW_TAG"

    log_info "Image built and tagged as $NEW_TAG"
    echo "$NEW_TAG" > "$DEPLOYMENT_DIR/.last_deployment"
}

# Health check function
check_health() {
    local url=$1
    local attempts=$2
    local interval=$3

    log_info "Waiting for backend to become healthy..."

    for i in $(seq 1 $attempts); do
        if curl -f -s -o /dev/null "$url"; then
            log_info "Health check passed (attempt $i/$attempts)"
            return 0
        fi

        if [ $i -lt $attempts ]; then
            echo -n "."
            sleep $interval
        fi
    done

    log_error "Health check failed after $attempts attempts"
    return 1
}

# Deploy with zero-downtime
deploy() {
    log_info "Starting zero-downtime deployment..."
    cd "$DEPLOYMENT_DIR"

    # Start new container (old one still running)
    docker compose up -d --no-deps --build backend || {
        log_error "Failed to start new container"
        exit 1
    }

    # Wait for health check
    if ! check_health "$HEALTH_CHECK_URL" $MAX_HEALTH_CHECK_ATTEMPTS $HEALTH_CHECK_INTERVAL; then
        log_error "New container failed health check, rolling back..."
        rollback
        exit 1
    fi

    # Update Caddy (will route to new backend)
    docker compose up -d caddy || {
        log_error "Failed to update Caddy"
        exit 1
    }

    # Cleanup old images (keep last 3)
    log_info "Cleaning up old Docker images..."
    docker image prune -f --filter "until=72h"

    log_info "Deployment completed successfully!"
}

# Rollback to previous deployment
rollback() {
    log_warn "Rolling back to previous deployment..."
    cd "$DEPLOYMENT_DIR"

    if [ -f "$DEPLOYMENT_DIR/.last_deployment" ]; then
        LAST_TAG=$(cat "$DEPLOYMENT_DIR/.last_deployment")
        docker tag "$LAST_TAG" memoryhub-backend:latest
        docker compose up -d --no-deps backend
        log_info "Rollback completed"
    else
        log_error "No previous deployment found for rollback"
        exit 1
    fi
}

# Show deployment logs
show_logs() {
    log_info "Showing deployment logs (Ctrl+C to exit)..."
    cd "$DEPLOYMENT_DIR"
    docker compose logs -f --tail=100 backend
}

# ============================================================================
# Main Execution
# ============================================================================

main() {
    log_info "Starting MemoryHub deployment..."
    log_info "Deployment directory: $DEPLOYMENT_DIR"

    check_user
    validate_env
    pull_code
    build_image
    deploy

    log_info "=========================================="
    log_info "Deployment completed successfully!"
    log_info "=========================================="
    log_info "Backend: http://localhost:3000"
    log_info "Health: http://localhost:3000/api/status"
    log_info ""
    log_info "View logs: docker compose -f $COMPOSE_FILE logs -f backend"
    log_info "Rollback: $SCRIPT_DIR/rollback.sh"
}

# Parse command line arguments
case "${1:-}" in
    logs)
        show_logs
        ;;
    rollback)
        rollback
        ;;
    *)
        main
        ;;
esac
