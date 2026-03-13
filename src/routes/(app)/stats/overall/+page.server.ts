import { getAllTeamsSprintSummaries } from "$lib/server/queries/coffee_logs.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ url }: { url: URL }) => {
  const summaries = await getAllTeamsSprintSummaries();

  const sprintNames = [...new Set(summaries.map((s) => s.sprint_name))];
  const requestedSprint = url.searchParams.get("sprint");
  const selectedSprintName =
    requestedSprint && sprintNames.includes(requestedSprint)
      ? requestedSprint
      : (sprintNames[0] ?? "");

  return { summaries, sprintNames, selectedSprintName };
};
