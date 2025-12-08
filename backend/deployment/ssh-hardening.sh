#!/bin/bash
set -euo pipefail

# ============================================================================
# SSH Hardening Script for MemoryHub VPS
# ============================================================================
# Run this script to harden SSH security
# Usage: sudo bash ssh-hardening.sh
# ============================================================================

# Configuration
SSH_PORT="2222"

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

# Run as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root (sudo bash ssh-hardening.sh)"
    exit 1
fi

log_info "Starting SSH hardening..."

# Backup original config
log_info "Backing up SSH configuration..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)

# Apply hardening configuration
log_info "Applying SSH hardening rules..."
cat > /etc/ssh/sshd_config.d/99-memoryhub-hardening.conf <<EOF
# MemoryHub SSH Hardening Configuration

# Port
Port $SSH_PORT

# Disable root login
PermitRootLogin no

# Disable password authentication (key-only)
PasswordAuthentication no
PubkeyAuthentication yes

# Disable empty passwords
PermitEmptyPasswords no

# Protocol 2 only
Protocol 2

# Disable X11 forwarding
X11Forwarding no

# Disable TCP forwarding
AllowTcpForwarding no

# Login grace time
LoginGraceTime 30

# Max auth tries
MaxAuthTries 3

# Max sessions
MaxSessions 2

# Allowed users (adjust as needed)
AllowUsers memoryhub
EOF

# Test configuration
log_info "Testing SSH configuration..."
sshd -t

if [ $? -eq 0 ]; then
    log_info "SSH configuration valid, restarting service..."
    systemctl restart sshd

    log_info "=========================================="
    log_info "SSH Hardening Complete!"
    log_info "=========================================="
    log_info ""
    log_warn "IMPORTANT: Test SSH on port $SSH_PORT before closing this session!"
    log_warn "  ssh -p $SSH_PORT memoryhub@<your-vps-ip>"
    log_info ""
    log_info "SSH is now configured with:"
    log_info "  - Custom port: $SSH_PORT"
    log_info "  - Key-only authentication (passwords disabled)"
    log_info "  - Root login disabled"
    log_info "  - Reduced login attempts"
    log_info ""
    log_info "Backup saved: /etc/ssh/sshd_config.backup.*"
else
    log_error "SSH configuration invalid, reverting..."
    rm /etc/ssh/sshd_config.d/99-memoryhub-hardening.conf
    log_error "Hardening failed, original configuration restored"
    exit 1
fi
