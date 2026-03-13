import { getUserTeams } from '$lib/server/queries/user_teams.js';
import { getPersonalStats } from '$lib/server/queries/coffee_logs.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  const [teams, stats] = await Promise.all([
    getUserTeams(session!.user.id),
    getPersonalStats(session!.user.id)
  ]);

  return { teams, stats, session };
};
