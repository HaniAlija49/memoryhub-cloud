#!/bin/bash
set -euo pipefail

# ============================================================================
# MemoryHub VPS Initial Setup Script
# ============================================================================
# Run this script once on a fresh Ubuntu 22.04 VPS
# Usage: sudo bash setup-vps.sh
# ============================================================================

# Configuration
DEPLOY_USER="memoryhub"
SSH_PORT="2222"  # Change from default 22 for security

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Must run as root initially
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root (or with sudo)"
    exit 1
fi

log_info "Starting VPS setup for MemoryHub..."

# Update system
log_info "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install required packages
log_info "Installing required packages..."
apt-get install -y \
    curl \
    wget \
    git \
    ufw \
    fail2ban \
    unattended-upgrades \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release

# Install Docker
log_info "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
log_info "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION="2.24.0"
curl -L "https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create deployment user
log_info "Creating deployment user: $DEPLOY_USER"
if ! id -u "$DEPLOY_USER" > /dev/null 2>&1; then
    useradd -m -s /bin/bash "$DEPLOY_USER"
    usermod -aG docker "$DEPLOY_USER"
    log_info "User $DEPLOY_USER created and added to docker group"
else
    log_warn "User $DEPLOY_USER already exists"
fi

# Setup SSH directory for deploy user
log_info "Setting up SSH for $DEPLOY_USER..."
mkdir -p /home/$DEPLOY_USER/.ssh
chmod 700 /home/$DEPLOY_USER/.ssh

# Copy root's authorized_keys to deploy user (if exists)
if [ -f /root/.ssh/authorized_keys ]; then
    cp /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/authorized_keys
    chmod 600 /home/$DEPLOY_USER/.ssh/authorized_keys
    chown -R $DEPLOY_USER:$DEPLOY_USER /home/$DEPLOY_USER/.ssh
    log_info "SSH keys copied to $DEPLOY_USER"
fi

# Configure firewall
log_info "Configuring UFW firewall..."
ufw --force disable
ufw default deny incoming
ufw default allow outgoing
ufw allow $SSH_PORT/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP'
ufw allow 443/tcp comment 'HTTPS'
ufw allow 443/udp comment 'HTTP/3'
ufw --force enable

log_info "Firewall configured and enabled"

# Configure fail2ban
log_info "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = $SSH_PORT
EOF

systemctl enable fail2ban
systemctl restart fail2ban

# Enable automatic security updates
log_info "Enabling automatic security updates..."
cat > /etc/apt/apt.conf.d/50unattended-upgrades <<EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
};
Unattended-Upgrade::Automatic-Reboot "false";
EOF

# Setup swap (recommended for 2GB RAM VPS)
log_info "Setting up 2GB swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log_info "Swap configured"
else
    log_warn "Swap file already exists"
fi

# Create deployment directory
log_info "Creating deployment directory..."
DEPLOY_DIR="/home/$DEPLOY_USER/memoryhub"
mkdir -p $DEPLOY_DIR
chown -R $DEPLOY_USER:$DEPLOY_USER $DEPLOY_DIR

# Setup log rotation for Docker
log_info "Configuring Docker log rotation..."
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

systemctl restart docker

log_info "=========================================="
log_info "VPS Setup Complete!"
log_info "=========================================="
log_info ""
log_info "Next steps:"
log_info "1. Login as $DEPLOY_USER: su - $DEPLOY_USER"
log_info "2. Clone repository: git clone <your-repo> $DEPLOY_DIR"
log_info "3. Copy .env.production file to deployment/"
log_info "4. Run first deployment: cd $DEPLOY_DIR/backend/deployment && ./deploy.sh"
log_info ""
log_info "IMPORTANT: SSH port changed to $SSH_PORT"
log_info "Test SSH on new port before closing this session!"
log_info "  ssh -p $SSH_PORT $DEPLOY_USER@<your-vps-ip>"
log_info ""
log_info "Security:"
log_info "- Firewall: ufw status"
log_info "- Fail2ban: fail2ban-client status"
log_info "- Docker: docker --version"
