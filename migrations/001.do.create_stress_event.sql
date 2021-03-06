CREATE TABLE stress_events (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    stress_event TEXT NOT NULL,
    mood INTEGER NOT NULL,
    work_efficiency INTEGER NOT NULL,
    stress_cause TEXT NOT NULL,
    stress_score INTEGER NOT NULL,
    symptoms TEXT NOT NULL,
    coping TEXT NOT NULL,
    date_recorded TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);



