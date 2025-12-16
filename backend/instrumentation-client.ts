// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Only enable Sentry if explicitly enabled AND in production
const isObservabilityEnabled = process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === 'true' && process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable when observability is explicitly enabled
  enabled: isObservabilityEnabled,

  // Add optional integrations for additional features
  integrations: [Sentry.replayIntegration()],

  // Performance monitoring - 10% sample rate (optimal for cost/value)
  tracesSampleRate: 0.1,

  // Define how likely Replay events are sampled (10% of sessions)
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs (100% of errors)
  replaysOnErrorSampleRate: 1.0,

  // Environment for filtering in Sentry dashboard
  environment: process.env.NODE_ENV,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
