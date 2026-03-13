import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function requireAuth(event: RequestEvent) {
  const session = await event.locals.auth();
  if (!session?.user) {
    redirect(303, '/login');
  }
  return session;
}

export async function requireAdmin(event: RequestEvent) {
  const session = await requireAuth(event);
  if (session.user.role !== 'admin') {
    redirect(303, '/');
  }
  return session;
}
