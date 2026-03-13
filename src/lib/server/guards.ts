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

export async function requireTeamManager(event: RequestEvent, teamId: string) {
  const session = await requireAuth(event);
  if (session.user.role === 'admin') return session;
  const { isTeamManager } = await import('./queries/user_teams.js');
  const manages = await isTeamManager(session.user.id, teamId);
  if (!manages) redirect(303, '/');
  return session;
}
