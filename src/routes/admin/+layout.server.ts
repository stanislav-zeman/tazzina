import { requireAdmin } from '$lib/server/guards.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const session = await requireAdmin(event);
  return { session };
};
