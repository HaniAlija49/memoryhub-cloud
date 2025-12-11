# MemoryHub Billing System - Senior Architect Security Audit
**Date:** December 5, 2025
**Auditor:** Senior Software Architect Review
**System:** MemoryHub Cloud Billing & Subscription Management
**Provider:** Dodo Payments Integration

---

## Executive Summary

This audit reviews the billing system architecture, security, and error handling with a focus on production readiness and financial transaction safety. The system handles real money transactions and subscription management, requiring zero-tolerance for critical bugs.

**Overall Assessment:** ⚠️ **NEEDS ATTENTION - Critical Issues Found**

- **Critical Issues:** 4
- **High Priority:** 6
- **Medium Priority:** 5
- **Low Priority:** 3

---

## 🚨 CRITICAL ISSUES (Must Fix Before Production)

### 1. **Race Condition in Subscription Updates**
**Location:** `backend/app/api/billing/subscription/route.ts:231-240`

**Issue:** The subscription update endpoint updates the database immediately after calling the provider API, then webhooks also update the same data. This creates a race condition where:
1. User calls POST /api/billing/subscription
2. Database updated with new plan
3. Webhook arrives and updates database again
4. **PROBLEM:** If webhook arrives first with stale data, it can overwrite the correct data

**Code:**
```typescript
// Line 231: Immediate database update after API call
const updatedUser = await prisma.user.update({
  where: { id: user.id },
  data: {
    planId: updatedSubscription.planId,  // Race condition!
    billingInterval: updatedSubscription.interval,
    // ...
  },
});
```

**Impact:** Users might see incorrect plan after update. Financial discrepancy risk.

**Fix Required:**
```typescript
// Option 1: Only update via webhooks (recommended)
// Remove immediate database update, wait for webhook
// Add loading state in UI

// Option 2: Add version/timestamp field
data: {
  planId: updatedSubscription.planId,
  lastSyncedAt: new Date(),
  // Webhook should only update if lastSyncedAt is older
}
```

---

### 2. **Webhook Idempotency Vulnerability**
**Location:** `backend/app/api/webhooks/billing/dodo/route.ts:22-32`

**Issue:** Webhook idempotency uses in-memory Map that:
1. Resets on server restart
2. Not shared across multiple server instances
3. Cleanup runs via setInterval (unreliable in serverless)

**Code:**
```typescript
// Line 22: In-memory storage (lost on restart!)
const processedWebhooks = new Map<string, number>();

// Line 25: setInterval won't work reliably in serverless
setInterval(() => {
  // Cleanup code
}, 60 * 60 * 1000);
```

**Impact:**
- Duplicate webhook processing after deployment
- Multiple charges or plan changes
- Data corruption from duplicate events

**Fix Required:**
```typescript
// Use database-backed idempotency
await prisma.webhookEvent.upsert({
  where: { webhookId },
  update: { processedAt: new Date() },
  create: {
    webhookId,
    eventType: billingEvent.type,
    processedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
});

// Add schema:
model WebhookEvent {
  id String @id @default(cuid())
  webhookId String @unique
  eventType String
  processedAt DateTime
  expiresAt DateTime
  @@index([expiresAt])
}

// Clean up via cron job, not setInterval
```

---

### 3. **Missing Transaction Atomicity**
**Location:** Multiple files - all database operations

**Issue:** Database updates are not wrapped in transactions. If an update fails halfway, you get partial state:

Example from `backend/lib/billing/events.ts:69-81`:
```typescript
// Line 69: No transaction!
await prisma.user.update({
  where: { id: user.id },
  data: {
    billingProvider: event.provider,
    billingCustomerId: event.customerId,
    subscriptionId: data.id,
    planId: data.planId,
    // ... 8 fields total
  },
});
```

**Impact:**
- Partial subscription state if server crashes mid-update
- Inconsistent billing data
- User might get charged but not upgraded

**Fix Required:**
```typescript
await prisma.$transaction(async (tx) => {
  await tx.user.update({
    where: { id: user.id },
    data: { /* ... */ }
  });

  // Log the event for audit trail
  await tx.billingAuditLog.create({
    data: {
      userId: user.id,
      eventType: event.type,
      eventData: event.rawEvent,
      timestamp: new Date(),
    }
  });
});
```

---

### 4. **API Key Exposure in Logs**
**Location:** `backend/lib/billing/providers/dodo.ts:400-402`

**Issue:** Logging includes sensitive webhook secrets:

```typescript
// Line 400-402: SECURITY ISSUE!
console.log("[Dodo]   - Headers:", JSON.stringify(headers));
console.log("[Dodo]   - Secret length:", secret.length);
console.log("[Dodo]   - Secret prefix:", secret.substring(0, 10) + "...");
```

**Impact:**
- Secret keys in production logs
- Compliance violation (PCI-DSS, SOC2)
- Security breach if logs are compromised

**Fix Required:**
```typescript
// Remove secret logging entirely
console.log("[Dodo]   - Headers:", JSON.stringify({
  'webhook-id': headers['webhook-id'],
  'webhook-timestamp': headers['webhook-timestamp'],
  // DON'T log signature
}));
// Remove secret logging completely
```

---

## ⚠️ HIGH PRIORITY ISSUES

### 5. **Missing API Rate Limiting on Billing Endpoints**
**Location:** All `/api/billing/*` endpoints

**Issue:** No rate limiting on billing API endpoints. Attacker can:
- Spam checkout endpoint → create thousands of Dodo sessions
- DOS attack on subscription update
- Exhaust Dodo API quota

**Fix:** Add rate limiting per user:
```typescript
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
});

const { success } = await ratelimit.limit(`billing:${user.id}`);
if (!success) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

---

### 6. **Insufficient Input Validation**
**Location:** `backend/app/api/billing/subscription/route.ts:168-188`

**Issue:** Input validation is too basic:
```typescript
// Line 172-176: Weak validation
if (!planId || !interval) {
  return NextResponse.json(
    { error: "Missing required fields: planId, interval" },
    { status: 400 }
  );
}
```

**Problems:**
- No type validation (planId could be `null`, `[]`, `{}`)
- No sanitization
- No length limits
- No SQL injection prevention

**Fix:** Use Zod for strict validation:
```typescript
import { z } from "zod";

const UpdateSubscriptionSchema = z.object({
  planId: z.enum(["free", "starter", "pro", "premium"]),
  interval: z.enum(["monthly", "yearly"]),
});

try {
  const body = UpdateSubscriptionSchema.parse(await request.json());
} catch (error) {
  return NextResponse.json({ error: "Invalid input" }, { status: 400 });
}
```

---

### 7. **Reactivation Endpoint Has Inconsistent State Updates**
**Location:** `backend/app/api/billing/subscription/reactivate/route.ts:71-90`

**Issue:** Updates database first, then calls provider API. If API fails, database is wrong:

```typescript
// Line 71-76: Database updated BEFORE API call!
await prisma.user.update({
  where: { id: user.id },
  data: {
    cancelAtPeriodEnd: false,
    subscriptionStatus: "active",
  },
});

// Line 80-89: THEN tries API call (might fail!)
try {
  await provider.reactivateSubscription(user.subscriptionId);
} catch (error) {
  console.warn("[Billing] Failed to reactivate via provider API:", error);
  // Continue anyway - DATABASE IS NOW WRONG!
}
```

**Impact:** Database says "active" but provider still has it cancelled.

**Fix:**
```typescript
// Call provider FIRST
await provider.reactivateSubscription(user.subscriptionId);

// THEN update database (or let webhook handle it)
await prisma.user.update({
  where: { id: user.id },
  data: {
    cancelAtPeriodEnd: false,
    subscriptionStatus: "active",
  },
});
```

---

### 8. **No Audit Trail for Financial Transactions**
**Location:** All billing operations

**Issue:** No audit log for:
- Plan changes
- Payments
- Cancellations
- Refunds

**Impact:**
- Can't prove what happened if user disputes charge
- No compliance trail for audits
- Can't debug billing issues

**Fix:** Add audit log model:
```prisma
model BillingAuditLog {
  id String @id @default(cuid())
  userId String
  eventType String
  eventData Json
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([eventType])
  @@index([createdAt])
}
```

---

### 9. **Error Messages Leak Internal Information**
**Location:** Multiple endpoints

**Issue:** Error messages expose internal structure:
```typescript
// Line 258: Leaks internal error details
return NextResponse.json(
  {
    status: "error",
    error: error instanceof Error
      ? error.message  // ⚠️ Might contain sensitive info!
      : "Failed to update subscription",
  },
  { status: 500 }
);
```

**Fix:**
```typescript
// Log detailed error internally
console.error("[Billing] Detailed error:", error);

// Return generic message to user
return NextResponse.json(
  {
    status: "error",
    error: "Unable to process request. Please try again.",
    errorId: generateErrorId(), // For support lookup
  },
  { status: 500 }
);
```

---

### 10. **Plan Metadata Not Validated Against Provider**
**Location:** `backend/config/plans.ts:55-192`

**Issue:** No validation that Dodo product IDs are correct. If typo in config:
- Checkout creates session for wrong product
- User charged wrong amount
- No validation until customer complains

**Fix:** Add validation script:
```typescript
// scripts/validate-plan-config.ts
async function validatePlanConfig() {
  const dodoClient = new DodoAPIClient(env.DODO_API_KEY, env.DODO_MODE);

  for (const [planId, plan] of Object.entries(PLANS)) {
    if (plan.providers.dodo?.monthly) {
      const product = await dodoClient.getProduct(plan.providers.dodo.monthly);
      if (product.amount !== plan.pricing.monthly) {
        throw new Error(`Plan ${planId} monthly price mismatch!`);
      }
    }
  }
}
```

---

## ⚠️ MEDIUM PRIORITY ISSUES

### 11. **Concurrent Subscription Modifications**
**Location:** All subscription update operations

**Issue:** If user clicks "Upgrade" twice quickly, two API calls might race:
- Both read current plan as "starter"
- Both try to upgrade to "pro"
- Both succeed, user charged twice

**Fix:** Add optimistic locking:
```prisma
model User {
  // ... existing fields
  version Int @default(0)
}
```

```typescript
await prisma.user.update({
  where: {
    id: user.id,
    version: user.version, // Will fail if version changed
  },
  data: {
    planId: newPlan,
    version: { increment: 1 },
  },
});
```

---

### 12. **Missing Webhook Signature Timeout Validation**
**Location:** `backend/app/api/webhooks/billing/dodo/route.ts:34-140`

**Issue:** No timestamp validation. Attacker could replay old webhook:
- Capture old webhook event
- Replay it hours later
- Signature still valid (never expires)

**Fix:**
```typescript
const timestamp = parseInt(webhookTimestamp);
const now = Math.floor(Date.now() / 1000);

// Reject webhooks older than 5 minutes
if (Math.abs(now - timestamp) > 300) {
  return NextResponse.json(
    { error: "Webhook timestamp too old" },
    { status: 401 }
  );
}
```

---

### 13. **Fallback to "free" Plan is Dangerous**
**Location:** `backend/lib/billing/providers/dodo.ts:307, 636`

**Issue:** When product ID not found, fallbacks to "free":
```typescript
// Line 307, 636: Dangerous fallback!
planId: planInfo?.planId || "free",
```

**Impact:** If Dodo returns unexpected product ID:
- Paid customer gets downgraded to free
- Loses access to paid features
- No alert to admins

**Fix:**
```typescript
if (!planInfo) {
  console.error("[CRITICAL] Unknown product ID:", sub.product_id);
  // Send alert to monitoring
  await sendAlert({
    severity: "critical",
    message: `Unknown product ID: ${sub.product_id}`,
  });
  throw new Error(`Unknown product ID: ${sub.product_id}`);
}
```

---

### 14. **No Cleanup for Expired Subscriptions**
**Location:** `backend/app/api/cron/expire-subscriptions/route.ts`

**Issue:** Relies on cron job but no monitoring if it fails. Users might keep access after subscription ends.

**Fix:** Add monitoring and alerting:
```typescript
// Run check on every API call (cached)
if (user.currentPeriodEnd && user.currentPeriodEnd < new Date()) {
  // Subscription expired but still active
  if (user.planId !== "free") {
    console.error("[CRITICAL] Expired subscription not downgraded:", user.id);
    // Immediately downgrade
    await downgradeTofree(user.id);
  }
}
```

---

### 15. **Metadata in Webhook Events Not Type-Safe**
**Location:** `backend/lib/billing/events.ts:38-44`

**Issue:** Metadata accessed with multiple possible field names:
```typescript
const metadata = event.rawEvent?.data?.metadata || event.rawEvent?.metadata;
const userId = metadata.userId || metadata.user_id;
```

**Impact:** If Dodo changes metadata structure, subscriptions break silently.

**Fix:** Validate metadata structure:
```typescript
const MetadataSchema = z.object({
  userId: z.string(),
  clerkUserId: z.string(),
  planId: z.string(),
  interval: z.enum(["monthly", "yearly"]),
});

const metadata = MetadataSchema.parse(event.rawEvent?.data?.metadata);
```

---

## ℹ️ LOW PRIORITY ISSUES (Improvements)

### 16. **Excessive Console Logging in Production**
Too many console.log statements. Should use structured logging (Winston, Pino) with log levels.

### 17. **No CORS Configuration on Webhook Endpoint**
Webhook endpoint should explicitly reject non-Dodo origins.

### 18. **Missing Health Check Endpoint**
Should have `/api/billing/health` to verify Dodo connectivity.

---

## ✅ WHAT'S DONE WELL

1. **Provider Abstraction:** Excellent abstraction layer makes switching providers easy
2. **Webhook Signature Verification:** Properly uses Standard Webhooks library
3. **Plan Configuration:** Centralized plan config is clean and maintainable
4. **Error Handling in Request Method:** Good JSON parsing with try-catch
5. **Proration Support:** Correctly uses `prorated_immediately` for fair billing
6. **Auto-Reactivation:** Handles cancellation flag before plan changes
7. **Normalized Event Types:** Provider-agnostic event handling is well designed

---

## 🔍 ARCHITECTURE REVIEW

### Strengths:
- ✅ Clean separation of concerns (provider/types/events/factory)
- ✅ Type-safe with TypeScript
- ✅ Provider-agnostic design allows easy migration
- ✅ Webhook handling is robust

### Weaknesses:
- ❌ No database transactions
- ❌ Race conditions between API and webhooks
- ❌ No audit trail
- ❌ Weak error handling
- ❌ Missing rate limiting

---

## 📋 RECOMMENDED ACTION PLAN

### Phase 1: Critical Fixes (Before Production Launch)
1. Fix race condition in subscription updates (Issue #1)
2. Implement database-backed webhook idempotency (Issue #2)
3. Wrap all billing operations in transactions (Issue #3)
4. Remove API key logging (Issue #4)
5. Add rate limiting (Issue #5)

### Phase 2: High Priority (First Week)
6. Implement Zod validation (Issue #6)
7. Fix reactivation endpoint order (Issue #7)
8. Add billing audit log (Issue #8)
9. Generic error messages (Issue #9)
10. Plan config validation (Issue #10)

### Phase 3: Medium Priority (First Month)
11. Optimistic locking (Issue #11)
12. Webhook timestamp validation (Issue #12)
13. Remove dangerous fallbacks (Issue #13)
14. Expire subscription monitoring (Issue #14)
15. Type-safe metadata (Issue #15)

### Phase 4: Nice to Have (When Time Permits)
16-18. Logging improvements, CORS, health checks

---

## 🎯 COMPLIANCE & SECURITY CHECKLIST

### Payment Card Industry (PCI-DSS):
- ✅ No card data stored (handled by Dodo)
- ❌ Logs contain sensitive data (Issue #4)
- ❌ No audit trail (Issue #8)

### General Data Protection Regulation (GDPR):
- ✅ User can delete account
- ⚠️ Need data export for billing history
- ⚠️ Need right to explanation for billing decisions

### SOC 2:
- ❌ No audit logs (Issue #8)
- ❌ No access controls on billing endpoints
- ❌ No monitoring/alerting for failures

---

## 📊 RISK ASSESSMENT

| Risk | Likelihood | Impact | Severity |
|------|-----------|---------|----------|
| Double charging users | High | Critical | 🔴 Critical |
| Incorrect plan access | High | High | 🔴 Critical |
| Webhook replay attack | Medium | High | 🟡 High |
| Data corruption | Medium | Critical | 🔴 Critical |
| API key leak | Low | Critical | 🟡 High |
| DOS on billing API | High | Medium | 🟡 High |

---

## ✍️ CONCLUSION

The billing system has a **solid architectural foundation** but requires **critical security and reliability fixes** before production use. The main concerns are:

1. **Race conditions** that can cause financial discrepancies
2. **Lack of transactions** leading to data corruption
3. **Missing audit trail** for compliance
4. **Weak security** (rate limiting, validation, logging)

**Recommendation:** **DO NOT deploy to production** until Phase 1 critical fixes are completed. The current implementation could lead to:
- Users charged incorrectly
- Lost revenue from access control bugs
- Compliance violations
- Security breaches

Estimated time to production-ready: **3-5 days** with focused effort.

---

**Audit completed by:** Senior Software Architect
**Next review:** After Phase 1 fixes are implemented
