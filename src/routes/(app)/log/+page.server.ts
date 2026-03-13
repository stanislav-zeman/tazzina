import { fail, redirect } from '@sveltejs/kit';
import { getUserTeams } from '$lib/server/queries/user_teams.js';
import { getActiveSprint } from '$lib/server/queries/sprints.js';
import { logCoffee } from '$lib/server/queries/coffee_logs.js';
import { COFFEE_TYPES } from '$lib/types.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.auth();
  const teams = await getUserTeams(session!.user.id);

  const teamsWithSprints = await Promise.all(
    teams.map(async (team) => ({
      ...team,
      activeSprint: await getActiveSprint(team.id)
    }))
  );

  return {
    teams: teamsWithSprints,
    coffeeTypes: COFFEE_TYPES
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const session = await locals.auth();
    const data = await request.formData();

    const sprintId = data.get('sprint_id')?.toString();
    const teamId = data.get('team_id')?.toString();
    const coffeeType = data.get('coffee_type')?.toString();
    const cupCountStr = data.get('cup_count')?.toString();
    const loggedAtStr = data.get('logged_at')?.toString();

    if (!sprintId || !teamId || !coffeeType || !cupCountStr) {
      return fail(400, { error: 'All fields are required' });
    }

    const cupCount = parseInt(cupCountStr);
    if (isNaN(cupCount) || cupCount < 1) {
      return fail(400, { error: 'Cup count must be at least 1' });
    }

    const loggedAt = loggedAtStr ? new Date(loggedAtStr) : new Date();

    await logCoffee({
      user_id: session!.user.id,
      sprint_id: sprintId,
      team_id: teamId,
      coffee_type: coffeeType as any,
      cup_count: cupCount,
      logged_at: loggedAt
    });

    redirect(303, '/');
  }
};
