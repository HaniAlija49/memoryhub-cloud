# Email Configuration Setup

## Environment Variables

Add the following email configuration to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@persistq.com
SMTP_ADMIN=admin@persistq.com
```

## Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password for your application
4. Use this app password as `SMTP_PASS`

## Alternative SMTP Providers

You can use other SMTP providers like:

- **Outlook/Hotmail**: `smtp.office365.com`, port 587
- **SendGrid**: `smtp.sendgrid.net`, port 587
- **Mailgun**: `smtp.mailgun.org`, port 587

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for sensitive information
- Consider using a secrets manager for production

## Rate Limiting Configuration

```env
# Email Rate Limiting
EMAIL_RATE_LIMIT=5
EMAIL_RATE_LIMIT_WINDOW=3600000  # 1 hour in milliseconds
```

This limits users to 5 emails per hour to prevent abuse.