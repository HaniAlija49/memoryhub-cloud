import * as Sentry from "@sentry/nextjs";

// Only enable Sentry if explicitly enabled AND in production
const isObservabilityEnabled = process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED === 'true' && process.env.NODE_ENV === 'production';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Only enable if observability is enabled
  enabled: isObservabilityEnabled,

  // Error tracking - reduced to 10% as specified
  tracesSampleRate: 0.1,

  // Performance monitoring
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

  // Session replay
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
      networkDetailAllowUrls: [typeof window !== 'undefined' ? window.location.origin : ''],
      networkCaptureBodies: true,
      networkRequestHeaders: ['content-type'],
      networkResponseHeaders: ['content-type'],
    }),
    // Console logging integration
    Sentry.consoleIntegration({ levels: ['log', 'warn', 'error'] }),
  ],

  // User feedback
  beforeSend(event) {
    // Show feedback dialog on errors if user is authenticated
    if (event.exception) {
      Sentry.showReportDialog({ eventId: event.event_id });
    }
    return event;
  },

  environment: process.env.NODE_ENV,

  // Replicate highlight.io's network blocking
  ignoreErrors: [],
  denyUrls: [
    /\/api\/webhooks\//i,
    /\/api\/auth\//i,
  ],
});
