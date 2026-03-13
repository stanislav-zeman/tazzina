import { listTeams, createTeam, renameTeam, deleteTeam } from '$lib/server/queries/teams.js';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const teams = await listTeams();
  return { teams };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name')?.toString()?.trim();
    if (!name) return fail(400, { error: 'Name is required' });
    try {
      await createTeam(name);
    } catch {
      return fail(400, { error: 'A team with that name already exists' });
    }
    return { success: true };
  },
  rename: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id')?.toString();
    const name = data.get('name')?.toString()?.trim();
    if (!id || !name) return fail(400, { error: 'Invalid input' });
    await renameTeam(id, name);
    return { success: true };
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id')?.toString();
    if (!id) return fail(400, { error: 'Invalid input' });
    await deleteTeam(id);
    return { success: true };
  }
};
