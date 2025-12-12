# Dodo Payments Setup Guide

## ✅ Status: Backend Complete, Configuration Needed

You need to complete these steps to activate billing:

---

## Step 1: Create Products in Dodo Dashboard (15 minutes)

### 1.1 Log into Dodo Dashboard
Visit: https://dashboard.dodopayments.com

### 1.2 Create 6 Products

Navigate to **Products** section and create:

| Product Name | Price | Billing Interval | Features |
|--------------|-------|------------------|----------|
| PersistQ Starter Monthly | $5.00 | Monthly | 50K API calls, 2.5K memories |
| PersistQ Starter Yearly | $50.00 | Yearly | 50K API calls, 2.5K memories (17% discount) |
| PersistQ Pro Monthly | $12.00 | Monthly | 500K API calls, 25K memories |
| PersistQ Pro Yearly | $120.00 | Yearly | 500K API calls, 25K memories (17% discount) |
| PersistQ Premium Monthly | $29.00 | Monthly | 2M API calls, 100K memories |
| PersistQ Premium Yearly | $290.00 | Yearly | 2M API calls, 100K memories (17% discount) |

### 1.3 Copy Product IDs

After creating each product, Dodo will generate a Product ID (format: `pdt_...`).

**Copy all 6 product IDs** - you'll need them in the next step.

---

## Step 2: Update Plan Configuration (2 minutes)

### 2.1 Open the Plans Config File
File: `backend/config/plans.ts`

### 2.2 Replace Placeholders with Real Product IDs

Find these sections and replace the placeholders:

```typescript
// Line ~102 - Starter Plan
providers: {
  dodo: {
    monthly: "pdt_starter_monthly",  // ❌ REPLACE with real Dodo product ID
    yearly: "pdt_starter_yearly",    // ❌ REPLACE with real Dodo product ID
  },
},

// Line ~126 - Pro Plan
providers: {
  dodo: {
    monthly: "pdt_pro_monthly",      // ❌ REPLACE with real Dodo product ID
    yearly: "pdt_pro_yearly",        // ❌ REPLACE with real Dodo product ID
  },
},

// Line ~150 - Premium Plan
providers: {
  dodo: {
    monthly: "pdt_premium_monthly",  // ❌ REPLACE with real Dodo product ID
    yearly: "pdt_premium_yearly",    // ❌ REPLACE with real Dodo product ID
  },
},
```

**Example** (your IDs will be different):
```typescript
providers: {
  dodo: {
    monthly: "pdt_ABC123XYZ",
    yearly: "pdt_DEF456UVW",
  },
},
```

---

## Step 3: Configure Webhook Endpoint (5 minutes)

### 3.1 Get Your Webhook URL

**Local Development**:
```
http://localhost:3000/api/webhooks/billing/dodo
```

**Production** (replace with your domain):
```
https://your-domain.com/api/webhooks/billing/dodo
```

⚠️ **For local testing**, you'll need to expose your localhost using:
- [ngrok](https://ngrok.com): `ngrok http 3000`
- [localtunnel](https://localtunnel.github.io): `lt --port 3000`
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)

### 3.2 Create Webhook in Dodo Dashboard

1. Go to https://dashboard.dodopayments.com → **Developer** → **Webhooks**
2. Click **"Add Endpoint"**
3. Enter your webhook URL
4. Select these events:
   - ✅ `subscription.created`
   - ✅ `subscription.updated` (or `subscription.plan_changed`)
   - ✅ `subscription.canceled`
   - ✅ `subscription.paused` (or `subscription.on_hold`)
   - ✅ `payment.succeeded`
   - ✅ `payment.failed`
5. Click **Save**

### 3.3 Copy Webhook Secret

After saving, Dodo will show you a **Webhook Secret** (format: `whsec_...`).

**Copy this secret** - you'll add it to your `.env` file.

---

## Step 4: Update Environment Variables (1 minute)

### 4.1 Create/Update `.env.local` File

File: `backend/.env.local`

Add or update these variables:

```bash
# Billing Configuration
BILLING_PROVIDER=dodo
DODO_API_KEY=sWykwCaIvJeXGQC2.LPJ84lmQHpHIsmWYN01ijQNpB1jZ6derC6yDmA9m4nsUaje_
DODO_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE  # ⚠️ PASTE from Dodo dashboard
DODO_MODE=test                               # Use "test" for development
NEXT_PUBLIC_APP_URL=http://localhost:3000    # Update for production
```

### 4.2 Restart Backend Server

The backend needs to reload environment variables:

```bash
cd backend
npm run dev
```

---

## Step 5: Test Webhook Delivery (5 minutes)

### 5.1 Send Test Webhook from Dodo

1. In Dodo Dashboard → **Developer** → **Webhooks**
2. Click on your webhook endpoint
3. Click **"Send Test Event"**
4. Select `subscription.created` event
5. Click **Send**

### 5.2 Check Backend Logs

You should see in your terminal:

```
[Webhook] Received subscription.created event from dodo
[Billing] Processing event: subscription.created from dodo
[Billing] Event subscription.created processed successfully
```

✅ If you see this, webhook verification is working!

❌ If you see `Invalid webhook signature`, check:
- `DODO_WEBHOOK_SECRET` matches the secret from Dodo dashboard
- No extra spaces or quotes in the `.env.local` file
- Backend server was restarted after adding the secret

---

## Summary Checklist

Before testing checkout flows, ensure:

- [  ] Created 6 products in Dodo dashboard
- [ ] Copied all 6 product IDs
- [ ] Updated `backend/config/plans.ts` with real product IDs
- [ ] Created webhook endpoint in Dodo dashboard
- [ ] Copied webhook secret
- [ ] Added `DODO_WEBHOOK_SECRET` to `.env.local`
- [ ] Restarted backend server
- [ ] Tested webhook delivery successfully

---

## Next Steps

Once all checkboxes above are complete:

1. **Update Pricing Page** - Wire "Get started" buttons to checkout API
2. **Build Billing Dashboard** - Display subscription status and usage
3. **Test Full Flow** - Complete a test checkout and verify webhook

See `BILLING_IMPLEMENTATION_SUMMARY.md` for detailed implementation guide.

---

## Troubleshooting

### "Product not found" error during checkout
- Check that product IDs in `backend/config/plans.ts` match exactly (case-sensitive)
- Verify products are active in Dodo dashboard

### Webhook signature verification fails
- Ensure `DODO_WEBHOOK_SECRET` is correct
- Check for typos or extra characters
- Restart backend after updating `.env.local`

### Checkout redirects but no subscription created
- Check backend logs for webhook delivery
- Verify webhook endpoint is publicly accessible (use ngrok for local)
- Check Dodo dashboard → Webhooks → Recent Deliveries for errors

---

## Support

**Dodo Payments Docs**: https://docs.dodopayments.com
**Implementation Summary**: See `BILLING_IMPLEMENTATION_SUMMARY.md`
**Code Examples**: Check `backend/lib/billing/` source files
