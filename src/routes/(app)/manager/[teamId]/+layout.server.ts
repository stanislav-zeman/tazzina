import { requireTeamManager } from '$lib/server/guards.js';
import { getTeamById } from '$lib/server/queries/teams.js';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const { teamId } = event.params;
  const session = await requireTeamManager(event, teamId);
  const team = await getTeamById(teamId);
  if (!team) redirect(302, '/');
  return { session, team };
};
