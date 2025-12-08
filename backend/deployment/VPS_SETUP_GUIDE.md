# MemoryHub VPS Setup Guide

Complete guide for setting up MemoryHub backend on a VPS with Docker, Caddy, and automated deployments.

## Prerequisites

- A VPS with Ubuntu 22.04 LTS (minimum 2GB RAM, 2 vCPU)
- A domain name pointed to your VPS IP (A record)
- SSH access to your VPS
- Git repository access

## Recommended VPS Providers

- **Hetzner Cloud** - CX21 (4GB RAM, 2 vCPU) @ $5.45/month
- **DigitalOcean** - Basic Droplet 2GB RAM @ $12/month
- **Linode** - Nanode 2GB RAM @ $10/month
- **Vultr** - Regular Performance 2GB RAM @ $12/month

---

## Step 1: Provision VPS

1. **Create VPS Instance**
   - OS: Ubuntu 22.04 LTS
   - RAM: 2GB minimum (4GB recommended)
   - CPU: 2 vCPUs
   - Storage: 20GB SSD minimum

2. **Configure DNS**
   ```
   Type: A
   Name: api (for api.yourdomain.com)
   Value: YOUR_VPS_IP
   TTL: 300 (5 minutes)
   ```

3. **Initial SSH Access**
   ```bash
   ssh root@YOUR_VPS_IP
   ```

---

## Step 2: Run Automated Setup

1. **Upload setup script to VPS**
   ```bash
   # On your local machine
   scp backend/deployment/setup-vps.sh root@YOUR_VPS_IP:/root/
   ```

2. **Run setup script**
   ```bash
   # On VPS as root
   cd /root
   chmod +x setup-vps.sh
   sudo bash setup-vps.sh
   ```

   This script will:
   - Update system packages
   - Install Docker and Docker Compose
   - Create `memoryhub` user
   - Configure UFW firewall (ports 2222, 80, 443)
   - Setup fail2ban for SSH protection
   - Create 2GB swap
   - Enable automatic security updates
   - Configure Docker log rotation

3. **Test new SSH port** (before closing root session!)
   ```bash
   # From another terminal
   ssh -p 2222 memoryhub@YOUR_VPS_IP
   ```

   ⚠️ **Important**: Keep your root session open until you confirm the new SSH port works!

---

## Step 3: Harden SSH (Optional but Recommended)

```bash
# On VPS as root
cd /root
chmod +x ssh-hardening.sh
sudo bash ssh-hardening.sh
```

This will:
- Change SSH port to 2222
- Disable root login
- Disable password authentication (key-only)
- Reduce login attempts

---

## Step 4: Clone Repository

```bash
# Login as memoryhub user
ssh -p 2222 memoryhub@YOUR_VPS_IP

# Clone repository
cd ~
git clone https://github.com/YOUR_USERNAME/MemoryHub-Monorepo.git memoryhub
cd memoryhub/backend/deployment
```

---

## Step 5: Configure Environment Variables

1. **Generate CRON_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   Save this - you'll need it for cron jobs!

2. **Create production environment file**
   ```bash
   cp .env.production.example .env.production
   nano .env.production
   ```

3. **Fill in all required values:**

   ```bash
   # Database (from NeonDB)
   MEMORYHUB_DATABASE_URL="postgresql://user:pass@host.neon.tech/db?sslmode=require"

   # Authentication (from Clerk dashboard)
   CLERK_SECRET_KEY="sk_live_xxxxx"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_xxxxx"
   CLERK_WEBHOOK_SECRET="whsec_xxxxx"

   # Cron Security (generated above)
   CRON_SECRET="your-generated-secret-here"

   # Billing (from Dodo Payments)
   BILLING_PROVIDER="dodo"
   DODO_API_KEY="your-key"
   DODO_WEBHOOK_SECRET="your-secret"
   DODO_MODE="live"  # Change from "test" to "live"
   NEXT_PUBLIC_APP_URL="https://api.yourdomain.com"

   # Rate Limiting (from Upstash)
   UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="your-token"

   # Monitoring (optional)
   SENTRY_DSN="your-sentry-dsn"
   HIGHLIGHT_PROJECT_ID="your-project-id"

   # CORS (your frontend domain)
   ALLOWED_ORIGINS="https://yourdomain.com"
   ```

4. **Secure the file**
   ```bash
   chmod 600 .env.production
   ```

---

## Step 6: Configure Caddy Domain

Edit `Caddyfile` to use your actual domain:

```bash
nano Caddyfile
```

Change:
```
api.memoryhub.com → api.yourdomain.com
your-email@example.com → your-actual-email@domain.com
```

---

## Step 7: Make Scripts Executable

```bash
chmod +x deploy.sh
```

---

## Step 8: Run First Deployment

```bash
./deploy.sh
```

This will:
- Pull latest code from git
- Build Docker images
- Start backend and Caddy containers
- Wait for health checks
- Auto-provision SSL certificate from Let's Encrypt

**Expected output:**
```
[INFO] Starting MemoryHub deployment...
[INFO] Validating environment configuration...
[INFO] Environment validation passed
[INFO] Pulling latest code from git...
[INFO] Building new Docker image...
[INFO] Starting zero-downtime deployment...
[INFO] Waiting for backend to become healthy...
[INFO] Health check passed
[INFO] Deployment completed successfully!
```

---

## Step 9: Verify Deployment

1. **Check container status**
   ```bash
   docker ps
   ```
   Should show: `memoryhub-backend` and `memoryhub-caddy` running

2. **Check health endpoint**
   ```bash
   curl http://localhost:3000/api/status
   ```
   Should return: `{"status":"healthy",...}`

3. **Check HTTPS (from your local machine)**
   ```bash
   curl https://api.yourdomain.com/api/status
   ```
   Should return: `{"status":"healthy",...}`

4. **Check logs**
   ```bash
   docker compose logs -f backend
   ```

---

## Step 10: Configure External Cron Jobs

1. **Sign up at cron-job.org**
   - Visit: https://cron-job.org/en/signup
   - Free tier allows 3 cron jobs

2. **Create cron jobs** (see `cron-config.json` for details):

   **Job 1: Model Warming** (every 5 minutes)
   ```
   URL: https://api.yourdomain.com/api/warm
   Schedule: */5 * * * *
   Method: GET
   Headers: Authorization: Bearer YOUR_CRON_SECRET
   ```

   **Job 2: Cleanup Webhooks** (daily at 2 AM)
   ```
   URL: https://api.yourdomain.com/api/cron/cleanup-webhooks
   Schedule: 0 2 * * *
   Method: GET
   Headers: Authorization: Bearer YOUR_CRON_SECRET
   ```

   **Job 3: Expire Subscriptions** (daily at 3 AM)
   ```
   URL: https://api.yourdomain.com/api/cron/expire-subscriptions
   Schedule: 0 3 * * *
   Method: GET
   Headers: Authorization: Bearer YOUR_CRON_SECRET
   ```

3. **Test each cron job manually**
   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://api.yourdomain.com/api/warm
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://api.yourdomain.com/api/cron/cleanup-webhooks
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://api.yourdomain.com/api/cron/expire-subscriptions
   ```

4. **Enable jobs in cron-job.org dashboard**

---

## Step 11: Setup Monitoring

1. **UptimeRobot** (free tier)
   - Visit: https://uptimerobot.com
   - Add monitor: `https://api.yourdomain.com/api/status`
   - Check every 5 minutes
   - Alert via email on downtime

2. **Check Sentry Integration**
   - Visit your Sentry dashboard
   - Verify events are being logged

3. **Check Highlight.io Integration**
   - Visit your Highlight dashboard
   - Verify traces are being recorded

---

## Step 12: Update Frontend Configuration

Update your frontend to point to the new VPS backend:

```bash
# In your frontend .env file
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

Redeploy frontend.

---

## Step 13: Verify Everything Works

1. **Test authentication** (from frontend)
2. **Test memory creation** (from frontend)
3. **Test search** (from frontend)
4. **Monitor logs for 24 hours**
   ```bash
   docker compose logs -f backend
   ```

---

## Security Checklist

- [ ] UFW firewall configured (ports 2222, 80, 443 only)
- [ ] SSH port changed from 22 to 2222
- [ ] Root login disabled
- [ ] Password authentication disabled (key-only)
- [ ] fail2ban enabled
- [ ] .env.production has 600 permissions
- [ ] CRON_SECRET is strong and unique
- [ ] SSL certificate auto-provisioned
- [ ] Automatic security updates enabled
- [ ] Backup of .env.production in password manager

---

## Maintenance

- **View logs**: `docker compose logs -f backend`
- **Restart services**: `docker compose restart`
- **Stop services**: `docker compose down`
- **Start services**: `docker compose up -d`
- **Update to latest**: `./deploy.sh`
- **Check disk space**: `df -h`
- **Check memory**: `free -h`
- **Check Docker resources**: `docker stats`

---

## Troubleshooting

### SSL Certificate Not Provisioning
1. Verify DNS is pointed to VPS IP: `nslookup api.yourdomain.com`
2. Check Caddy logs: `docker compose logs caddy`
3. Ensure ports 80 and 443 are open: `sudo ufw status`

### Backend Not Responding
1. Check health: `curl http://localhost:3000/api/status`
2. Check logs: `docker compose logs backend`
3. Verify env file exists: `ls -la .env.production`
4. Check database connection in logs

### High Memory Usage
1. Check Docker stats: `docker stats`
2. ML model uses ~500MB (normal)
3. Consider upgrading to 4GB RAM VPS

### Cron Jobs Failing
1. Test endpoints manually with curl
2. Verify CRON_SECRET matches .env.production
3. Check backend logs during cron execution
4. Verify cron-job.org is not blocked by firewall

---

## Next Steps

- See `DEPLOYMENT_GUIDE.md` for ongoing deployment procedures
- Setup CI/CD with GitHub Actions (future enhancement)
- Configure Cloudflare for additional DDoS protection (optional)
- Setup database backups (optional)

---

## Support

If you encounter issues:
1. Check logs: `docker compose logs -f backend`
2. Check health: `curl http://localhost:3000/api/status`
3. Verify environment variables are set correctly
4. Check firewall: `sudo ufw status`
5. Review Sentry for application errors
