CREATE TABLE stress_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_modified TIMESTAMP
);

ALTER TABLE stress_events
  ADD COLUMN
    user_id INTEGER REFERENCES stress_users(id)
    ON DELETE SET NULL;