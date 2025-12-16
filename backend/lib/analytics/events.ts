/**
 * PersistQ Analytics Event Definitions
 * 
 * This file defines all valid analytics events for the PersistQ application.
 * Events follow the pattern: {feature}_{action}
 */

// Event type for type safety
export type PersistQEvent = 
  // Memory operations
  | 'memory_created'
  | 'memory_searched' 
  | 'memory_updated'
  | 'memory_deleted'
  | 'document_uploaded'
  | 'document_processed'
  | 'document_failed'

  // API Keys
  | 'api_key_generated'
  | 'api_key_regenerated'
  | 'api_key_copied'

  // Billing
  | 'billing_opened'
  | 'checkout_started'
  | 'subscription_activated'
  | 'subscription_cancelled'
  | 'plan_upgraded'

  // Search
  | 'search_performed'
  | 'search_failed'

  // Feedback
  | 'feedback_submitted'

  // Dashboard
  | 'dashboard_opened'
  | 'settings_opened';

// Set of all valid events for validation
export const VALID_EVENTS = new Set<PersistQEvent>([
  // Memory operations
  'memory_created',
  'memory_searched',
  'memory_updated', 
  'memory_deleted',
  'document_uploaded',
  'document_processed',
  'document_failed',

  // API Keys
  'api_key_generated',
  'api_key_regenerated',
  'api_key_copied',

  // Billing
  'billing_opened',
  'checkout_started',
  'subscription_activated',
  'subscription_cancelled',
  'plan_upgraded',

  // Search
  'search_performed',
  'search_failed',

  // Feedback
  'feedback_submitted',

  // Dashboard
  'dashboard_opened',
  'settings_opened',
]);

// Event categories for grouping
export const EVENT_CATEGORIES: Record<string, PersistQEvent[]> = {
  MEMORY: [
    'memory_created',
    'memory_searched',
    'memory_updated',
    'memory_deleted',
    'document_uploaded',
    'document_processed',
    'document_failed',
  ],
  API_KEY: [
    'api_key_generated',
    'api_key_regenerated',
    'api_key_copied',
  ],
  BILLING: [
    'billing_opened',
    'checkout_started',
    'subscription_activated',
    'subscription_cancelled',
    'plan_upgraded',
  ],
  SEARCH: [
    'search_performed',
    'search_failed',
  ],
  ENGAGEMENT: [
    'feedback_submitted',
    'dashboard_opened',
    'settings_opened',
  ],
};

// Validation function
export function isValidEvent(event: string): event is PersistQEvent {
  return VALID_EVENTS.has(event as PersistQEvent);
}

// Get category for an event
export function getEventCategory(event: PersistQEvent): string {
  for (const [category, events] of Object.entries(EVENT_CATEGORIES)) {
    if (events.includes(event)) {
      return category.toLowerCase();
    }
  }
  return 'other';
}