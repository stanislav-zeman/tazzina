import { listUsers } from '$lib/server/queries/users.js';
import { listTeams } from '$lib/server/queries/teams.js';
import { getUserTeams, addMember, removeMember } from '$lib/server/queries/user_teams.js';
import { setRole } from '$lib/server/queries/users.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const [users, teams] = await Promise.all([listUsers(), listTeams()]);

  const usersWithTeams = await Promise.all(
    users.map(async (user) => ({
      ...user,
      teams: await getUserTeams(user.id)
    }))
  );

  return { users: usersWithTeams, teams };
};

export const actions: Actions = {
  setRole: async ({ request }) => {
    const data = await request.formData();
    const userId = data.get('user_id')?.toString();
    const role = data.get('role')?.toString();
    if (!userId || !role || !['admin', 'user'].includes(role)) {
      return fail(400, { error: 'Invalid input' });
    }
    await setRole(userId, role as 'admin' | 'user');
    return { success: true };
  },
  addToTeam: async ({ request }) => {
    const data = await request.formData();
    const userId = data.get('user_id')?.toString();
    const teamId = data.get('team_id')?.toString();
    if (!userId || !teamId) return fail(400, { error: 'Invalid input' });
    await addMember(userId, teamId);
    return { success: true };
  },
  removeFromTeam: async ({ request }) => {
    const data = await request.formData();
    const userId = data.get('user_id')?.toString();
    const teamId = data.get('team_id')?.toString();
    if (!userId || !teamId) return fail(400, { error: 'Invalid input' });
    await removeMember(userId, teamId);
    return { success: true };
  }
};
