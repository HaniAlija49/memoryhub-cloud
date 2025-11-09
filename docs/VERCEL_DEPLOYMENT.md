# Vercel Deployment Guide - Frontend

**Backend API**: https://memoryhub-cloud.onrender.com

---

## 🚀 Deploy to Vercel

### Step 1: Import Project

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `HaniAlija49/memoryhub-cloud`

### Step 2: Configure Project

**Framework Preset**: Next.js (auto-detected)
**Root Directory**: `frontend`
**Build Command**: `npm run build` (auto-detected)
**Output Directory**: `.next` (auto-detected)
**Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add these **3 variables**:

#### 1. NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```
pk_test_your_publishable_key_here
```
(Get from https://dashboard.clerk.com/last-active?path=api-keys)

#### 2. CLERK_SECRET_KEY
```
sk_test_your_secret_key_here
```
(Get from https://dashboard.clerk.com/last-active?path=api-keys)

#### 3. NEXT_PUBLIC_API_URL
```
https://memoryhub-cloud.onrender.com
```

**Important**: Make sure to select **"All Environments"** (Production, Preview, and Development) for each variable.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your frontend will be live at: `https://your-project.vercel.app`

---

## 📝 After Deployment

### Update Backend CORS

Once your frontend is deployed, you need to update the backend to allow your frontend URL:

1. Go to Render Dashboard → `memoryhub-cloud`
2. Click **"Environment"**
3. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
4. Click **"Save Changes"**
5. Wait for backend to redeploy (~2 minutes)

### Update Clerk Redirect URLs

1. Go to Clerk Dashboard → **"Paths"**
2. Add your Vercel URL to allowed redirect URLs:
   - Add: `https://your-project.vercel.app/*`
   - Add: `https://your-project.vercel.app/dashboard`

---

## ✅ Test Your Deployment

1. Visit your Vercel URL
2. Click **"Sign Up"**
3. Create an account with email
4. Verify you're redirected to dashboard
5. Check that dashboard loads (it will show "0 memories")
6. Click **"Memories"** → **"Add Memory"**
7. Create a test memory
8. Verify it appears in the list

---

## 🔍 Troubleshooting

### "Failed to fetch" or CORS errors
**Solution**: Make sure `ALLOWED_ORIGINS` in backend includes your Vercel URL

### "Invalid API URL" error
**Solution**: Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel environment variables

### 401 Unauthorized errors
**Solution**:
1. Check Clerk keys are correct in Vercel
2. Verify Clerk redirect URLs include your Vercel domain

### Backend returns 503/504
**Solution**: Render free tier may be sleeping. Visit the backend URL first to wake it up: https://memoryhub-cloud.onrender.com/api/status

---

## 🎉 Success!

Once deployed, your app will be live with:
- ✅ Frontend on Vercel (fast, global CDN)
- ✅ Backend on Render (with database + Redis)
- ✅ Clerk authentication
- ✅ Production-ready performance

---

**Last Updated**: 2025-11-02
