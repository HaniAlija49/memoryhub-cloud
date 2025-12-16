// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only enable Sentry if explicitly enabled AND in production
const isObservabilityEnabled = process.env.OBSERVABILITY_ENABLED === 'true' && process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Only enable when observability is explicitly enabled
  enabled: isObservabilityEnabled,

  // Performance monitoring - 10% sample rate (optimal for cost/value)
  tracesSampleRate: 0.1,

  // Environment for filtering in Sentry dashboard
  environment: process.env.NODE_ENV,
});
