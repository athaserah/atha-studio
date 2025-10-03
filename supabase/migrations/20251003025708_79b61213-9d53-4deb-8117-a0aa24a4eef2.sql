-- Enable pg_cron and pg_net extensions for scheduled tasks
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the keep-database-active function to run every 3 days at 2 AM
-- This will prevent Supabase from pausing the database due to inactivity
SELECT cron.schedule(
  'keep-database-active',
  '0 2 */3 * *', -- Every 3 days at 2 AM
  $$
  SELECT
    net.http_post(
        url:='https://ctfhagudzlgxxrpnbkbz.supabase.co/functions/v1/keep-database-active',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZmhhZ3VkemxneHhycG5ia2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5ODI2NzgsImV4cCI6MjA3NDU1ODY3OH0.AeCJtfGd097NtEXa0LoFgxCX8DG71RcSThDQJa0ibjQ"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- You can view all scheduled jobs with:
-- SELECT * FROM cron.job;

-- You can unschedule the job with:
-- SELECT cron.unschedule('keep-database-active');