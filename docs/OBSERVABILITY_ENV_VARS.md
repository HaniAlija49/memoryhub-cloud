# Observability Environment Variables

This document explains the environment variables used to control the PersistQ observability system.

## Overview

The observability system (Sentry + analytics events) is **disabled by default** and must be explicitly enabled via environment variables. This ensures:

- No tracking in development environments
- No accidental data collection in staging/testing
- Full control over when observability is active
- Compliance with privacy-by-default principles

## Environment Variables

### Backend Environment Variables

Add to your backend environment (`.env`, Vercel environment variables, etc.):

```bash
# Enable observability (Sentry + analytics events)
# Required: Must be 'true' to enable any observability features
OBSERVABILITY_ENABLED=true

# Sentry DSN (required if observability is enabled)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Frontend Environment Variables

Add to your frontend environment (`.env.local`, Vercel environment variables, etc.):

```bash
# Enable observability (Sentry + analytics events)
# Required: Must be 'true' to enable any observability features
NEXT_PUBLIC_OBSERVABILITY_ENABLED=true

# Sentry DSN (required if observability is enabled)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## Configuration Matrix

| Environment | `OBSERVABILITY_ENABLED` | Sentry | Analytics Events | Recommended |
|------------|-------------------------|---------|------------------|--------------|
| Development | `false` (default) | ❌ Disabled | ❌ Disabled | ✅ Keep disabled |
| Staging | `false` (default) | ❌ Disabled | ❌ Disabled | ✅ Keep disabled |
| Production | `true` | ✅ Enabled | ✅ Enabled | ✅ Required |

## How It Works

### Sentry Integration
- Sentry only initializes when `OBSERVABILITY_ENABLED=true` AND `NODE_ENV=production`
- All Sentry breadcrumbs and user context are conditional on this flag
- No Sentry SDK overhead when disabled

### Analytics Events
- `trackEvent()` function returns early if observability is disabled
- No network requests to `/api/internal/events` when disabled
- No performance impact on application when disabled

### User Context
- Sentry user context only set when observability is enabled
- Clerk user data never sent to Sentry when disabled
- Privacy preserved in non-production environments

## Setup Instructions

### 1. Production Setup

**Backend Environment Variables:**
```bash
OBSERVABILITY_ENABLED=true
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

**Frontend Environment Variables:**
```bash
NEXT_PUBLIC_OBSERVABILITY_ENABLED=true
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### 2. Development Setup

**Keep observability disabled** (no action needed):
```bash
# These can be omitted or set to 'false'
OBSERVABILITY_ENABLED=false
NEXT_PUBLIC_OBSERVABILITY_ENABLED=false
```

### 3. Testing Observability

To temporarily enable observability in development for testing:

```bash
# Backend .env
OBSERVABILITY_ENABLED=true
SENTRY_DSN=your-test-dsn

# Frontend .env.local
NEXT_PUBLIC_OBSERVABILITY_ENABLED=true
NEXT_PUBLIC_SENTRY_DSN=your-test-dsn
```

## Security & Privacy

### Default Safe Configuration
- **Disabled by default**: No accidental data collection
- **Production-only**: Sentry only works in `NODE_ENV=production`
- **Explicit opt-in**: Requires explicit `true` value

### Data Protection
- When disabled, no user data is sent to Sentry
- No analytics events are stored in database
- No performance overhead from tracking

### Compliance
- **GDPR compliant**: Disabled by default, explicit consent required
- **Privacy-first**: No tracking without explicit enablement
- **Data minimization**: Only essential events tracked when enabled

## Troubleshooting

### Observability Not Working

1. **Check environment variables:**
   ```bash
   # Backend
   echo $OBSERVABILITY_ENABLED
   
   # Frontend (in browser console)
   console.log(process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED)
   ```

2. **Verify production environment:**
   ```bash
   echo $NODE_ENV  # Should be 'production'
   ```

3. **Check Sentry DSN:**
   ```bash
   echo $SENTRY_DSN  # Backend
   echo $NEXT_PUBLIC_SENTRY_DSN  # Frontend
   ```

### Events Not Appearing

1. **Verify observability is enabled:**
   - Check both backend and frontend environment variables
   - Ensure both are set to `true`

2. **Check database connection:**
   - Events API should be accessible at `/api/internal/events`
   - Verify `usage_events` table exists

3. **Check Sentry configuration:**
   - Verify DSN is correct and active
   - Check Sentry dashboard for incoming errors

## Migration from Development to Production

When deploying to production:

1. **Set production environment variables:**
   ```bash
   OBSERVABILITY_ENABLED=true
   NEXT_PUBLIC_OBSERVABILITY_ENABLED=true
   ```

2. **Verify Sentry DSNs are set:**
   ```bash
   SENTRY_DSN=your-production-dsn
   NEXT_PUBLIC_SENTRY_DSN=your-production-dsn
   ```

3. **Test in production:**
   - Trigger a test error to verify Sentry works
   - Perform a user action to verify analytics work
   - Check `usage_events` table for new entries

## Best Practices

### Development
- Keep observability **disabled** during normal development
- Only enable temporarily when testing specific observability features
- Use test Sentry projects when enabling in development

### Staging
- Keep observability **disabled** to avoid mixing staging data with production
- Enable only when specifically testing observability functionality
- Use separate Sentry projects for staging if needed

### Production
- Always enable observability with `OBSERVABILITY_ENABLED=true`
- Monitor Sentry for errors and performance issues
- Regularly query analytics for user insights

### Security
- Never commit Sentry DSNs to version control
- Use environment-specific Sentry projects
- Regularly rotate Sentry DSNs if needed
- Monitor Sentry for any unusual activity