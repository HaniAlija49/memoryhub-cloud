import * as Sentry from "@sentry/nextjs";

// Only enable Sentry if explicitly enabled AND in production
const isObservabilityEnabled = process.env.OBSERVABILITY_ENABLED === 'true' && process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  enabled: isObservabilityEnabled,

  // Performance monitoring - reduced to 10% as specified
  tracesSampleRate: 0.1,

  integrations: [
    // Console logging integration (replaces enableHighlightLogging)
    Sentry.consoleIntegration({ levels: ['log', 'warn', 'error'] }),
  ],

  environment: process.env.NODE_ENV,

  // Add context for better debugging
  beforeSend(event) {
    // Add any custom filtering here if needed
    return event;
  },
});
