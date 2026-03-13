import { requireAuth } from '$lib/server/guards.js';
import { getManagedTeams } from '$lib/server/queries/user_teams.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const session = await requireAuth(event);
  const managedTeams = await getManagedTeams(session.user.id);
  return { session, managedTeams };
};
