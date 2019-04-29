BEGIN;

TRUNCATE
  stress_events,
  stress_users
  RESTART IDENTITY CASCADE;

INSERT INTO stress_users (user_name, full_name, password)
VALUES
  ('dunder', 'Dunder Mifflin', '$2a$12$7xlhukY1AfIiDSsstT3dBekNY/IiYpHBYNhXMBq/TlP6lnUSWVSlq'),
  ('b.deboop', 'Bodeep Deboop', '$2a$12$vFtufYQpAA6aNQbQi2Nc0eD6tyuXOaYZ8uwVJSH54YLGGWaIr53fe'),
  ('c.bloggs', 'Charlie Bloggs', '$2a$12$bKQn5TeZea/tXegOMXzVOuP3utuD.Te6JD40py793k.sKEMSkyTPe'),
  ('s.smith', 'Sam Smith', '$2a$12$X.Eh5zrQi94iw3vhEKduX.w2uGFLFYlkdBPlUZL53WturLbDID41m'),
  ('lexlor', 'Alex Taylor', '$2a$12$NY2HhkVShjbiwkLFJs9VtOGUISKsWlTlTfV2x6s806m0GEub7X1kW'),
  ('wippy', 'Ping Won In', '$2a$12$1KRBRFLaj9.ldpI90AGlt..Gbx7qUKKjkaG4T4ZVvj77NMDXMx0ES');


INSERT INTO stress_events(stress_event,mood,work_efficiency,stress_cause,stress_score,symptoms,coping,user_id)
VALUES
('First event',4,5,'work related',4,'headache','listen to music',1),
('Second event',4,5,'work related',4,'headache','listen to music',2),
('Third event',4,5,'work related',4,'headache','listen to music',1),
('Fourth event',4,5,'work related',4,'headache','listen to music',2);


COMMIT;