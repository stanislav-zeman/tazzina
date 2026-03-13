import { getUserTeams } from '$lib/server/queries/user_teams.js';
import { getPersonalStats } from '$lib/server/queries/coffee_logs.js';
import { getUserById, updateChartColor } from '$lib/server/queries/users.js';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  const [teams, stats, user] = await Promise.all([
    getUserTeams(session!.user.id),
    getPersonalStats(session!.user.id),
    getUserById(session!.user.id)
  ]);

  return { teams, stats, session, chartColor: user?.chart_color ?? '#f97316' };
};

export const actions: Actions = {
  updateColor: async ({ locals, request }) => {
    const session = await locals.auth();
    const formData = await request.formData();
    const color = formData.get('color') as string;
    await updateChartColor(session!.user.id, color);
  }
};
