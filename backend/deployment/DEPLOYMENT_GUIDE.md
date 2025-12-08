# MemoryHub Deployment Guide

Guide for deploying and managing the MemoryHub backend on VPS.

## Quick Commands

```bash
# Deploy latest version
./deploy.sh

# View live logs
./deploy.sh logs

# Rollback to previous version
./deploy.sh rollback

# Restart services
docker compose restart

# View container status
docker ps

# Check health
curl http://localhost:3000/api/status
```

---

## Deployment Process

### Standard Deployment

```bash
cd /home/memoryhub/memoryhub/backend/deployment

# Deploy latest code with zero-downtime
./deploy.sh
```

What happens:
1. Validates environment variables
2. Pulls latest code from git
3. Builds new Docker image
4. Starts new container (old container still running)
5. Waits for health checks
6. Switches Caddy to route to new backend
7. Cleans up old images

### Environment Validation

The deployment script checks for required variables:

- `MEMORYHUB_DATABASE_URL`
- `CLERK_SECRET_KEY`
- `CRON_SECRET`
- `DODO_API_KEY`
- `DODO_WEBHOOK_SECRET`
- `DODO_MODE`

### Health Check Process

The deployment waits up to 60 seconds (30 attempts × 2 seconds) for the backend to become healthy. If health checks fail, it automatically rolls back.

---

## Manual Operations

### Container Management

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Restart specific service
docker compose restart backend
docker compose restart caddy

# View logs
docker compose logs -f backend
docker compose logs -f caddy

# View resource usage
docker stats
```

### Updating Configuration

```bash
# After modifying .env.production
docker compose down
docker compose up -d

# After modifying Caddyfile
docker compose restart caddy
```

### Image Management

```bash
# List images
docker images | grep memoryhub

# Clean old images
docker image prune -f

# Force rebuild (without cache)
docker compose build --no-cache backend
```

---

## Troubleshooting

### Common Issues

#### 1. Deployment Fails - Health Check
```bash
# Check what's happening
docker compose logs backend --tail=100

# Manually test health endpoint
curl http://localhost:3000/api/status

# Check if container is running
docker ps
```

#### 2. SSL Certificate Not Issuing
```bash
# Check DNS resolution
nslookup api.yourdomain.com

# Check Caddy logs
docker compose logs caddy

# Ensure ports 80 and 443 are open
sudo ufw status
```

#### 3. Database Connection Issues
```bash
# Test database connection
# In backend container
docker exec -it memoryhub-backend bash
npm run db:test  # if available
# Or check logs for connection errors
docker compose logs backend | grep -i database
```

#### 4. High Memory Usage
```bash
# Check memory usage
docker stats
free -h

# The ML model uses ~500MB (normal)
# Consider VPS upgrade if consistently >85% memory
```

#### 5. Container Won't Start
```bash
# Check detailed logs
docker compose logs backend

# Check environment file exists
ls -la .env.production

# Validate configuration
docker compose config
```

### Debug Mode

For debugging, you can temporarily run without resource limits:

```bash
# Edit docker-compose.yml
# Comment out resource limits section
# Save and redeploy:
docker compose down
docker compose up -d backend
```

---

## Monitoring

### Health Monitoring

```bash
# Health endpoint
curl http://localhost:3000/api/status

# External health check (for UptimeRobot)
curl https://api.yourdomain.com/api/status
```

### Log Monitoring

```bash
# Real-time logs
docker compose logs -f

# Search for errors
docker compose logs backend | grep -i error
docker compose logs caddy | grep -i error

# Recent logs
docker compose logs --tail=100
```

### Resource Monitoring

```bash
# Container resource usage
docker stats

# System resources
htop
free -h
df -h

# Docker disk usage
docker system df
```

### External Monitoring Services

- **UptimeRobot**: Monitors `/api/status`
- **Sentry**: Application errors and performance
- **Highlight.io**: APM and session traces
- **cron-job.org**: Cron job execution monitoring

---

## Emergency Procedures

### Site Down - Immediate Response

1. **Check if containers are running**
   ```bash
   docker ps
   ```

2. **Restart services**
   ```bash
   docker compose restart
   ```

3. **Check health**
   ```bash
   curl http://localhost:3000/api/status
   ```

4. **Review logs**
   ```bash
   docker compose logs backend --tail=50
   ```

5. **Rollback if needed**
   ```bash
   ./deploy.sh rollback
   ```

### Database Issues

1. **Check connection string**
   ```bash
   grep DATABASE_URL .env.production
   ```

2. **Test from container**
   ```bash
   docker exec -it memoryhub-backend bash
   # Test with psql if available
   ```

3. **Check NeonDB dashboard**
   - Visit neon.tech
   - Check connection pool status
   - Verify database is running

### High Load

1. **Check resource usage**
   ```bash
   docker stats
   htop
   ```

2. **Scale if needed**
   - For immediate: Increase VPS resources
   - For long-term: Consider horizontal scaling

### Security Incident

1. **Check access logs**
   ```bash
   docker compose logs caddy | grep -E "(404|401|403)"
   ```

2. **Review failed SSH attempts**
   ```bash
   sudo fail2ban-client status sshd
   ```

3. **Rotate secrets if compromised**
   - Update `.env.production`
   - Restart services: `docker compose restart`
   - Update cron-job.org headers

---

## Backup and Recovery

### Database Backup

NeonDB handles automatic backups. To create manual backups:

```bash
# Install postgresql-client if not installed
sudo apt-get install postgresql-client

# Create backup
pg_dump "$MEMORYHUB_DATABASE_URL" > backup_$(date +%Y%m%d_%H%M%S).sql

# Upload to cloud storage (optional)
aws s3 cp backup_*.sql s3://your-backup-bucket/
```

### Configuration Backup

```bash
# Backup critical files
tar -czf config_backup_$(date +%Y%m%d).tar.gz \
    .env.production \
    docker-compose.yml \
    Caddyfile

# Store securely (not in git!)
```

### Disaster Recovery

1. **Provision new VPS**
2. **Run setup-vps.sh**
3. **Restore configuration from backup**
4. **Deploy with `./deploy.sh`**

---

## Performance Optimization

### Backend Optimization

1. **Enable HTTP/2 and HTTP/3** (already in Caddyfile)
2. **Resource limits** (configured in docker-compose.yml)
3. **Model caching** (volume mount in docker-compose.yml)

### Database Optimization

1. **Connection pooling** (NeonDB handles this)
2. **pgvector indexes** (already in schema)
3. **Query monitoring** (Prisma logs in production mode)

### CDN Option (Optional)

For static assets and additional DDoS protection:

```dns
# Point domain to Cloudflare
api.yourdomain.com → CNAME → your-vps-ip
# Configure Cloudflare to:
# - Proxy requests
# - Enable DDoS protection
# - Cache API responses (if appropriate)
```

---

## Scaling Strategy

### Vertical Scaling (Easier)

1. **Upgrade VPS resources**
2. **Adjust docker-compose.yml limits**
3. **Deploy with `./deploy.sh`**

### Horizontal Scaling (Advanced)

1. **Load balancer** (multiple Caddy instances)
2. **Backend replicas** (multiple backend containers)
3. **Session store** (Redis for shared sessions)
4. **Database read replicas** (NeonDB supports this)

---

## Security Checklist

### Regular Checks

- [ ] Firewall rules: `sudo ufw status`
- [ ] SSH hardening: `sudo fail2ban-client status`
- [ ] File permissions: `ls -la .env.production` (should be 600)
- [ ] Container security: `docker ps --format "table {{.Names}}\t{{.Status}}"`
- [ ] SSL certificate: Check browser for valid certificate

### Rotation Schedule

- **Monthly**: Review access logs
- **Quarterly**: Rotate CRON_SECRET
- **Annually**: Full security audit

---

## Maintenance Schedule

### Daily

- Check UptimeRobot alerts
- Review Sentry errors (if any)

### Weekly

- Review cron job execution
- Check disk space: `df -h`
- Review resource usage: `docker stats`

### Monthly

- Update system packages: `sudo apt update && sudo apt upgrade -y`
- Review and rotate secrets
- Test rollback procedure

### Quarterly

- Full security audit
- Performance testing
- Documentation review

---

## Commands Reference

### Docker Compose

```bash
docker compose up -d           # Start services
docker compose down           # Stop services
docker compose restart        # Restart services
docker compose logs           # View logs
docker compose ps             # List services
docker compose pull           # Pull new images
docker compose build          # Build images
docker compose config         # Validate configuration
```

### Container Debugging

```bash
docker exec -it memoryhub-backend bash    # Enter container
docker inspect memoryhub-backend          # Container info
docker top memoryhub-backend              # Running processes
docker stats memoryhub-backend            # Resource usage
```

### Service Status

```bash
systemctl status docker         # Docker daemon
systemctl status fail2ban       # SSH protection
systemctl status ufw            # Firewall
sudo ufw status                 # Firewall rules
```

---

## Getting Help

1. **Check logs first**: `docker compose logs -f`
2. **Health check**: `curl http://localhost:3000/api/status`
3. **Review this guide**
4. **Check Sentry for application errors**
5. **Refer to VPS_SETUP_GUIDE.md for initial setup**

Remember: Render is still available as a fallback if needed!