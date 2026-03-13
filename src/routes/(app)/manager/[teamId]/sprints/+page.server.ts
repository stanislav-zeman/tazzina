import {
  listSprints,
  createSprint,
  deleteSprint,
} from "$lib/server/queries/sprints.js";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const sprints = await listSprints(params.teamId);
  return { sprints };
};

export const actions: Actions = {
  create: async ({ request, params }) => {
    const data = await request.formData();
    const name = data.get("name")?.toString()?.trim();
    const start_date = data.get("start_date")?.toString();
    const end_date = data.get("end_date")?.toString();

    if (!name || !start_date || !end_date) {
      return fail(400, { error: "All fields are required" });
    }
    if (end_date < start_date) {
      return fail(400, { error: "End date must be on or after start date" });
    }

    await createSprint({ team_id: params.teamId, name, start_date, end_date });
    return { success: true };
  },
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id")?.toString();
    if (!id) return fail(400, { error: "Invalid input" });
    await deleteSprint(id);
    return { success: true };
  },
};
