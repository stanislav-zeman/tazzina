import { requireAuth } from '$lib/server/guards.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  const session = await requireAuth(event);
  return { session };
};
