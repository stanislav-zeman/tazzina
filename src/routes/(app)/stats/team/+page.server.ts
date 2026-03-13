import { listTeams } from '$lib/server/queries/teams.js';
import { aggregateByTeamSprint, getUserStatsForSprint } from '$lib/server/queries/coffee_logs.js';
import { listSprints } from '$lib/server/queries/sprints.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
  const teams = await listTeams();
  const selectedTeamId = url.searchParams.get('team') ?? teams[0]?.id ?? '';

  let sprintSummaries: Awaited<ReturnType<typeof aggregateByTeamSprint>> = [];
  let userStats: Awaited<ReturnType<typeof getUserStatsForSprint>> = [];
  let selectedSprintName = '';

  if (selectedTeamId) {
    sprintSummaries = await aggregateByTeamSprint(selectedTeamId);
    const sprints = await listSprints(selectedTeamId);
    const latestSprint = sprints[0];
    if (latestSprint) {
      userStats = await getUserStatsForSprint(latestSprint.id);
      selectedSprintName = latestSprint.name;
    }
  }

  return {
    teams,
    selectedTeamId,
    sprintSummaries,
    userStats,
    selectedSprintName
  };
};
