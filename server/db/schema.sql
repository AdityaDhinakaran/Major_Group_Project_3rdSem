CREATE TABLE IF NOT EXISTS roadmaps (
  id TEXT PRIMARY KEY,
  title VARCHAR(60) NOT NULL,
  category VARCHAR(40) NOT NULL DEFAULT 'COMMUNITY PICKS',
  level VARCHAR(20) NOT NULL CHECK (level IN ('Beginner', 'Intermediate')),
  icon VARCHAR(8) NOT NULL DEFAULT '✳',
  color VARCHAR(20) NOT NULL DEFAULT 'pink',
  description VARCHAR(240) NOT NULL,
  topics INTEGER NOT NULL DEFAULT 1 CHECK (topics > 0),
  hours INTEGER NOT NULL DEFAULT 1 CHECK (hours > 0),
  learners INTEGER NOT NULL DEFAULT 1 CHECK (learners >= 0),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  tags TEXT[] NOT NULL DEFAULT ARRAY['Community'],
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS roadmaps_created_at_idx ON roadmaps (created_at DESC);
