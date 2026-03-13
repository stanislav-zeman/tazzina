import { db } from "../db.js";
import type { Sprint } from "../../types.js";

export async function listSprints(teamId: string): Promise<Sprint[]> {
  return db<Sprint[]>`
    SELECT * FROM sprints WHERE team_id = ${teamId} ORDER BY start_date DESC
  `;
}

export async function getActiveSprint(teamId: string): Promise<Sprint | null> {
  const rows = await db<Sprint[]>`
    SELECT * FROM sprints
    WHERE team_id = ${teamId}
      AND start_date <= CURRENT_DATE
      AND end_date >= CURRENT_DATE
    ORDER BY start_date DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createSprint(data: {
  team_id: string;
  name: string;
  start_date: string;
  end_date: string;
}): Promise<Sprint> {
  const rows = await db<Sprint[]>`
    INSERT INTO sprints (team_id, name, start_date, end_date)
    VALUES (${data.team_id}, ${data.name}, ${data.start_date}, ${data.end_date})
    RETURNING *
  `;
  return rows[0];
}

export async function deleteSprint(id: string): Promise<void> {
  await db`DELETE FROM sprints WHERE id = ${id}`;
}

export async function getSprintById(id: string): Promise<Sprint | null> {
  const rows = await db<
    Sprint[]
  >`SELECT * FROM sprints WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

export async function getAllActiveSprintsWithTeam(
  userId: string,
): Promise<(Sprint & { team_name: string })[]> {
  return db<(Sprint & { team_name: string })[]>`
    SELECT s.*, t.name as team_name FROM sprints s
    JOIN teams t ON t.id = s.team_id
    JOIN user_teams ut ON ut.team_id = t.id
    WHERE s.start_date <= CURRENT_DATE
      AND s.end_date >= CURRENT_DATE
      AND ut.user_id = ${userId}
    ORDER BY t.name, s.start_date DESC
  `;
}
