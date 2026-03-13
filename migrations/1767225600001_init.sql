CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE coffee_type AS ENUM (
  'espresso', 'americano', 'latte', 'cappuccino', 'flat_white', 'drip', 'other'
);
CREATE TYPE user_role AS ENUM ('admin', 'user');

CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id  TEXT NOT NULL UNIQUE,
  email      TEXT NOT NULL UNIQUE,
  name       TEXT NOT NULL,
  avatar_url TEXT,
  role       user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_teams (
  user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id   UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, team_id)
);

CREATE TABLE IF NOT EXISTS sprints (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date   DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sprints_dates_check CHECK (end_date >= start_date)
);
CREATE INDEX IF NOT EXISTS idx_sprints_team_id ON sprints(team_id);
CREATE INDEX IF NOT EXISTS idx_sprints_dates   ON sprints(team_id, start_date, end_date);

CREATE TABLE IF NOT EXISTS coffee_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  sprint_id   UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  team_id     UUID NOT NULL REFERENCES teams(id)   ON DELETE CASCADE,
  coffee_type coffee_type NOT NULL,
  cup_count   SMALLINT NOT NULL DEFAULT 1 CHECK (cup_count > 0),
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_coffee_logs_user_sprint ON coffee_logs(user_id, sprint_id);
CREATE INDEX IF NOT EXISTS idx_coffee_logs_team_sprint ON coffee_logs(team_id, sprint_id);
CREATE INDEX IF NOT EXISTS idx_coffee_logs_logged_at   ON coffee_logs(logged_at);

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
