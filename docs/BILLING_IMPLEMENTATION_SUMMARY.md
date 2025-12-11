# PersistQ - Dodo Payments Integration Summary

## Implementation Status: Backend Complete ✅

**Date**: 2025-11-22
**Architecture**: Provider-agnostic billing system with full abstraction layer
**Primary Provider**: Dodo Payments
**Completion**: Backend 100%, Frontend 0%, Testing 0%

---

## ✅ Completed Backend Components (15 files)

### 1. Core Abstractions & Types

| File | Purpose | Status |
|------|---------|--------|
| `backend/lib/billing/types.ts` | IBillingProvider interface, normalized event types | ✅ Complete |
| `backend/config/plans.ts` | Centralized plan config with provider mappings | ✅ Complete |
| `backend/lib/billing/factory.ts` | Provider factory for easy switching | ✅ Complete |

**Key Achievement**: Switching providers = changing 1 env var + adding 1 provider class

---

### 2. Dodo Payments Provider

| File | Purpose | Status |
|------|---------|--------|
| `backend/lib/billing/providers/dodo.ts` | Complete Dodo implementation (500+ lines) | ✅ Complete |

**Implements**:
- ✅ Checkout session creation
- ✅ Customer portal sessions
- ✅ Subscription CRUD (get, update, cancel)
- ✅ Webhook signature verification (Standard Webhooks)
- ✅ Event normalization (Dodo → BillingEvent)

---

### 3. Business Logic (Provider-Agnostic)

| File | Purpose | Status |
|------|---------|--------|
| `backend/lib/billing/events.ts` | Event handlers for all subscription/payment events | ✅ Complete |
| `backend/lib/billing/quotas.ts` | Usage tracking & quota enforcement | ✅ Complete |

**Event Handlers**:
- ✅ `handleSubscriptionCreated` - Upgrades user plan
- ✅ `handleSubscriptionUpdated` - Syncs plan changes
- ✅ `handleSubscriptionCanceled` - Downgrades to free
- ✅ `handlePaymentFailed` - Marks past_due
- ✅ `handleBillingEvent` - Main router

**Quota System**:
- ✅ `checkQuota` - Validates API call/memory limits
- ✅ `trackApiCall` - Increments usage counter
- ✅ `enforceQuota` - Middleware-friendly checker (returns 429 on exceed)

---

### 4. API Endpoints

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/billing/checkout` | POST | Create checkout session | ✅ Complete |
| `/api/billing/portal` | GET | Redirect to customer portal | ✅ Complete |
| `/api/billing/subscription` | GET | Fetch subscription + usage | ✅ Complete |
| `/api/billing/subscription` | POST | Update subscription (upgrade/downgrade) | ✅ Complete |
| `/api/billing/subscription` | DELETE | Cancel subscription | ✅ Complete |
| `/api/webhooks/billing/dodo` | POST | Receive Dodo webhook events | ✅ Complete |

**All endpoints are provider-agnostic via factory pattern**

---

### 5. Quota Enforcement Integration

| File | Change | Status |
|------|--------|--------|
| `backend/app/api/memory/route.ts` | Added API call + memory quota checks | ✅ Complete |
| `backend/app/api/memory/search/route.ts` | Added API call quota check | ✅ Complete |

**Behavior**: Returns `429 Too Many Requests` with usage stats when quota exceeded

---

### 6. Database Schema

| Model | Purpose | Status |
|-------|---------|--------|
| `User` (extended) | Added 8 billing fields (provider, customerId, subscriptionId, planId, etc.) | ✅ Schema updated |
| `UsageRecord` (new) | Tracks API calls per month (userId + period unique constraint) | ✅ Schema updated |

**Migration Status**: ⚠️ **NOT YET APPLIED** (database drift detected - see section below)

---

### 7. Configuration Files

| File | Purpose | Status |
|------|---------|--------|
| `backend/lib/env.ts` | Added billing env var validation | ✅ Complete |
| `backend/.env.example` | Documented all billing variables + setup guide | ✅ Complete |
| `backend/package.json` | Installed @dodopayments/nextjs + standardwebhooks | ✅ Complete |

---

## ⚠️ Database Migration Required

**Issue**: Prisma detected schema drift (existing `clerk_user_id` column not in migration history)

**Resolution Options**:

### Option 1: Reset Development Database (Recommended for Dev)
```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev --name add_billing_and_usage_tracking
```
**⚠️ WARNING**: This will **delete all data** in your database

### Option 2: Resolve Drift Manually
```bash
cd backend
npx prisma db pull  # Introspect current DB state
npx prisma migrate dev --name add_billing_and_usage_tracking
```

### Option 3: Skip Migrations (Quick Test)
```bash
cd backend
npx prisma db push  # Push schema without creating migration
```
**⚠️ Not recommended for production**

---

## 📋 Remaining Tasks (5 tasks)

### 1. ⏳ Update Dodo Product IDs in Plan Config

**File**: `backend/config/plans.ts`

**Current** (lines 102-146):
```typescript
providers: {
  dodo: {
    monthly: "pdt_starter_monthly",  // ❌ Placeholder
    yearly: "pdt_starter_yearly",    // ❌ Placeholder
  },
}
```

**Action Required**:
1. Log into https://dashboard.dodopayments.com
2. Navigate to Products
3. Create 6 products:
   - Starter Monthly ($5/month)
   - Starter Yearly ($50/year)
   - Pro Monthly ($12/month)
   - Pro Yearly ($120/year)
   - Premium Monthly ($29/month)
   - Premium Yearly ($290/year)
4. Copy product IDs (format: `pdt_...`)
5. Replace placeholders in `backend/config/plans.ts`

---

### 2. ⏳ Configure Dodo Webhook

**Webhook URL**: `https://your-domain.com/api/webhooks/billing/dodo`

**Steps**:
1. Go to https://dashboard.dodopayments.com → Developer → Webhooks
2. Click "Add Endpoint"
3. Enter webhook URL
4. Select events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.paused`
   - `payment.succeeded`
   - `payment.failed`
5. Save and copy webhook secret
6. Add secret to `.env.local`:
   ```
   DODO_WEBHOOK_SECRET="whsec_..."
   ```

---

### 3. ⏳ Frontend - Update Pricing Page

**File**: `frontend/app/pricing/page.tsx` (line ~85)

**Current**:
```tsx
<Link href="/signup">
  <Button>Get started</Button>
</Link>
```

**Replace with**:
```tsx
<Button onClick={() => handleCheckout('starter', 'monthly')}>
  Get started
</Button>
```

**Add handler function**:
```typescript
const handleCheckout = async (planId: string, interval: 'monthly' | 'yearly') => {
  try {
    const response = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId, interval }),
    });

    const { url } = await response.json();
    window.location.href = url; // Redirect to Dodo checkout
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to start checkout. Please try again.');
  }
};
```

**Update for all 3 paid plans** (Starter, Pro, Premium) with monthly/yearly intervals

---

### 4. ⏳ Frontend - Build Billing Dashboard

**File**: `frontend/app/dashboard/billing/page.tsx` (currently empty stub)

**Required UI Components**:

```typescript
// Fetch data
const { subscription, plan, usage } = await fetch('/api/billing/subscription').then(r => r.json());

// Display:
1. Current Plan Card
   - Plan name (Free, Starter, Pro, Premium)
   - Billing interval (monthly/yearly)
   - Status (active, past_due, canceled)
   - Renewal date (currentPeriodEnd)
   - "Cancel at period end" warning if applicable

2. Usage Metrics Card
   - API Calls: X / Y (percentage bar)
   - Memories: X / Y (percentage bar)
   - Warning at 80%+ usage

3. Action Buttons
   - "Manage Billing" → /api/billing/portal (only if has subscription)
   - "Upgrade Plan" → Show plan options + checkout
   - "Cancel Subscription" → DELETE /api/billing/subscription

4. Invoices Section (future)
   - Link to Dodo portal for invoice history
```

---

### 5. ⏳ Testing Checklist

#### Database Setup
- [ ] Run Prisma migration (resolve drift first)
- [ ] Verify `users` table has billing columns
- [ ] Verify `usage_records` table exists
- [ ] Check existing users have `planId = "free"`

#### Dodo Dashboard Configuration
- [ ] Create 6 products (Starter/Pro/Premium × Monthly/Yearly)
- [ ] Copy product IDs to `backend/config/plans.ts`
- [ ] Configure webhook endpoint
- [ ] Copy webhook secret to `.env.local`
- [ ] Set `DODO_MODE=test`

#### Test Checkout Flow (Test Mode)
- [ ] Click "Get started" on Starter plan
- [ ] Redirects to Dodo checkout page
- [ ] Complete test checkout (use test card)
- [ ] Verify redirect back to `/dashboard/billing?success=true`
- [ ] Check user upgraded in database (`planId = "starter"`)
- [ ] Check `billingCustomerId` and `subscriptionId` populated

#### Test Webhook Delivery
- [ ] Trigger test webhook from Dodo dashboard
- [ ] Check backend logs for `[Webhook] Received subscription.created`
- [ ] Verify signature verification passes
- [ ] Verify user data updates in database

#### Test Quota Enforcement
- [ ] Create memory via API (should track usage)
- [ ] Check `usage_records` table increments
- [ ] Manually set usage to plan limit in DB
- [ ] Try creating memory (should get 429 error)
- [ ] Upgrade plan
- [ ] Retry (should succeed with new limit)

#### Test Subscription Management
- [ ] Click "Manage Billing" → Opens Dodo portal
- [ ] Update payment method in portal
- [ ] Cancel subscription (end of period)
- [ ] Verify `cancelAtPeriodEnd = true` in DB
- [ ] Wait for period end (or trigger webhook)
- [ ] Verify downgrade to free plan

---

## 🏗️ Architecture Highlights

### Provider Switching (3 Steps)

**To switch from Dodo to Stripe**:

1. **Add Stripe provider class** (`backend/lib/billing/providers/stripe.ts`):
   ```typescript
   export class StripeProvider implements IBillingProvider {
     // Implement same methods as DodoProvider
   }
   ```

2. **Update factory** (`backend/lib/billing/factory.ts`):
   ```typescript
   case "stripe":
     return new StripeProvider({ ... });
   ```

3. **Change env var**:
   ```
   BILLING_PROVIDER=stripe
   ```

**No changes needed to**:
- ✅ Event handlers
- ✅ API endpoints
- ✅ Frontend code
- ✅ Quota enforcement
- ✅ Database schema

---

## 📊 File Structure Summary

```
backend/
├── lib/billing/
│   ├── types.ts                    # IBillingProvider interface
│   ├── factory.ts                  # Provider factory
│   ├── events.ts                   # Business logic handlers
│   ├── quotas.ts                   # Usage tracking
│   └── providers/
│       └── dodo.ts                 # Dodo implementation
├── config/
│   └── plans.ts                    # Plan definitions + provider mapping
├── app/api/
│   ├── billing/
│   │   ├── checkout/route.ts       # Create checkout
│   │   ├── portal/route.ts         # Customer portal
│   │   └── subscription/route.ts   # Subscription CRUD
│   ├── webhooks/billing/
│   │   └── dodo/route.ts           # Dodo webhook handler
│   └── memory/
│       ├── route.ts                # ✅ Quota-enforced
│       └── search/route.ts         # ✅ Quota-enforced
├── prisma/
│   └── schema.prisma               # ✅ User + UsageRecord models
└── .env.example                    # ✅ Billing config documented
```

---

## 🔐 Environment Variables Reference

```bash
# Required for billing
BILLING_PROVIDER=dodo
DODO_API_KEY=sWykwCaIvJeXGQC2.LPJ84lmQHpHIsmWYN01ijQNpB1jZ6derC6yDmA9m4nsUaje_
DODO_WEBHOOK_SECRET=whsec_...  # Get from Dodo dashboard
DODO_MODE=test                 # or "live" for production
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
NODE_ENV=development
```

---

## 🚀 Next Steps (Priority Order)

1. **Resolve database drift and run migration** (5 min)
2. **Update Dodo product IDs in plans.ts** (10 min)
3. **Configure webhook in Dodo dashboard** (5 min)
4. **Test checkout flow end-to-end** (15 min)
5. **Build frontend billing dashboard** (2-3 hours)
6. **Update pricing page with checkout buttons** (30 min)
7. **Test quota enforcement** (15 min)
8. **Production deployment** (see below)

---

## 📦 Production Deployment Checklist

### Pre-Deployment
- [ ] Create live Dodo products (match test product pricing)
- [ ] Update `DODO_MODE=live`
- [ ] Update `DODO_API_KEY` to live key
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Configure live webhook endpoint
- [ ] Update `DODO_WEBHOOK_SECRET` to live secret
- [ ] Run migration on production database
- [ ] Backfill existing users to `planId = "free"`

### Post-Deployment
- [ ] Monitor webhook delivery in Dodo dashboard
- [ ] Test one successful checkout
- [ ] Monitor Highlight.io for errors
- [ ] Set up alerting for `payment.failed` events
- [ ] Document support process for billing issues

---

## 💡 Key Design Decisions

1. **Provider-Agnostic Architecture**: Entire system can switch providers by changing 1 env var
2. **Generic Database Fields**: `billingCustomerId` instead of `dodoCustomerId` for multi-provider support
3. **Fail-Open Quotas**: On quota check errors, allow requests (prevent service disruption)
4. **Centralized Plan Config**: Single source of truth for plans, limits, features, pricing
5. **Normalized Events**: Provider events converted to standard `BillingEvent` type
6. **Idempotent Webhooks**: Always return 200 to prevent retries, log errors separately

---

## 📞 Support & Resources

**Dodo Payments Docs**: https://docs.dodopayments.com
**Standard Webhooks Spec**: https://standardwebhooks.com
**Implementation Questions**: Check `backend/lib/billing/` source files (heavily commented)

---

**Implementation Time**: ~6 hours backend, ~3 hours remaining frontend/testing
**Maintainability**: High (provider abstraction, comprehensive comments)
**Provider Switching Cost**: ~30 minutes (add provider class, update factory)
