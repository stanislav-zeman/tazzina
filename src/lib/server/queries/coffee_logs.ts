import { db } from "../db.js";
import type {
  CoffeeLog,
  CoffeeType,
  SprintSummary,
  UserSprintStats,
} from "../../types.js";

export async function logCoffee(data: {
  user_id: string;
  sprint_id: string;
  team_id: string;
  coffee_type: CoffeeType;
  cup_count: number;
  logged_at: Date;
}): Promise<CoffeeLog> {
  const rows = await db<CoffeeLog[]>`
    INSERT INTO coffee_logs (user_id, sprint_id, team_id, coffee_type, cup_count, logged_at)
    VALUES (${data.user_id}, ${data.sprint_id}, ${data.team_id}, ${data.coffee_type}, ${data.cup_count}, ${data.logged_at})
    RETURNING *
  `;
  return rows[0];
}

export async function getLogsForSprint(
  sprintId: string,
): Promise<
  (CoffeeLog & { user_name: string; user_avatar_url: string | null })[]
> {
  return db<
    (CoffeeLog & { user_name: string; user_avatar_url: string | null })[]
  >`
    SELECT cl.*, u.name as user_name, u.avatar_url as user_avatar_url
    FROM coffee_logs cl
    JOIN users u ON u.id = cl.user_id
    WHERE cl.sprint_id = ${sprintId}
    ORDER BY cl.logged_at DESC
  `;
}

export async function aggregateByTeamSprint(
  teamId: string,
): Promise<SprintSummary[]> {
  return db<SprintSummary[]>`
    SELECT
      s.id as sprint_id,
      s.name as sprint_name,
      t.id as team_id,
      t.name as team_name,
      t.chart_color,
      COALESCE(SUM(cl.cup_count), 0)::int as total_cups,
      COUNT(cl.id)::int as log_count
    FROM sprints s
    JOIN teams t ON t.id = s.team_id
    LEFT JOIN coffee_logs cl ON cl.sprint_id = s.id
    WHERE s.team_id = ${teamId}
    GROUP BY s.id, s.name, t.id, t.name, t.chart_color
    ORDER BY s.start_date DESC
  `;
}

export async function getUserStatsForSprint(
  sprintId: string,
): Promise<UserSprintStats[]> {
  return db<UserSprintStats[]>`
    SELECT
      u.id as user_id,
      u.name as user_name,
      u.avatar_url as user_avatar_url,
      u.chart_color,
      SUM(cl.cup_count)::int as total_cups,
      cl.coffee_type
    FROM coffee_logs cl
    JOIN users u ON u.id = cl.user_id
    WHERE cl.sprint_id = ${sprintId}
    GROUP BY u.id, u.name, u.avatar_url, u.chart_color, cl.coffee_type
    ORDER BY total_cups DESC
  `;
}

export async function getPersonalStats(
  userId: string,
): Promise<(SprintSummary & { coffee_type: CoffeeType })[]> {
  return db<(SprintSummary & { coffee_type: CoffeeType })[]>`
    SELECT
      s.id as sprint_id,
      s.name as sprint_name,
      t.id as team_id,
      t.name as team_name,
      COALESCE(SUM(cl.cup_count), 0)::int as total_cups,
      COUNT(cl.id)::int as log_count,
      cl.coffee_type
    FROM coffee_logs cl
    JOIN sprints s ON s.id = cl.sprint_id
    JOIN teams t ON t.id = cl.team_id
    WHERE cl.user_id = ${userId}
    GROUP BY s.id, s.name, t.id, t.name, cl.coffee_type
    ORDER BY s.start_date DESC
  `;
}

export async function getTeamTotals(): Promise<
  {
    team_id: string;
    team_name: string;
    chart_color: string;
    total_cups: number;
    log_count: number;
    sprint_count: number;
  }[]
> {
  return db<
    {
      team_id: string;
      team_name: string;
      chart_color: string;
      total_cups: number;
      log_count: number;
      sprint_count: number;
    }[]
  >`
    SELECT
      t.id as team_id,
      t.name as team_name,
      t.chart_color,
      COALESCE(SUM(cl.cup_count), 0)::int as total_cups,
      COUNT(cl.id)::int as log_count,
      COUNT(DISTINCT s.id)::int as sprint_count
    FROM teams t
    LEFT JOIN sprints s ON s.team_id = t.id
    LEFT JOIN coffee_logs cl ON cl.sprint_id = s.id
    GROUP BY t.id, t.name, t.chart_color
    ORDER BY total_cups DESC
  `;
}

export async function getAllTeamsSprintSummaries(): Promise<SprintSummary[]> {
  return db<SprintSummary[]>`
    SELECT
      s.id as sprint_id,
      s.name as sprint_name,
      t.id as team_id,
      t.name as team_name,
      t.chart_color,
      COALESCE(SUM(cl.cup_count), 0)::int as total_cups,
      COUNT(cl.id)::int as log_count
    FROM sprints s
    JOIN teams t ON t.id = s.team_id
    LEFT JOIN coffee_logs cl ON cl.sprint_id = s.id
    GROUP BY s.id, s.name, t.id, t.name, t.chart_color
    ORDER BY s.start_date DESC
  `;
}
