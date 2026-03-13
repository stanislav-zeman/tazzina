<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  let expandedTeams = $state<Set<string>>(new Set());

  function toggleTeams(userId: string) {
    const next = new Set(expandedTeams);
    if (next.has(userId)) {
      next.delete(userId);
    } else {
      next.add(userId);
    }
    expandedTeams = next;
  }
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
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Add to team</th>
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
              {#if user.teams.length > 0}
                <button
                  type="button"
                  onclick={() => toggleTeams(user.id)}
                  class="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {user.teams.length} team{user.teams.length !== 1 ? 's' : ''}
                  <span class="text-[10px]">{expandedTeams.has(user.id) ? '▲' : '▼'}</span>
                </button>
              {:else}
                <span class="text-xs text-muted-foreground">—</span>
              {/if}
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
          {#if expandedTeams.has(user.id)}
            <tr class="border-t border-border bg-muted/30">
              <td colspan="4" class="px-6 py-3">
                <table class="text-xs w-full max-w-sm">
                  <thead>
                    <tr class="text-muted-foreground">
                      <th class="text-left font-normal pb-2 pr-8">Team</th>
                      <th class="text-left font-normal pb-2 pr-8">Manager</th>
                      <th class="text-left font-normal pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each user.teams as team}
                      <tr>
                        <td class="pr-8 py-1">{team.name}</td>
                        <td class="pr-8 py-1">
                          <form method="POST" action="?/setTeamManager" use:enhance>
                            <input type="hidden" name="user_id" value={user.id} />
                            <input type="hidden" name="team_id" value={team.id} />
                            <input type="hidden" name="is_manager" value={team.is_manager ? 'false' : 'true'} />
                            <button
                              type="submit"
                              title={team.is_manager ? 'Remove as manager' : 'Make manager'}
                              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors {team.is_manager ? 'bg-primary' : 'bg-input border border-border'}"
                            >
                              <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform {team.is_manager ? 'translate-x-4' : 'translate-x-1'}"></span>
                            </button>
                          </form>
                        </td>
                        <td class="py-1">
                          <form method="POST" action="?/removeFromTeam" use:enhance>
                            <input type="hidden" name="user_id" value={user.id} />
                            <input type="hidden" name="team_id" value={team.id} />
                            <button type="submit" class="hover:text-destructive text-muted-foreground">×</button>
                          </form>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
</div>
