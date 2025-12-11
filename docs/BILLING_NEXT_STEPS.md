# PersistQ Billing - Next Steps Quick Reference

Last Updated: 2025-11-22

---

## 🎯 Priority Next Steps

### ✅ COMPLETED
- [x] Backend implementation (100% complete - 15 files)
- [x] Database schema migration (zero data loss)
- [x] Pricing page checkout integration
- [x] Environment variable configuration
- [x] Free tier (no credit card required)
- [x] Quota enforcement on API routes

### ⏳ TODO (In Priority Order)

#### 1. Dodo Dashboard Setup (20 minutes) ⚡ URGENT

**File to Update**: `backend/config/plans.ts`

**Actions**:
1. Go to https://dashboard.dodopayments.com
2. Create 6 products:
   - **Starter Monthly**: $5.00/month
   - **Starter Yearly**: $50.00/year
   - **Pro Monthly**: $12.00/month
   - **Pro Yearly**: $120.00/year
   - **Premium Monthly**: $29.00/month
   - **Premium Yearly**: $290.00/year

3. Copy each product ID (format: `pdt_...`)

4. Update `backend/config/plans.ts`:
   ```typescript
   // Line ~102 - Starter
   providers: {
     dodo: {
       monthly: "pdt_YOUR_ACTUAL_STARTER_MONTHLY_ID",
       yearly: "pdt_YOUR_ACTUAL_STARTER_YEARLY_ID",
     },
   },

   // Line ~126 - Pro
   providers: {
     dodo: {
       monthly: "pdt_YOUR_ACTUAL_PRO_MONTHLY_ID",
       yearly: "pdt_YOUR_ACTUAL_PRO_YEARLY_ID",
     },
   },

   // Line ~150 - Premium
   providers: {
     dodo: {
       monthly: "pdt_YOUR_ACTUAL_PREMIUM_MONTHLY_ID",
       yearly: "pdt_YOUR_ACTUAL_PREMIUM_YEARLY_ID",
     },
   },
   ```

5. Configure webhook:
   - Dodo Dashboard → Developer → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhooks/billing/dodo`
   - For local testing use ngrok: `ngrok http 3000`
   - Select events: `subscription.created`, `subscription.updated`, `subscription.canceled`, `subscription.paused`, `payment.succeeded`, `payment.failed`
   - Copy webhook secret

6. Update `.env.local`:
   ```bash
   DODO_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
   ```

7. Restart backend server

**Verification**: Send test webhook from Dodo dashboard, check backend logs for successful verification

---

#### 2. Build Billing Dashboard (2-3 hours)

**File**: `frontend/app/dashboard/billing/page.tsx` (currently empty stub)

**Required Components**:

```typescript
"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function BillingPage() {
  const { isSignedIn } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/billing/subscription")
        .then(res => res.json())
        .then(setData)
        .finally(() => setLoading(false))
    }
  }, [isSignedIn])

  if (loading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-6">
      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle>{data?.plan?.name} Plan</CardTitle>
          <CardDescription>
            {data?.subscription?.status === "active"
              ? `Renews on ${new Date(data.subscription.currentPeriodEnd).toLocaleDateString()}`
              : "Free plan - upgrade anytime"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pricing display */}
          {/* Manage billing button */}
        </CardContent>
      </Card>

      {/* Usage Metrics Card */}
      <Card>
        <CardHeader>
          <CardTitle>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {/* API Calls Progress */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>API Calls</span>
              <span>{data?.usage?.apiCalls?.used} / {data?.usage?.apiCalls?.limit}</span>
            </div>
            <Progress value={data?.usage?.apiCalls?.percentage} />
          </div>

          {/* Memories Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <span>Memories</span>
              <span>{data?.usage?.memories?.used} / {data?.usage?.memories?.limit}</span>
            </div>
            <Progress value={data?.usage?.memories?.percentage} />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        {data?.subscription?.subscriptionId && (
          <Button onClick={() => window.location.href = "/api/billing/portal"}>
            Manage Billing
          </Button>
        )}

        {data?.plan?.id === "free" && (
          <Button onClick={() => window.location.href = "/pricing"}>
            Upgrade Plan
          </Button>
        )}

        {data?.subscription?.status === "active" && (
          <Button
            variant="destructive"
            onClick={() => handleCancelSubscription()}
          >
            Cancel Subscription
          </Button>
        )}
      </div>
    </div>
  )
}
```

**Additional Features**:
- Warning message when usage > 80%
- Past due payment notification if `subscriptionStatus === "past_due"`
- Upgrade/downgrade plan selector
- Invoice history (link to Dodo portal)

---

#### 3. Test End-to-End Flow (30 minutes)

**Checklist**:

1. **Test Free Signup**:
   - [ ] Go to `/pricing`
   - [ ] Click "Get started" on Free plan
   - [ ] Redirects to `/signup` (not checkout)
   - [ ] Create account
   - [ ] Check database: user has `planId = "free"`
   - [ ] No payment info required ✅

2. **Test Paid Checkout**:
   - [ ] Login as free user
   - [ ] Go to `/pricing`
   - [ ] Click "Get started" on Starter Monthly
   - [ ] Redirects to Dodo checkout page
   - [ ] Complete test payment (use Dodo test card)
   - [ ] Redirects back to `/dashboard/billing?success=true`
   - [ ] Check database: user has `planId = "starter"`, `subscriptionId` populated
   - [ ] Check backend logs: webhook received and processed

3. **Test Quota Enforcement**:
   - [ ] Create memories via API until free limit (250)
   - [ ] Next create should return 429 error
   - [ ] Upgrade to Starter plan
   - [ ] Can now create up to 2,500 memories

4. **Test Customer Portal**:
   - [ ] Go to `/dashboard/billing`
   - [ ] Click "Manage Billing"
   - [ ] Redirects to Dodo portal
   - [ ] Update payment method
   - [ ] View invoice history

5. **Test Cancellation**:
   - [ ] Click "Cancel Subscription"
   - [ ] Confirm cancellation
   - [ ] Check database: `cancelAtPeriodEnd = true`
   - [ ] User keeps access until `currentPeriodEnd`
   - [ ] After period ends, downgrade to free via webhook

---

## 📊 Current Status Summary

| Component | Status | Completion |
|-----------|--------|------------|
| **Backend** | ✅ Complete | 100% |
| Provider-agnostic architecture | ✅ | Done |
| API endpoints | ✅ | Done |
| Quota enforcement | ✅ | Done |
| Database schema | ✅ | Migrated |
| Webhook handler | ✅ | Done |
| **Frontend** | ⏳ In Progress | 40% |
| Pricing page | ✅ | Done |
| Billing dashboard | ❌ | Empty stub |
| Usage metrics | ❌ | Not started |
| **Configuration** | ⏳ Partial | 50% |
| Environment vars | ✅ | Documented |
| Dodo API key | ✅ | Configured |
| Product IDs | ❌ | Placeholders |
| Webhook secret | ❌ | Not set |

---

## 🔑 Key Files Reference

**Must Update**:
- `backend/config/plans.ts` - Replace product ID placeholders
- `backend/.env.local` - Add `DODO_WEBHOOK_SECRET`
- `frontend/app/dashboard/billing/page.tsx` - Build UI

**Already Complete**:
- `backend/lib/billing/` - All provider logic
- `backend/app/api/billing/` - All endpoints
- `frontend/app/pricing/page.tsx` - Checkout integrated
- `backend/prisma/schema.prisma` - Billing fields added

---

## 📚 Documentation

- `DODO_SETUP_GUIDE.md` - Step-by-step Dodo configuration
- `BILLING_IMPLEMENTATION_SUMMARY.md` - Complete technical reference
- `BILLING_NEXT_STEPS.md` - This file (quick reference)

---

## ⚠️ Important Notes

1. **Free Tier Confirmed**: No credit card required for free accounts ✅
2. **Provider Switching**: Change `BILLING_PROVIDER=stripe` to switch providers (just add Stripe class)
3. **Zero Data Loss**: All 6 existing users migrated successfully to `planId="free"`
4. **Test Mode**: Always use `DODO_MODE=test` until production launch
5. **Local Testing**: Use ngrok to expose localhost for webhook testing

---

## 🚀 Quick Start (After Dodo Setup)

```bash
# 1. Start backend
cd backend
npm run dev

# 2. In another terminal, start frontend
cd frontend
npm run dev

# 3. Test checkout flow
# Visit http://localhost:3000/pricing
# Click "Get started" on Starter plan
# Complete test checkout
# Verify webhook delivery in backend logs
```

---

**Estimated Time to Production**: 3-4 hours remaining
- Dodo setup: 20 min
- Billing dashboard: 2-3 hours
- Testing: 30 min
