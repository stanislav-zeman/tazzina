-- Seed teams and sprints for development
-- Only inserts if no teams exist yet
DO $$
DECLARE
  team_alpha UUID;
  team_beta  UUID;
  team_gamma UUID;
BEGIN
  IF (SELECT COUNT(*) FROM teams) > 0 THEN
    RAISE NOTICE 'Teams already exist, skipping seed.';
    RETURN;
  END IF;

  INSERT INTO teams (id, name, chart_color) VALUES
    (gen_random_uuid(), 'Alpha', '#f38ba8'),
    (gen_random_uuid(), 'Beta',  '#a6e3a1'),
    (gen_random_uuid(), 'Gamma', '#89b4fa')
  RETURNING id INTO team_alpha;

  SELECT id INTO team_alpha FROM teams WHERE name = 'Alpha';
  SELECT id INTO team_beta  FROM teams WHERE name = 'Beta';
  SELECT id INTO team_gamma FROM teams WHERE name = 'Gamma';

  -- Alpha: 6 sprints (past + current)
  INSERT INTO sprints (team_id, name, start_date, end_date) VALUES
    (team_alpha, 'Alpha Sprint 1',  '2026-01-06', '2026-01-19'),
    (team_alpha, 'Alpha Sprint 2',  '2026-01-20', '2026-02-02'),
    (team_alpha, 'Alpha Sprint 3',  '2026-02-03', '2026-02-16'),
    (team_alpha, 'Alpha Sprint 4',  '2026-02-17', '2026-03-02'),
    (team_alpha, 'Alpha Sprint 5',  '2026-03-03', '2026-03-16'),
    (team_alpha, 'Alpha Sprint 6',  '2026-03-17', '2026-03-30');

  -- Beta: 4 sprints
  INSERT INTO sprints (team_id, name, start_date, end_date) VALUES
    (team_beta, 'Beta Sprint 1',  '2026-01-12', '2026-01-25'),
    (team_beta, 'Beta Sprint 2',  '2026-01-26', '2026-02-08'),
    (team_beta, 'Beta Sprint 3',  '2026-02-09', '2026-02-22'),
    (team_beta, 'Beta Sprint 4',  '2026-02-23', '2026-03-08');

  -- Gamma: 3 sprints
  INSERT INTO sprints (team_id, name, start_date, end_date) VALUES
    (team_gamma, 'Gamma Sprint 1', '2026-02-02', '2026-02-15'),
    (team_gamma, 'Gamma Sprint 2', '2026-02-16', '2026-03-01'),
    (team_gamma, 'Gamma Sprint 3', '2026-03-02', '2026-03-15');

END $$;
