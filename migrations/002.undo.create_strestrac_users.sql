ALTER TABLE stress_events
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS stress_users;
