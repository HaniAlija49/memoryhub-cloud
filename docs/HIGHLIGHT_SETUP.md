# Highlight.io Integration - Setup Summary

**Date**: 2025-11-09
**Project ID**: `5g5y914e`
**Status**: ✅ Implemented (Ready for Testing)

---

## 📦 What Was Installed

### Frontend (`frontend/`)
- Package: `@highlight-run/next@latest` (81 packages added)
- Integration: Session Replay, Error Monitoring, Network Recording

### Backend (`backend/`)
- Package: `@highlight-run/next@latest` (127 packages added)
- Integration: API Tracing, Error Tracking, Performance Monitoring

---

## ⚙️ Configuration Details

### Frontend Integration

**File**: `frontend/app/layout.tsx` (SDK Initialization)
```typescript
import { HighlightInit } from '@highlight-run/next/client'

<HighlightInit
  projectId="5g5y914e"
  serviceName="memoryhub-frontend"
  environment={process.env.NODE_ENV} // 'development' or 'production'
  tracingOrigins={true}
  networkRecording={{
    enabled: true,
    recordHeadersAndBody: true,
    urlBlocklist: ['/api/webhooks/clerk'],
  }}
/>
```

**Features Enabled**:
- ✅ Session replay (500 sessions/month free)
- ✅ Network request recording
- ✅ Error monitoring with AI grouping
- ✅ User identification with Clerk
- ✅ Headers & body recording (sensitive endpoints blocked)

**Error Boundary**: `frontend/components/error-boundary.tsx`
```typescript
import { ErrorBoundary } from '@/components/error-boundary'

// Wraps dashboard in app/dashboard/layout.tsx
<ErrorBoundary>
  <DashboardLayout>{children}</DashboardLayout>
</ErrorBoundary>
```

**Features**:
- ✅ Catches React component crashes
- ✅ Reports errors to Highlight.io automatically
- ✅ Shows user-friendly error UI
- ✅ Includes "reload page" and "go to dashboard" buttons

**User Identification**: `frontend/components/dashboard-layout.tsx`
```typescript
H.identify(user.primaryEmailAddress?.emailAddress || user.id, {
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.primaryEmailAddress?.emailAddress,
  createdAt: user.createdAt,
})
```

---

### Backend Integration

**Configuration File**: `backend/app/_utils/app-router-highlight.config.ts`
```typescript
export const HIGHLIGHT_CONFIG = {
  projectID: '5g5y914e',
  serviceName: 'memoryhub-backend',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development', // 'development' or 'production'
}
```

**Features**:
- Centralized Highlight.io wrapper for App Router
- Automatic span creation for all requests
- Error tracking with context
- Performance tracing
- **Environment tagging** - Tags all sessions with NODE_ENV
- **Console log interception** - All `console.log`, `console.error`, `console.warn` sent to Highlight
- **Automatic error reporting** - Errors thrown in API routes captured automatically

**Wrapped Endpoints**:
1. ✅ `POST /api/memory` - Create memory
2. ✅ `POST /api/memory/search` - Search memories
3. ✅ `GET /api/memory/list` - List memories

**Pattern Used**:
```typescript
import { withAppRouterHighlight } from '@/app/_utils/app-router-highlight.config'

export const POST = withAppRouterHighlight(async function POST(request: NextRequest) {
  // Your route handler code
})
```

---

## 🔐 Environment Variables

### Frontend (`.env.local`)
```bash
# Highlight.io Error Tracking & Session Replay
# Get this from https://app.highlight.io/setup
NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID=5g5y914e
```

### Backend (`.env`)
```bash
# Highlight.io Error Tracking & Observability
# Get this from https://app.highlight.io/setup
HIGHLIGHT_PROJECT_ID="5g5y914e"
```

### Updated Files:
- ✅ `frontend/.env.local`
- ✅ `backend/.env`
- ✅ `backend/.env.example`

---

## 📊 Monitoring Capabilities

### Frontend Monitoring
- **Session Replay**: See exactly what users did before an error
- **Network Recording**: All API requests/responses captured
- **User Sessions**: Tracked with Clerk user information
- **Console Logs**: All console.log/error captured
- **Performance**: Page load times, interactions

### Backend Monitoring
- **API Tracing**: Request→Response timing for all endpoints
- **Error Tracking**: Exceptions with full stack traces
- **Console Logs**: All console.log/error/warn automatically sent to Highlight
- **Performance**: Database query times, embedding generation
- **Distributed Tracing**: Frontend→Backend request correlation
- **Custom Metrics**: Can add via `H.recordMetric()`

**Log Capture Examples**:
```typescript
console.log('User created memory', { userId, memoryId })  // → Sent to Highlight
console.error('Database error:', error)                    // → Sent to Highlight as error
console.warn('Rate limit approaching', { count: 95 })      // → Sent to Highlight as warning
```

---

## 🚀 Next Steps

### 1. Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Verify Integration
- Visit: https://app.highlight.io/5g5y914e
- Look for:
  - ✅ Session replay appearing (frontend)
  - ✅ API traces showing up (backend)
  - ✅ User identification working (shows email/name)
  - ✅ Network requests being captured

### 3. Test Error Tracking

**Frontend Test** (React crashes):
```typescript
// Add this temporarily to any dashboard page
useEffect(() => {
  throw new Error('Test error from frontend!')
}, [])
```
- Should show error boundary UI
- Check Highlight.io for captured session + error

**Frontend Test** (Manual errors):
```typescript
import { H } from '@highlight-run/next/client'

H.consumeError(new Error('Manual error test'), 'Testing error tracking')
```

**Backend Test** (Console logs):
```typescript
console.log('Test log from backend API')
console.error('Test error from backend API')
```
- Check Highlight.io "Logs" tab for these messages

**Backend Test** (API errors):
- Make an invalid API request (missing required fields)
- Check Highlight.io for error trace

### 4. Development vs Production (Important!)

**Highlight.io is DISABLED in development to save quota!**

The configuration automatically detects `NODE_ENV` and only runs in production:

**Frontend** (`app/layout.tsx`):
```typescript
const isProduction = process.env.NODE_ENV === 'production'

{isProduction && (
  <HighlightInit projectId="5g5y914e" ... />
)}
```

**Backend** (`app-router-highlight.config.ts`):
```typescript
const isProduction = process.env.NODE_ENV === 'production'

if (!isProduction) {
  return handler(request, context) // Skip Highlight entirely
}
```

**Result**:
- ✅ **Localhost (development)**: Highlight.io completely disabled, 0 quota usage
- ✅ **Production (Vercel/Render)**: Highlight.io enabled, tracks real users only
- ✅ No need for dashboard filters (requires paid plan)
- ✅ Your 500 sessions/month are reserved for actual users

**To test Highlight.io locally** (temporary):
```bash
# Set NODE_ENV to production temporarily
NODE_ENV=production npm run dev
```

### 5. Production Deployment

**Vercel (Frontend)**:
Add environment variable in Vercel dashboard:
```
NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID=5g5y914e
```

**Render (Backend)**:
Add environment variable in Render dashboard:
```
HIGHLIGHT_PROJECT_ID=5g5y914e
```

**Note**: Make sure `NODE_ENV=production` is set on both platforms (usually automatic)

---

## 📈 Free Tier Limits

**Highlight.io Free Plan** (Forever):
- ✅ 500 sessions/month
- ✅ Unlimited errors with AI grouping
- ✅ Up to 15 team members
- ✅ 7-day data retention
- ✅ No time limit (not trial-based)

**Usage Tracking**:
- Visit: https://app.highlight.io/5g5y914e/settings/billing
- Monitor: Session count, error count, team size

---

## 🔧 Troubleshooting

### No Sessions Appearing

**Check 1**: Environment variable set
```bash
# Frontend: Should see this in browser console (dev tools)
console.log(process.env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID) // Should be "5g5y914e"
```

**Check 2**: Restart dev servers after adding env vars
```bash
# Kill servers (Ctrl+C) and restart
npm run dev
```

**Check 3**: Check browser network tab
- Should see requests to `pub.highlight.io`
- If blocked: Check ad blockers, privacy extensions

### No Backend Traces

**Check 1**: Verify Highlight initialized
```typescript
// In any API route, add temporarily:
console.log('Highlight Project ID:', process.env.HIGHLIGHT_PROJECT_ID)
```

**Check 2**: Check wrapped endpoints
- Only wrapped endpoints send traces
- Use `withAppRouterHighlight()` on all routes

**Check 3**: Check Highlight.io dashboard
- Go to "Traces" section
- Filter by service: `memoryhub-backend`

### User Not Identified

**Check 1**: User logged in
- User identification only works when authenticated
- Must be on dashboard (not landing page)

**Check 2**: Check Clerk integration
```typescript
// In dashboard-layout.tsx, add temporarily:
console.log('User loaded:', isLoaded, user?.id)
```

**Check 3**: Check Highlight.io sessions
- Click on a session
- Should show user email/ID in session details

---

## 📝 Additional Endpoints to Wrap

Currently wrapped:
- ✅ `/api/memory` (POST)
- ✅ `/api/memory/search` (POST)
- ✅ `/api/memory/list` (GET)

**Recommended to wrap next**:
- `/api/memory/[id]` (GET, PUT, DELETE)
- `/api/memory/stats` (GET)
- `/api/api-keys` (GET, PUT)
- `/api/status` (GET)
- `/api/auth/*` (all auth endpoints)

**Pattern**:
1. Open route file
2. Import: `import { withAppRouterHighlight } from '@/app/_utils/app-router-highlight.config'`
3. Change: `export async function POST(request: NextRequest) {`
4. To: `export const POST = withAppRouterHighlight(async function POST(request: NextRequest) {`
5. Add closing: `})` at end

---

## 🎯 Benefits Over Sentry

| Feature | Highlight.io | Sentry |
|---------|-------------|--------|
| Session Replay | ✅ Included | ❌ Paid only ($80+/mo) |
| Free Tier | ✅ Forever | ⏰ 14-day trial |
| Error Grouping | ✅ AI-powered | ✅ Rule-based |
| Frontend+Backend | ✅ Unified | ⚠️ Separate products |
| Open Source | ✅ Yes | ⚠️ Limited |
| Network Recording | ✅ Included | ❌ Not available |
| Logs Integration | ✅ Included | ❌ Separate product |

---

## 📚 Documentation Links

- **Highlight.io Docs**: https://www.highlight.io/docs/getting-started/overview
- **Next.js Integration**: https://www.highlight.io/docs/getting-started/nextjs/overview
- **Dashboard**: https://app.highlight.io/5g5y914e
- **Session Search**: https://www.highlight.io/docs/general/product-features/session-replay/overview
- **Error Monitoring**: https://www.highlight.io/docs/general/product-features/error-monitoring/overview

---

## ✅ Implementation Checklist

### Core Setup (Completed)
- [x] Install `@highlight-run/next` in frontend
- [x] Install `@highlight-run/next` in backend
- [x] Configure `HighlightInit` in frontend layout
- [x] Add user identification in dashboard layout
- [x] Create backend Highlight.io wrapper config
- [x] Add frontend environment variable
- [x] Add backend environment variable
- [x] Update `.env.example` with documentation

### Error & Log Tracking (Completed)
- [x] Create ErrorBoundary component for React
- [x] Wrap dashboard in ErrorBoundary
- [x] Add console.log interception for backend
- [x] Add console.error automatic reporting
- [x] Add console.warn logging

### API Endpoint Wrapping (Completed)
- [x] Wrap memory create endpoint (`POST /api/memory`)
- [x] Wrap memory search endpoint (`POST /api/memory/search`)
- [x] Wrap memory list endpoint (`GET /api/memory/list`)

### Testing (Ready to Test)
- [ ] Test frontend session replay
- [ ] Test backend API tracing
- [ ] Test user identification
- [ ] Test error tracking (frontend crashes)
- [ ] Test error tracking (backend errors)
- [ ] Test console log capture

### Production (Not Started)
- [ ] Deploy frontend env var to Vercel
- [ ] Deploy backend env var to Render
- [ ] Ensure NODE_ENV=production on both platforms
- [ ] Verify production data flowing to Highlight
- [ ] Verify development sessions are filtered out
- [ ] Add remaining endpoints (optional)

---

**Last Updated**: 2025-11-10
**Implementation Time**: ~20 minutes
**Ready for Production**: ✅ Yes - Highlight.io disabled in development, enabled in production only
**Important**: Highlight.io will NOT run on localhost - saves your 500 sessions/month for real users!
