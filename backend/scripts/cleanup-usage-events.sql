-- Cleanup old usage events to maintain Neon free tier limits
-- Retention policy: 14 days (adjust as needed)

-- Delete usage events older than 14 days
DELETE FROM usage_events 
WHERE created_at < NOW() - INTERVAL '14 days';

-- Optional: Add vacuum to reclaim space (run occasionally)
-- VACUUM usage_events;

-- Log cleanup completion (for monitoring)
-- This query can be used to verify cleanup worked:
-- SELECT COUNT(*) FROM usage_events WHERE created_at < NOW() - INTERVAL '14 days';