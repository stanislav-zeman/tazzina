import { db } from '../db.js';
import type { Team, User } from '../../types.js';

export async function addMember(userId: string, teamId: string): Promise<void> {
  await db`
    INSERT INTO user_teams (user_id, team_id)
    VALUES (${userId}, ${teamId})
    ON CONFLICT DO NOTHING
  `;
}

export async function removeMember(userId: string, teamId: string): Promise<void> {
  await db`
    DELETE FROM user_teams WHERE user_id = ${userId} AND team_id = ${teamId}
  `;
}

export async function getUserTeams(userId: string): Promise<(Team & { is_manager: boolean })[]> {
  return db<(Team & { is_manager: boolean })[]>`
    SELECT t.*, ut.is_manager FROM teams t
    JOIN user_teams ut ON ut.team_id = t.id
    WHERE ut.user_id = ${userId}
    ORDER BY t.name
  `;
}

export async function getTeamMembers(teamId: string): Promise<User[]> {
  return db<User[]>`
    SELECT u.* FROM users u
    JOIN user_teams ut ON ut.user_id = u.id
    WHERE ut.team_id = ${teamId}
    ORDER BY u.name
  `;
}

export async function getManagedTeams(userId: string): Promise<Team[]> {
  return db<Team[]>`
    SELECT t.* FROM teams t
    JOIN user_teams ut ON ut.team_id = t.id
    WHERE ut.user_id = ${userId} AND ut.is_manager = true
    ORDER BY t.name
  `;
}

export async function isTeamManager(userId: string, teamId: string): Promise<boolean> {
  const rows = await db<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM user_teams
      WHERE user_id = ${userId} AND team_id = ${teamId} AND is_manager = true
    ) AS exists
  `;
  return rows[0].exists;
}

export async function setTeamManager(userId: string, teamId: string, isManager: boolean): Promise<void> {
  await db`
    UPDATE user_teams SET is_manager = ${isManager}
    WHERE user_id = ${userId} AND team_id = ${teamId}
  `;
}
