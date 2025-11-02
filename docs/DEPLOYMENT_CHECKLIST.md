# MemoryHub Deployment Checklist

**Last Updated**: 2025-11-02
**Status**: ✅ All critical fixes complete - Ready for production

---

## 🎯 Pre-Deployment Verification

- [x] All critical fixes completed (8/8)
- [x] Backend builds successfully (`npm run build`)
- [x] Frontend builds successfully (`npm run build`)
- [x] Database schema migrated
- [x] Clerk credentials configured
- [x] Environment variables documented

---

## 🔧 Step 1: Setup Clerk (15 minutes)

### 1.1 Create Clerk Account
1. Go to https://clerk.com
2. Sign up for free account
3. Create new application: "MemoryHub"

### 1.2 Configure Authentication Methods
In Clerk Dashboard:
1. Go to "User & Authentication" → "Email, Phone, Username"
2. Enable:
   - ✅ Email address
   - ✅ Google OAuth (optional)
   - ✅ GitHub OAuth (optional)

### 1.3 Get API Keys
1. Go to https://dashboard.clerk.com/last-active?path=api-keys
2. Copy keys (already added to your .env files):
   - ✅ Publishable Key: `pk_test_your_publishable_key`
   - ✅ Secret Key: `sk_test_your_secret_key`

---

## 🚀 Step 2: Deploy Backend to Render (20 minutes)

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect GitHub repository: `MemoryHub`
3. Select repository root: `memoryhub-mvp`
4. Configure:
   - **Name**: `memoryhub-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `memoryhub-mvp`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or Starter for better performance)

### 2.3 Add Environment Variables

In Render dashboard, add these environment variables:

```bash
# Database (your existing Neon PostgreSQL)
MEMORYHUB_DATABASE_URL=postgresql://username:password@your-host.neon.tech/database?sslmode=require

# Upstash Redis (your existing Redis instance)
UPSTASH_REDIS_REST_URL=https://your-redis-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SECRET=(get this in Step 3 after deploying)

# CORS - Update after deploying frontend
ALLOWED_ORIGINS=*
```

### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment (~5 minutes)
3. Copy your backend URL: `https://memoryhub-backend.onrender.com`

---

## 🪝 Step 3: Configure Clerk Webhook (5 minutes)

### 3.1 Create Webhook
1. Go to Clerk Dashboard → "Webhooks"
2. Click "Add Endpoint"
3. Configure:
   - **Endpoint URL**: `https://memoryhub-backend.onrender.com/api/webhooks/clerk`
   - **Description**: "User synchronization"
   - **Subscribe to events**:
     - ✅ `user.created`
     - ✅ `user.updated`
     - ✅ `user.deleted`

### 3.2 Get Webhook Secret
1. After creating webhook, click on it
2. Copy "Signing Secret" (starts with `whsec_`)
3. Go back to Render dashboard
4. Update `CLERK_WEBHOOK_SECRET` environment variable
5. Click "Save Changes"

### 3.3 Test Webhook
1. In Clerk webhook settings, click "Testing" tab
2. Click "Send Test" for `user.created`
3. Should see "200 OK" response
4. Check Render logs for: `Created user:` message

---

## 🎨 Step 4: Deploy Frontend to Vercel (15 minutes)

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### 4.2 Import Project
1. Click "Add New..." → "Project"
2. Import GitHub repository: `MemoryHub`
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `memoryhub-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 4.3 Add Environment Variables

Add these in Vercel project settings → Environment Variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# Backend API URL (use your Render URL from Step 2.4)
NEXT_PUBLIC_API_URL=https://memoryhub-backend.onrender.com
```

### 4.4 Deploy
1. Click "Deploy"
2. Wait for deployment (~3 minutes)
3. Copy your frontend URL: `https://memoryhub-frontend.vercel.app`

---

## 🔐 Step 5: Update CORS (2 minutes)

### 5.1 Update Backend CORS
1. Go to Render dashboard → `memoryhub-backend`
2. Click "Environment"
3. Update `ALLOWED_ORIGINS`:
   ```bash
   ALLOWED_ORIGINS=https://memoryhub-frontend.vercel.app
   ```
4. Click "Save Changes"
5. Wait for automatic redeploy (~2 minutes)

### 5.2 Update Clerk URLs
1. Go to Clerk Dashboard → "Paths"
2. Update allowed redirect URLs:
   - Add: `https://memoryhub-frontend.vercel.app/*`
   - Add: `https://memoryhub-frontend.vercel.app/dashboard`

---

## ✅ Step 6: End-to-End Testing (10 minutes)

### 6.1 Test User Signup
1. Go to your frontend URL
2. Click "Sign Up"
3. Enter email and create account
4. Verify you receive verification email
5. Verify you're redirected to dashboard

### 6.2 Test Dashboard
1. Verify dashboard loads without errors
2. Check that metrics show "0 memories"
3. Verify API key is displayed

### 6.3 Test Memory Creation
1. Click "Memories" in sidebar
2. Click "Add Memory"
3. Enter: "Test memory from production"
4. Click "Create Memory"
5. Verify it appears in the list

### 6.4 Test Search
1. In search box, type: "production"
2. Click search
3. Verify your test memory appears

### 6.5 Test API Key Management
1. Click "API Keys" in sidebar
2. Verify your API key is shown (masked)
3. Click eye icon to reveal key
4. Click copy icon and verify copied
5. (Optional) Click "Regenerate Key" and verify new key works

### 6.6 Test Clerk Webhook
1. Go to Clerk Dashboard → "Webhooks"
2. Click on your webhook
3. Check "Recent events" - should see events for your test user

---

## 📊 Step 7: Post-Deployment Monitoring

### 7.1 Monitor Backend (Render)
1. Go to Render dashboard → `memoryhub-backend`
2. Click "Logs" tab
3. Look for:
   - ✅ `Rate limiting enabled`
   - ✅ `Created user:` messages
   - ❌ Any error messages

### 7.2 Monitor Clerk Webhooks
1. Go to Clerk Dashboard → "Webhooks"
2. Check webhook logs
3. All deliveries should show 200 OK

### 7.3 Monitor Upstash Redis
1. Go to Upstash dashboard
2. Check "Metrics"
3. Should see API key cache hits/misses

### 7.4 Monitor Database
1. Go to Neon dashboard
2. Check "Monitoring"
3. Should see queries for user and memory operations

---

## 🎉 Success Criteria

Your deployment is successful if:

- ✅ Users can sign up and login with Clerk
- ✅ Dashboard loads and displays user stats
- ✅ Users can create, view, and search memories
- ✅ API keys are displayed and can be regenerated
- ✅ Webhook events are received (check Clerk dashboard)
- ✅ No errors in Render logs
- ✅ All tests in Step 6 pass

---

## 🆘 Troubleshooting

### Issue: 401 Unauthorized on `/api/auth/clerk-link`
**Solution**:
1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are correct
2. Check browser console for CORS errors
3. Verify `ALLOWED_ORIGINS` includes your frontend URL

### Issue: Webhook not firing
**Solution**:
1. Check Clerk webhook URL is correct
2. Verify `CLERK_WEBHOOK_SECRET` matches Clerk dashboard
3. Check Render logs for webhook errors
4. Test webhook manually in Clerk dashboard

### Issue: CORS errors
**Solution**:
1. Verify `ALLOWED_ORIGINS` in backend includes frontend URL
2. Check that frontend URL doesn't have trailing slash
3. Clear browser cache

### Issue: API calls fail
**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` in frontend points to Render backend
2. Check Render service is running (not sleeping)
3. Test backend health: `curl https://your-backend.onrender.com/api/status`

### Issue: Database connection fails
**Solution**:
1. Verify `MEMORYHUB_DATABASE_URL` is correct
2. Check Neon database is active
3. Verify SSL mode is enabled (`?sslmode=require`)

---

## 📝 Optional Enhancements

After successful deployment, consider:

1. **Custom Domain** (Vercel)
   - Add your domain in Vercel settings
   - Update CORS and Clerk redirect URLs

2. **Error Tracking** (Sentry)
   - Sign up at sentry.io
   - Add Sentry SDK to both frontend and backend
   - Configure source maps

3. **Analytics** (Vercel Analytics)
   - Enable in Vercel dashboard
   - Add `<Analytics />` component to layout

4. **Performance Monitoring**
   - Enable Vercel Speed Insights
   - Monitor Render metrics
   - Set up uptime monitoring (e.g., UptimeRobot)

---

## 🎊 You're Live!

Congratulations! Your MemoryHub application is now live in production.

**Next Steps**:
1. Share your app with beta users
2. Monitor logs and metrics
3. Gather feedback
4. Iterate on features (see `TODO.md` for roadmap)

**Support**:
- Frontend issues: Check Vercel logs
- Backend issues: Check Render logs
- Auth issues: Check Clerk dashboard
- Database issues: Check Neon dashboard

---

*Last updated: 2025-11-02*
*Version: 1.0.0 - Production Ready*
