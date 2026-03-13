-- Remove 'manager' from the global user_role enum.
-- Manager status is tracked per-team via user_teams.is_manager instead.
UPDATE users SET role = 'user' WHERE role = 'manager';
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
ALTER TYPE user_role RENAME TO user_role_old;
CREATE TYPE user_role AS ENUM ('admin', 'user');
ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::text::user_role;
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
DROP TYPE user_role_old;
