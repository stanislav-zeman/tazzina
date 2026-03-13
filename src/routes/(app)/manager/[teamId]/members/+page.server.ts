import { listUsers } from '$lib/server/queries/users.js';
import { getTeamMembers, addMember, removeMember } from '$lib/server/queries/user_teams.js';
import { updateTeamChartColor } from '$lib/server/queries/teams.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const [members, allUsers] = await Promise.all([
    getTeamMembers(params.teamId),
    listUsers()
  ]);
  const nonMembers = allUsers.filter((u) => !members.find((m) => m.id === u.id));
  return { members, nonMembers };
};

export const actions: Actions = {
  add: async ({ request, params }) => {
    const data = await request.formData();
    const userId = data.get('user_id')?.toString();
    if (!userId) return fail(400, { error: 'Invalid input' });
    await addMember(userId, params.teamId);
    return { success: true };
  },
  remove: async ({ request, params }) => {
    const data = await request.formData();
    const userId = data.get('user_id')?.toString();
    if (!userId) return fail(400, { error: 'Invalid input' });
    await removeMember(userId, params.teamId);
    return { success: true };
  },
  updateColor: async ({ request, params }) => {
    const formData = await request.formData();
    const color = formData.get('color') as string;
    await updateTeamChartColor(params.teamId, color);
  }
};
