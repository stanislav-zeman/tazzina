import { getAllTeamsSprintSummaries, getTeamTotals } from '$lib/server/queries/coffee_logs.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [summaries, teamTotals] = await Promise.all([
    getAllTeamsSprintSummaries(),
    getTeamTotals()
  ]);

  return { summaries, teamTotals };
};
