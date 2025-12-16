-- PersistQ Analytics Queries
-- Use these queries to gain insights into user behavior and system usage

-- ========================================
-- FEATURE USAGE ANALYSIS
-- ========================================

-- Most used features (last 7 days)
SELECT event, COUNT(*) as count
FROM usage_events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY event
ORDER BY count DESC;

-- Most used features (last 30 days)
SELECT event, COUNT(*) as count
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY event
ORDER BY count DESC;

-- Daily feature usage trends (last 14 days)
SELECT 
    DATE(created_at) as date,
    event,
    COUNT(*) as count
FROM usage_events
WHERE created_at > NOW() - INTERVAL '14 days'
GROUP BY DATE(created_at), event
ORDER BY date, count DESC;

-- ========================================
-- USER ACTIVITY ANALYSIS
-- ========================================

-- Most active users (last 7 days)
SELECT 
    u.email,
    ue.user_id,
    COUNT(*) as actions
FROM usage_events ue
JOIN users u ON ue.user_id = u.id
WHERE ue.created_at > NOW() - INTERVAL '7 days'
GROUP BY ue.user_id, u.email
ORDER BY actions DESC
LIMIT 20;

-- Daily active users (DAU) - last 30 days
SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as dau
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- Weekly active users (WAU) - last 12 weeks
SELECT 
    date_trunc('week', created_at) as week,
    COUNT(DISTINCT user_id) as wau
FROM usage_events
WHERE created_at > NOW() - INTERVAL '12 weeks'
GROUP BY date_trunc('week', created_at)
ORDER BY week;

-- Monthly active users (MAU) - last 6 months
SELECT 
    date_trunc('month', created_at) as month,
    COUNT(DISTINCT user_id) as mau
FROM usage_events
WHERE created_at > NOW() - INTERVAL '6 months'
GROUP BY date_trunc('month', created_at)
ORDER BY month;

-- ========================================
-- MEMORY OPERATIONS FUNNEL
-- ========================================

-- Memory creation funnel (last 7 days)
SELECT
    COUNT(*) FILTER (WHERE event = 'memory_created') as created,
    COUNT(*) FILTER (WHERE event = 'memory_searched') as searched,
    COUNT(*) FILTER (WHERE event = 'memory_updated') as updated,
    COUNT(*) FILTER (WHERE event = 'memory_deleted') as deleted,
    COUNT(*) FILTER (WHERE event = 'document_uploaded') as documents_uploaded,
    COUNT(*) FILTER (WHERE event = 'document_processed') as documents_processed
FROM usage_events
WHERE created_at > NOW() - INTERVAL '7 days';

-- Memory operations by user (last 30 days)
SELECT 
    u.email,
    COUNT(*) FILTER (WHERE event = 'memory_created') as created,
    COUNT(*) FILTER (WHERE event = 'memory_searched') as searched,
    COUNT(*) FILTER (WHERE event = 'memory_updated') as updated,
    COUNT(*) FILTER (WHERE event = 'memory_deleted') as deleted
FROM usage_events ue
JOIN users u ON ue.user_id = u.id
WHERE ue.created_at > NOW() - INTERVAL '30 days'
    AND event IN ('memory_created', 'memory_searched', 'memory_updated', 'memory_deleted')
GROUP BY ue.user_id, u.email
ORDER BY created DESC, searched DESC;

-- Document processing success rate (last 30 days)
SELECT
    COUNT(*) FILTER (WHERE event = 'document_processed') as processed,
    COUNT(*) FILTER (WHERE event = 'document_failed') as failed,
    CASE 
        WHEN COUNT(*) FILTER (WHERE event = 'document_processed') > 0 
        THEN ROUND(
            (COUNT(*) FILTER (WHERE event = 'document_processed')::float / 
             (COUNT(*) FILTER (WHERE event = 'document_processed') + COUNT(*) FILTER (WHERE event = 'document_failed')) * 100, 2
        )
        ELSE 0
    END as success_rate_percent
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days'
    AND event IN ('document_processed', 'document_failed');

-- ========================================
-- BILLING & CONVERSION ANALYSIS
-- ========================================

-- Billing conversion funnel (last 30 days)
SELECT
    COUNT(*) FILTER (WHERE event = 'billing_opened') as viewed_billing,
    COUNT(*) FILTER (WHERE event = 'checkout_started') as started_checkout,
    COUNT(*) FILTER (WHERE event = 'subscription_activated') as converted,
    COUNT(*) FILTER (WHERE event = 'subscription_cancelled') as cancelled
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days';

-- Checkout conversion rates (last 30 days)
SELECT
    COUNT(*) FILTER (WHERE event = 'checkout_started') as checkout_started,
    COUNT(*) FILTER (WHERE event = 'subscription_activated') as subscriptions_activated,
    CASE 
        WHEN COUNT(*) FILTER (WHERE event = 'checkout_started') > 0
        THEN ROUND(
            (COUNT(*) FILTER (WHERE event = 'subscription_activated')::float / 
             COUNT(*) FILTER (WHERE event = 'checkout_started') * 100, 2
        )
        ELSE 0
    END as conversion_rate_percent
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days';

-- Plan upgrade activity (last 30 days)
SELECT 
    DATE(created_at) as date,
    COUNT(*) as upgrades
FROM usage_events
WHERE event = 'plan_upgraded'
    AND created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- ========================================
-- API KEY USAGE ANALYSIS
-- ========================================

-- API key adoption (last 30 days)
SELECT
    COUNT(*) FILTER (WHERE event = 'api_key_generated') as generated,
    COUNT(*) FILTER (WHERE event = 'api_key_regenerated') as regenerated,
    COUNT(*) FILTER (WHERE event = 'api_key_copied') as copied
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days';

-- Users who generated API keys (last 30 days)
SELECT 
    u.email,
    u.created_at as user_created,
    ue.created_at as api_key_generated
FROM usage_events ue
JOIN users u ON ue.user_id = u.id
WHERE ue.event = 'api_key_generated'
    AND ue.created_at > NOW() - INTERVAL '30 days'
ORDER BY ue.created_at DESC;

-- ========================================
-- SEARCH USAGE ANALYSIS
-- ========================================

-- Search usage patterns (last 7 days)
SELECT
    DATE(created_at) as date,
    COUNT(*) FILTER (WHERE event = 'search_performed') as searches,
    COUNT(*) FILTER (WHERE event = 'search_failed') as failed_searches,
    CASE 
        WHEN COUNT(*) FILTER (WHERE event = 'search_performed') > 0
        THEN ROUND(
            (COUNT(*) FILTER (WHERE event = 'search_failed')::float / 
             (COUNT(*) FILTER (WHERE event = 'search_performed') + COUNT(*) FILTER (WHERE event = 'search_failed')) * 100, 2
        )
        ELSE 0
    END as failure_rate_percent
FROM usage_events
WHERE created_at > NOW() - INTERVAL '7 days'
    AND event IN ('search_performed', 'search_failed')
GROUP BY DATE(created_at)
ORDER BY date;

-- ========================================
-- USER ENGAGEMENT ANALYSIS
-- ========================================

-- Dashboard and settings usage (last 30 days)
SELECT
    COUNT(*) FILTER (WHERE event = 'dashboard_opened') as dashboard_opens,
    COUNT(*) FILTER (WHERE event = 'settings_opened') as settings_opens,
    COUNT(*) FILTER (WHERE event = 'feedback_submitted') as feedback_submitted
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days';

-- Power users (top 10% by activity, last 30 days)
WITH user_activity AS (
    SELECT 
        user_id,
        COUNT(*) as total_actions
    FROM usage_events
    WHERE created_at > NOW() - INTERVAL '30 days'
    GROUP BY user_id
),
percentile_threshold AS (
    SELECT 
        percentile_cont(0.90) WITHIN GROUP (ORDER BY total_actions) as p90_threshold
    FROM user_activity
)
SELECT 
    u.email,
    ua.total_actions,
    pt.p90_threshold
FROM user_activity ua
JOIN users u ON ua.user_id = u.id
CROSS JOIN percentile_threshold pt
WHERE ua.total_actions >= pt.p90_threshold
ORDER BY ua.total_actions DESC;

-- ========================================
-- DEBUGGING & SUPPORT QUERIES
-- ========================================

-- User's recent activity (for support)
-- Replace 'USER_ID_HERE' with actual user ID
SELECT event, created_at
FROM usage_events
WHERE user_id = 'USER_ID_HERE'
ORDER BY created_at DESC
LIMIT 50;

-- Users affected by specific error time window
-- Replace 'ERROR_TIME' with the timestamp from Sentry
SELECT DISTINCT user_id
FROM usage_events
WHERE created_at BETWEEN 'ERROR_TIME' - INTERVAL '5 minutes'
  AND 'ERROR_TIME' + INTERVAL '5 minutes';

-- Event timeline for troubleshooting (last 24 hours)
SELECT 
    ue.created_at,
    u.email,
    ue.event,
    ROW_NUMBER() OVER (ORDER BY ue.created_at) as event_sequence
FROM usage_events ue
JOIN users u ON ue.user_id = u.id
WHERE ue.created_at > NOW() - INTERVAL '24 hours'
ORDER BY ue.created_at;

-- ========================================
-- SYSTEM HEALTH & MONITORING
-- ========================================

-- Table size monitoring
SELECT pg_size_pretty(pg_total_relation_size('usage_events')) as table_size,
       pg_size_pretty(pg_relation_size('usage_events')) as table_data_size,
       pg_size_pretty(pg_total_relation_size('usage_events') - pg_relation_size('usage_events')) as index_size;

-- Oldest event (for retention monitoring)
SELECT MIN(created_at) as oldest_event,
       MAX(created_at) as newest_event,
       COUNT(*) as total_events
FROM usage_events;

-- Events per hour (last 24 hours) - for load monitoring
SELECT 
    DATE_TRUNC('hour', created_at) as hour,
    COUNT(*) as events_per_hour
FROM usage_events
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour;

-- Retention cleanup verification
SELECT 
    COUNT(*) as events_to_delete
FROM usage_events
WHERE created_at < NOW() - INTERVAL '14 days';

-- ========================================
-- PERFORMANCE ANALYSIS
-- ========================================

-- Event ingestion rate by day (last 30 days)
SELECT 
    DATE(created_at) as date,
    COUNT(*) as events_per_day,
    COUNT(DISTINCT user_id) as unique_users
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- Peak usage hours (last 7 days)
SELECT 
    EXTRACT(HOUR FROM created_at) as hour_of_day,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users
FROM usage_events
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY event_count DESC;

-- Weekend vs weekday usage (last 30 days)
SELECT 
    CASE 
        WHEN EXTRACT(DOW FROM created_at) IN (0, 6) THEN 'Weekend'
        ELSE 'Weekday'
    END as day_type,
    COUNT(*) as events,
    COUNT(DISTINCT user_id) as unique_users
FROM usage_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY day_type
ORDER BY events DESC;