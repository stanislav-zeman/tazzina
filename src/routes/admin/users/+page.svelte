<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();
</script>

<svelte:head>
  <title>Manage Users — Tazzina Admin</title>
</svelte:head>

<div class="space-y-4">
  <h2 class="text-xl font-semibold text-foreground">Users</h2>

  <div class="rounded-lg border border-border overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-muted/50">
        <tr>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Teams</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.users as user}
          <tr class="border-t border-border">
            <td class="px-4 py-3">
              <div class="font-medium text-foreground">{user.name}</div>
              <div class="text-muted-foreground text-xs">{user.email}</div>
            </td>
            <td class="px-4 py-3">
              <form method="POST" action="?/setRole" use:enhance>
                <input type="hidden" name="user_id" value={user.id} />
                <select
                  name="role"
                  onchange={(e) => (e.currentTarget as HTMLSelectElement).form?.submit()}
                  class="rounded border border-input bg-background px-2 py-1 text-xs"
                >
                  <option value="user" selected={user.role === 'user'}>user</option>
                  <option value="admin" selected={user.role === 'admin'}>admin</option>
                </select>
              </form>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-wrap gap-1">
                {#each user.teams as team}
                  <form method="POST" action="?/removeFromTeam" use:enhance class="inline">
                    <input type="hidden" name="user_id" value={user.id} />
                    <input type="hidden" name="team_id" value={team.id} />
                    <button type="submit" class="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs hover:bg-destructive/20">
                      {team.name} ×
                    </button>
                  </form>
                {/each}
              </div>
            </td>
            <td class="px-4 py-3">
              <form method="POST" action="?/addToTeam" use:enhance class="flex gap-2">
                <input type="hidden" name="user_id" value={user.id} />
                <select name="team_id" class="rounded border border-input bg-background px-2 py-1 text-xs">
                  {#each data.teams.filter((t) => !user.teams.find((ut) => ut.id === t.id)) as team}
                    <option value={team.id}>{team.name}</option>
                  {/each}
                </select>
                <button type="submit" class="px-2 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90">
                  Add
                </button>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
