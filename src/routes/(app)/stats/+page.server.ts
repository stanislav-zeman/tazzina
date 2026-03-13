import { listTeams } from '$lib/server/queries/teams.js';
import { getAllTeamsSprintSummaries } from '$lib/server/queries/coffee_logs.js';
import { listSprints } from '$lib/server/queries/sprints.js';
import { getUserStatsForSprint } from '$lib/server/queries/coffee_logs.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const teams = await listTeams();
  const summaries = await getAllTeamsSprintSummaries();

  // For bar chart: select first team's most recent sprint by default
  const selectedTeamId = url.searchParams.get('team') ?? teams[0]?.id ?? '';
  let userStats: Awaited<ReturnType<typeof getUserStatsForSprint>> = [];
  let selectedSprintName = '';

  if (selectedTeamId) {
    const sprints = await listSprints(selectedTeamId);
    const sprint = sprints[0];
    if (sprint) {
      userStats = await getUserStatsForSprint(sprint.id);
      selectedSprintName = sprint.name;
    }
  }

  return {
    teams,
    summaries,
    userStats,
    selectedTeamId,
    selectedSprintName
  };
};
