// Email configuration - optional feature
let nodemailer: any = null;
let transporter: any = null;

// Try to load nodemailer if available
try {
  nodemailer = require('nodemailer');

  // Only create transporter if all SMTP env vars are set
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT),
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
    console.log('✅ Email service configured');
  } else {
    console.warn('⚠️  Email service not configured - SMTP env vars missing');
  }
} catch (error) {
  console.warn('⚠️  Email service not available - nodemailer not installed');
}

// Rate limiting configuration
const emailRateLimit = new Map<string, number>();
const EMAIL_RATE_LIMIT = parseInt(process.env.EMAIL_RATE_LIMIT || '5');
const EMAIL_RATE_LIMIT_WINDOW = parseInt(process.env.EMAIL_RATE_LIMIT_WINDOW || '3600000'); // 1 hour

/**
 * Send email notification
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - HTML content of the email
 * @param text - Plain text fallback
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  // If email service is not configured, skip silently
  if (!transporter) {
    console.log('Email sending skipped (not configured):', { to, subject });
    return { success: false, error: 'Email service not configured' };
  }

  // Check rate limiting
  const now = Date.now();
  const userKey = `email:${to}`;
  const lastSent = emailRateLimit.get(userKey) || 0;

  if (now - lastSent < EMAIL_RATE_LIMIT_WINDOW) {
    const sentCount = emailRateLimit.get(userKey + ':count') || 0;
    if (sentCount >= EMAIL_RATE_LIMIT) {
      console.warn(`Email rate limit exceeded for ${to}`);
      return { success: false, error: 'Rate limit exceeded' };
    }
    emailRateLimit.set(userKey + ':count', sentCount + 1);
  } else {
    emailRateLimit.set(userKey, now);
    emailRateLimit.set(userKey + ':count', 1);
  }

  try {
    // Validate email address format
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      throw new Error(`Invalid email address: ${to}`);
    }

    const SMTP_FROM = process.env.SMTP_FROM || 'noreply@persistq.com';

    const info = await transporter.sendMail({
      from: `"PersistQ" <${SMTP_FROM}>`,
      to,
      subject,
      html,
      text,
    });

    console.log('Email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);

    // Log error details for debugging
    const errorDetails = {
      to,
      subject,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
    console.error('Email error details:', errorDetails);

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send feedback notification to admin
 * @param feedback - Feedback content
 * @param user - User information
 */
export async function sendFeedbackNotification(feedback: string, user?: { email?: string; id?: string }) {
  const adminEmail = process.env.SMTP_ADMIN;
  if (!adminEmail) {
    console.log('Admin email not configured, skipping notification');
    return { success: false, error: 'Admin email not configured' };
  }

  const userEmail = user?.email || 'unknown';
  const userId = user?.id || 'unknown';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <div style="background: #1f2937; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">New Feedback Received</h2>
      </div>
      <div style="padding: 20px;">
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="margin: 0 0 10px 0;"><strong>User:</strong> ${userEmail}</p>
          <p style="margin: 0 0 10px 0;"><strong>User ID:</strong> ${userId}</p>
          <p style="margin: 0 0 10px 0;"><strong>Feedback:</strong></p>
          <div style="background: white; padding: 10px; border-radius: 3px; margin: 10px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0; white-space: pre-wrap;">${feedback}</p>
          </div>
        </div>
        <p style="color: #6b7280;">This is an automated notification from PersistQ.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: 'New Feedback Received - PersistQ',
    html,
    text: `New feedback from ${userEmail} (${userId}):\n\n${feedback}`,
  });
}

/**
 * Send user confirmation email
 * @param to - User email
 * @param feedback - Feedback content
 */
export async function sendFeedbackConfirmation(to: string, feedback: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
      <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">Thank you for your feedback!</h2>
      </div>
      <div style="padding: 20px;">
        <p style="margin: 0 0 15px 0;">We've received your feedback and will review it shortly.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Your feedback:</strong></p>
          <div style="background: white; padding: 10px; border-radius: 3px; margin: 10px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 0; white-space: pre-wrap;">${feedback}</p>
          </div>
        </div>
        <p style="color: #6b7280;">We appreciate your input and will get back to you if needed.</p>
        <p style="margin-top: 20px; color: #6b7280;">Best regards,<br>The PersistQ Team</p>
      </div>
    </div>
  `;

  return sendEmail({
    to,
    subject: 'Thank you for your feedback - PersistQ',
    html,
    text: `Thank you for your feedback! We've received: ${feedback}`,
  });
}
