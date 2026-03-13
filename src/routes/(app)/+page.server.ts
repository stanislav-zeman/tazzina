import { getAllActiveSprintsWithTeam } from '$lib/server/queries/sprints.js';
import { db } from '$lib/server/db.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const activeSprints = await getAllActiveSprintsWithTeam();

  // Get cup totals for each active sprint
  const sprintIds = activeSprints.map((s) => s.id);

  let cupTotals: Record<string, number> = {};
  if (sprintIds.length > 0) {
    const rows = await db<{ sprint_id: string; total_cups: number }[]>`
      SELECT sprint_id, COALESCE(SUM(cup_count), 0)::int as total_cups
      FROM coffee_logs
      WHERE sprint_id = ANY(${sprintIds})
      GROUP BY sprint_id
    `;
    cupTotals = Object.fromEntries(rows.map((r) => [r.sprint_id, r.total_cups]));
  }

  return {
    activeSprints: activeSprints.map((s) => ({
      ...s,
      total_cups: cupTotals[s.id] ?? 0
    }))
  };
};
