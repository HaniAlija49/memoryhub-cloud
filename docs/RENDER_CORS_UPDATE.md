# Update CORS Configuration on Render

**Date**: 2025-11-09
**Action Required**: Update production environment variables

---

## 🎯 What to Update

You need to update the `ALLOWED_ORIGINS` environment variable on your Render deployment.

---

## 📋 Step-by-Step Instructions

### 1. Go to Render Dashboard
1. Navigate to https://dashboard.render.com
2. Click on your `memoryhub-cloud` (or `memoryhub-backend`) service

### 2. Update Environment Variables
1. Click **"Environment"** in the left sidebar
2. Find the `ALLOWED_ORIGINS` variable (or add it if it doesn't exist)
3. **Update the value to**:
   ```
   https://memoryhub-frontend.vercel.app
   ```

   **If you have a custom domain, use that instead:**
   ```
   https://www.yourapp.com
   ```

   **If you have BOTH Vercel and custom domain:**
   ```
   https://memoryhub-frontend.vercel.app,https://www.yourapp.com
   ```

4. Click **"Save Changes"**

### 3. Wait for Automatic Redeploy
- Render will automatically redeploy your service (takes ~2-3 minutes)
- You'll see the deployment progress in the "Events" tab

---

## ✅ What This Does

**Before:**
- `ALLOWED_ORIGINS="*"` → Accepts requests from ANY website (insecure ❌)

**After:**
- `ALLOWED_ORIGINS="https://memoryhub-frontend.vercel.app"` → Only accepts requests from your frontend ✅

**Important Notes:**
- ✅ **MCP servers are NOT affected** - They don't use CORS and will continue working
- ✅ **API key authentication still works** - This only affects browser CORS
- ✅ **Localhost still works in development** - Your local `.env` is set to empty (uses defaults)

---

## 🧪 How to Test After Update

### Test 1: Frontend Works
1. Go to https://memoryhub-frontend.vercel.app
2. Log in
3. Try creating a memory
4. ✅ Should work normally

### Test 2: MCP Still Works
1. Use Claude Code with your MCP server
2. Try any memory operation
3. ✅ Should work exactly as before

### Test 3: Unauthorized Origins Blocked
1. Open browser console on a random website (like google.com)
2. Try to call your API:
   ```javascript
   fetch('https://memoryhub-cloud.onrender.com/api/status')
   ```
3. ✅ Should see CORS error (this is good!)

---

## 🔍 Troubleshooting

### Issue: Frontend shows CORS errors
**Cause**: Wrong URL in `ALLOWED_ORIGINS`

**Fix**:
1. Check your actual Vercel URL (it might be different)
2. Make sure there's NO trailing slash: ✅ `https://app.vercel.app` ❌ `https://app.vercel.app/`
3. Make sure protocol is included: ✅ `https://` ❌ `app.vercel.app`

### Issue: MCP stopped working
**This shouldn't happen!** MCP doesn't use CORS.

**If it does happen**:
1. Check your API key is still valid
2. Verify the API URL is correct
3. MCP should work regardless of CORS settings

---

## 📝 Summary

**What you updated:**
- ✅ Local `.env`: Set to empty (uses localhost defaults)
- ⏳ Render: Need to set to your frontend URL

**After this update:**
- ✅ Tighter security (only your frontend can access via browser)
- ✅ MCP continues to work unchanged
- ✅ Production-ready configuration

---

**Last Updated**: 2025-11-09
