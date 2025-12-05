import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  enabled: process.env.NODE_ENV === 'production',

  // Performance monitoring
  tracesSampleRate: 1.0,

  integrations: [
    // Console logging integration (replaces enableHighlightLogging)
    Sentry.consoleIntegration({ levels: ['log', 'warn', 'error'] }),
  ],

  environment: process.env.NODE_ENV,
});
