# Dodo Payments MCP Server Setup Guide

## Quick Setup (Automated)

### Step 1: Get Your API Key
1. Go to https://dashboard.dodopayments.com
2. Sign up or log in
3. Navigate to API Keys section
4. Copy your **Test API Key** (starts with `dodo_test_...`)

### Step 2: Run the Setup Script
```bash
node setup-dodo-mcp.js sWykwCaIvJeXGQC2.LPJ84lmQHpHIsmWYN01ijQNpB1jZ6derC6yDmA9m4nsUaje_
```

Example:
```bash
node setup-dodo-mcp.js dodo_test_abc123xyz456
```

### Step 3: Restart Claude Code
- Close your current Claude Code session
- Navigate back to this project directory
- Start a new Claude Code session

### Step 4: Verify Installation
- Type `@` in Claude Code
- You should see `dodopayments` in the MCP servers list
- Click it to enable/disable or view available tools

---

## Manual Setup (Alternative)

If the automated script doesn't work, you can manually edit your config:

### 1. Open your Claude config file:
```
C:\Users\hania\.claude.json
```

### 2. Find the `MemoryHub-Monorepo` project section

### 3. Update the `mcpServers` field:
```json
"D:\\Projects\\MemoryHub-Monorepo": {
  "mcpServers": {
    "dodopayments": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "dodopayments-mcp@latest"],
      "env": {
        "DODO_PAYMENTS_API_KEY": "dodo_test_YOUR_KEY_HERE"
      }
    }
  }
}
```

### 4. Save and restart Claude Code

---

## Available Tools (40+ Payment Tools)

Once configured, you'll have access to tools for:

### Payments
- `create_payments` - Create one-time payments
- `list_payments` - List all payments
- `get_payment` - Get payment details
- `refund_payment` - Issue refunds

### Subscriptions
- `create_subscriptions` - Create recurring subscriptions
- `list_subscriptions` - List all subscriptions
- `get_subscription` - Get subscription details
- `cancel_subscription` - Cancel subscriptions
- `update_subscription` - Modify subscriptions

### Customers
- `create_customers` - Add new customers
- `list_customers` - List all customers
- `get_customer` - Get customer details
- `update_customer` - Update customer info

### Products & Pricing
- `create_products` - Add products to catalog
- `list_products` - View all products
- `create_prices` - Set up pricing tiers
- `list_prices` - View pricing catalog

### Checkout Sessions
- `create_checkout_sessions` - Generate checkout URLs
- `get_checkout_session` - Get session details

### Usage-Based Billing
- `report_usage` - Track metered usage
- `get_usage` - View usage data

### Licenses
- `create_licenses` - Generate license keys
- `validate_license` - Validate licenses
- `list_licenses` - View all licenses

---

## Example Usage in Claude Code

After setup, you can ask Claude to help with payments:

### Example 1: Create Products
```
"Create 4 subscription products in Dodo Payments:
1. Free tier (0/month)
2. Starter ($5/month)
3. Pro ($12/month)
4. Premium ($29/month)"
```

### Example 2: Generate Checkout Session
```
"Create a checkout session for the Pro plan with annual billing"
```

### Example 3: List All Payments
```
"Show me all payments from the last 30 days"
```

### Example 4: Setup Webhooks
```
"Configure webhook handlers for payment.succeeded and subscription.cancelled events"
```

### Example 5: Track Usage
```
"Report API usage for user xyz123: 1500 API calls this month"
```

---

## Tool Filtering (Optional)

You can restrict which tools are available using command flags:

### Read-Only Mode (GET operations only)
```json
"args": ["-y", "dodopayments-mcp@latest", "--operation=read"]
```

### Specific Resources Only
```json
"args": ["-y", "dodopayments-mcp@latest", "--resource=subscriptions"]
```

### Exclude Specific Tools
```json
"args": ["-y", "dodopayments-mcp@latest", "--tool=!refund_payment"]
```

---

## Using Remote Server (No Local Setup)

Alternatively, use the hosted MCP server:

1. Visit https://mcp.dodopayments.com
2. Complete OAuth flow with your API key
3. Select your MCP client (Claude Code)
4. No local configuration needed!

---

## Troubleshooting

### "dodopayments not found in MCP servers"
- Restart Claude Code completely
- Verify the config file was saved correctly
- Check that you're in the MemoryHub-Monorepo directory

### "Authentication failed"
- Verify your API key is correct
- Check you're using `dodo_test_...` for testing
- Get a fresh API key from the dashboard

### "npx command not found"
- Install Node.js if not already installed
- Verify `npx` works by running `npx --version`

### Tools not appearing
- Enable the MCP server by typing `@dodopayments`
- Check Claude Code logs for errors
- Try using the remote server as fallback

---

## Next Steps

1. ✅ Set up MCP server (follow steps above)
2. 📦 Create subscription products in Dodo
3. 🔗 Integrate checkout in your frontend
4. 🪝 Add webhook handlers to backend
5. 📊 Track usage and enforce limits

---

## Resources

- **Dodo Payments Dashboard**: https://dashboard.dodopayments.com
- **API Documentation**: https://docs.dodopayments.com
- **MCP Server Docs**: https://docs.dodopayments.com/developer-resources/mcp-server
- **Claude Code Docs**: https://docs.claude.com/en/docs/claude-code/mcp

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Claude Code logs (`/doctor` command)
3. Contact Dodo Payments support
4. Ask Claude for help debugging!

---

**Generated: 2025-01-22**
**Version: 1.0.0**
