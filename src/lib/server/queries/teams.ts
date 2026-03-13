import { db } from '../db.js';
import type { Team } from '../../types.js';

export async function listTeams(): Promise<Team[]> {
  return db<Team[]>`SELECT * FROM teams ORDER BY name`;
}

export async function createTeam(name: string): Promise<Team> {
  const rows = await db<Team[]>`
    INSERT INTO teams (name) VALUES (${name}) RETURNING *
  `;
  return rows[0];
}

export async function renameTeam(id: string, name: string): Promise<Team | null> {
  const rows = await db<Team[]>`
    UPDATE teams SET name = ${name} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ?? null;
}

export async function deleteTeam(id: string): Promise<void> {
  await db`DELETE FROM teams WHERE id = ${id}`;
}

export async function getTeamById(id: string): Promise<Team | null> {
  const rows = await db<Team[]>`SELECT * FROM teams WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}
