import { listTeams } from "$lib/server/queries/teams.js";
import {
  aggregateByTeamSprint,
  getUserStatsForSprint,
} from "$lib/server/queries/coffee_logs.js";
import { listSprints, getActiveSprint } from "$lib/server/queries/sprints.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
  const teams = await listTeams();
  const selectedTeamId = url.searchParams.get("team") ?? teams[0]?.id ?? "";

  let sprintSummaries: Awaited<ReturnType<typeof aggregateByTeamSprint>> = [];
  let selectedSprintName = "";
  let selectedSprintId = "";
  let sprints: Awaited<ReturnType<typeof listSprints>> = [];

  let allUserStats: Record<
    string,
    Awaited<ReturnType<typeof getUserStatsForSprint>>
  > = {};

  if (selectedTeamId) {
    [sprintSummaries, sprints] = await Promise.all([
      aggregateByTeamSprint(selectedTeamId),
      listSprints(selectedTeamId),
    ]);

    const activeSprint = await getActiveSprint(selectedTeamId);
    const defaultSprint = activeSprint ?? sprints[0] ?? null;
    const requestedSprintId = url.searchParams.get("sprint");
    const selectedSprint =
      (requestedSprintId
        ? sprints.find((s) => s.id === requestedSprintId)
        : null) ?? defaultSprint;

    if (selectedSprint) {
      selectedSprintName = selectedSprint.name;
      selectedSprintId = selectedSprint.id;
    }

    allUserStats = Object.fromEntries(
      await Promise.all(
        sprints.map(async (s) => [s.id, await getUserStatsForSprint(s.id)]),
      ),
    );
  }

  return {
    teams,
    selectedTeamId,
    sprintSummaries,
    allUserStats,
    selectedSprintName,
    selectedSprintId,
    sprints,
  };
};
