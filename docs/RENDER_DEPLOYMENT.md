# Render Deployment - Environment Variables Setup

## Required Environment Variables for Backend

Go to your Render dashboard → Your backend service → Environment tab

Add these environment variables:

### 1. Database (Required)
```
MEMORYHUB_DATABASE_URL=<your-neon-postgres-connection-string>
```
Get from: Neon dashboard → Connection string

### 2. Clerk Authentication (Required)
```
CLERK_SECRET_KEY=<your-clerk-secret-key>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>
```
Get from: https://dashboard.clerk.com → API Keys

### 3. Upstash Redis (Optional - for rate limiting)
```
UPSTASH_REDIS_REST_URL=<your-upstash-redis-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-redis-token>
```
Get from: https://console.upstash.com → Your Redis database

### 4. Dodo Payments (Required for billing)
```
BILLING_PROVIDER=dodo
DODO_API_KEY=sWykwCaIvJeXGQC2.LPJ84lmQHpHIsmWYN01ijQNpB1jZ6derC6yDmA9m4nsUaje_
DODO_WEBHOOK_SECRET=<get-from-dodo-dashboard-after-webhook-setup>
DODO_MODE=test
```
**Note**: Use `DODO_MODE=live` for production after testing

### 5. Application URL (Required for billing redirects)
```
NEXT_PUBLIC_APP_URL=https://your-backend-url.onrender.com
```
Replace with your actual Render backend URL

### 6. Node Environment (Required)
```
NODE_ENV=production
```

### 7. Highlight.io (Optional - monitoring)
```
HIGHLIGHT_PROJECT_ID=<your-highlight-project-id>
```
Get from: https://app.highlight.io/setup

---

## Complete Example

Here's a complete set of environment variables for Render:

```bash
# Database
MEMORYHUB_DATABASE_URL=postgresql://user:password@host.neon.tech/database?sslmode=require

# Clerk Auth
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Redis (optional)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# Billing
BILLING_PROVIDER=dodo
DODO_API_KEY=sWykwCaIvJeXGQC2.LPJ84lmQHpHIsmWYN01ijQNpB1jZ6derC6yDmA9m4nsUaje_
DODO_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
DODO_MODE=test
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com

# Environment
NODE_ENV=production

# Monitoring (optional)
HIGHLIGHT_PROJECT_ID=5g5y914e
```

---

## After Adding Environment Variables

1. Click **Save Changes** in Render
2. Render will automatically **redeploy** your backend
3. Build should now succeed
4. Check deploy logs for "✅ Environment validation passed"

---

## Troubleshooting

### Build still failing?
- Ensure all required variables are set
- Check for typos in variable names
- Verify database connection string is correct

### Runtime errors after deployment?
- Check Render logs: Dashboard → Your Service → Logs
- Look for environment validation errors
- Verify all required services (Clerk, Neon) are accessible from Render

---

## Security Notes

⚠️ **Never commit these to Git!**
- All secrets should only be in Render's environment variables
- `.env.local` is in `.gitignore`
- `.env.example` contains placeholders only

---

## Next Steps After Deployment

1. ✅ Verify backend is running
2. ✅ Test `/api/status` endpoint
3. ✅ Configure Dodo webhook to point to your Render URL
4. ✅ Test a checkout flow
5. ✅ Switch `DODO_MODE=live` when ready for production
