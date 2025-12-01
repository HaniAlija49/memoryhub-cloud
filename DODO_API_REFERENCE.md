# Dodo Payments API Reference - Correct Endpoints

This document lists all Dodo Payments API endpoints we use, verified against the official TypeScript SDK.

## Base URLs
- **Test Mode**: `https://test.dodopayments.com`
- **Live Mode**: `https://live.dodopayments.com`

## Authentication
All requests require:
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

---

## ✅ Checkout Sessions

### Create Checkout Session
```
POST /checkouts
```

**Request Body:**
```json
{
  "product_cart": [
    {
      "product_id": "pdt_xxx",
      "quantity": 1
    }
  ],
  "return_url": "https://yourapp.com/success",
  "customer": {
    "email": "user@example.com"
  },
  "metadata": {
    "userId": "user_123",
    "planId": "starter"
  }
}
```

**Response:**
```json
{
  "checkout_url": "https://test.checkout.dodopayments.com/xxx",
  "session_id": "cks_xxx"
}
```

---

## ✅ Subscriptions

### Get Subscription
```
GET /subscriptions/{subscription_id}
```

**Response:**
```json
{
  "id": "sub_xxx",
  "customer_id": "cus_xxx",
  "product_id": "pdt_xxx",
  "status": "active",
  "current_period_start": 1234567890,
  "current_period_end": 1234567890,
  "cancel_at_period_end": false,
  "billing_interval": "monthly",
  "amount": 500,
  "currency": "USD"
}
```

### Change Plan (Update Subscription)
```
POST /subscriptions/{subscription_id}/change-plan
```

**Request Body:**
```json
{
  "subscription_id": "sub_xxx",
  "product_id": "pdt_new_plan",
  "change_plan_type": "prorated_immediately"
}
```

**Change Plan Types:**
- `prorated_immediately`: Charge prorated amount (recommended)
- `full_immediately`: Charge full new plan amount

### Update Subscription (Cancel, Modify)
```
PATCH /subscriptions/{subscription_id}
```

**Request Body (for cancellation):**
```json
{
  "cancel_at_next_billing_date": true,
  "status": "cancelled"  // optional, for immediate cancellation
}
```

**Other update fields:**
- `next_billing_date`: ISO date string
- `metadata`: object
- `billing_address`: object
- `customer_name`: string
- `tax_id`: string

---

## ✅ Customer Portal

### Create Portal Session
```
POST /customers/{customer_id}/customer-portal/session
```

**Request Body:**
```json
{
  "return_url": "https://yourapp.com/billing"
}
```

**Response:**
```json
{
  "link": "https://portal.dodopayments.com/xxx"
}
```

**Note:** Response field is `link`, not `url`.

---

## 📝 Notes

1. **No `/v1/` prefix**: Dodo endpoints don't use version prefixes
2. **Snake case**: All request/response fields use `snake_case`
3. **Timestamps**: Unix timestamps (seconds since epoch) or ISO strings
4. **Rate Limiting**: 1000 requests/min, monitor `X-RateLimit-Remaining` header
5. **Webhooks**: Use Standard Webhooks spec with signature verification

---

## 🔗 Official Documentation
- **API Reference**: https://docs.dodopayments.com/api-reference/introduction
- **TypeScript SDK**: https://github.com/dodopayments/dodopayments-typescript
- **Webhook Events**: https://docs.dodopayments.com/developer-resources/webhooks/intents/webhook-events-guide
