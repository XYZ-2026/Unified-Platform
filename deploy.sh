#!/usr/bin/env bash
# ==============================================================================
# 🚀 Deployment Script — Abroad Simplified Admin Panel
# Multi-Project VPS Safe Deployment
# ==============================================================================

set -eo pipefail

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Determine script directory (root of the repository)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log_info() {
    echo -e "${BLUE}${BOLD}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}${BOLD}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}${BOLD}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}${BOLD}[ERROR]${NC} $1"
}

echo -e "${BOLD}====================================================${NC}"
echo -e "${BOLD}  🚀 Abroad Simplified — VPS Deployment (${SCRIPT_DIR})  ${NC}"
echo -e "${BOLD}====================================================${NC}"

# 1. Verify Prerequisites
log_info "Checking environment and dependencies..."

if ! command -v git &> /dev/null; then
    log_error "git is not installed. Please install git first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    log_error "docker is not installed. Please install Docker first."
    exit 1
fi

# Detect docker compose plugin or standalone docker-compose
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    log_error "Docker Compose (v2 or v1) is not installed."
    exit 1
fi

# 2. Check for .env
if [ ! -f ".env" ]; then
    log_warning ".env not found in $(pwd)!"
    if [ -f ".env.example" ]; then
        log_info "Creating .env from template .env.example..."
        cp .env.example .env
        log_warning "Please edit .env with your actual production keys before continuing:"
        echo "  nano $(pwd)/.env"
        exit 1
    elif [ -f ".env.production.example" ]; then
        log_info "Creating .env from template .env.production.example..."
        cp .env.production.example .env
        log_warning "Please edit .env with your actual production keys before continuing:"
        echo "  nano $(pwd)/.env"
        exit 1
    else
        log_error "Missing .env file. Please create it before deploying."
        exit 1
    fi
fi

# 3. Pull latest changes from git
log_info "Fetching latest code from Git repository..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
log_info "Current branch: ${CURRENT_BRANCH}"

# Stash uncommitted changes if any to prevent merge conflicts
if ! git diff --quiet || ! git diff --cached --quiet; then
    log_warning "Local modifications detected. Stashing local changes..."
    git stash
fi

git pull origin "${CURRENT_BRANCH}"

# 4. Build and Launch Containers
log_info "Building and starting Docker services..."
$COMPOSE_CMD up -d --build --remove-orphans

# 5. Clean up dangling images (SAFE FOR SHARED VPS)
# Notice: Only prunes dangling un-tagged intermediate build images.
# Does NOT use 'docker system prune -a' to protect other hosted projects on this VPS!
log_info "Cleaning up unused build cache & dangling images (safe mode)..."
docker image prune -f

# 6. Verify Service Health Status
log_info "Checking container status..."
echo ""
$COMPOSE_CMD ps
echo ""

# Quick health verification
RUNNING_CONTAINERS=$($COMPOSE_CMD ps --services --filter "status=running")
if [ -n "$RUNNING_CONTAINERS" ]; then
    log_success "Deployment completed successfully! Active services:"
    echo "$RUNNING_CONTAINERS" | sed 's/^/  - /'
else
    log_warning "No running containers detected. Please check logs:"
    echo "  $COMPOSE_CMD logs --tail=100"
fi

echo ""
echo -e "${BOLD}====================================================${NC}"
echo -e "${GREEN}${BOLD}✔ Deployment Finished!${NC}"
echo -e "Helpful commands for this project:"
echo -e "  • View logs:    ${BOLD}$COMPOSE_CMD logs -f${NC}"
echo -e "  • Restart:      ${BOLD}$COMPOSE_CMD restart${NC}"
echo -e "  • Status:       ${BOLD}$COMPOSE_CMD ps${NC}"
echo -e "${BOLD}====================================================${NC}"
