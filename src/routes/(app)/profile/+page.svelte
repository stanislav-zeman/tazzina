<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  // Aggregate stats by sprint
  const sprintTotals = $derived(() => {
    const map = new Map<string, { sprint_name: string; team_name: string; total_cups: number }>();
    for (const s of data.stats) {
      const key = s.sprint_id;
      if (!map.has(key)) {
        map.set(key, { sprint_name: s.sprint_name, team_name: s.team_name, total_cups: 0 });
      }
      map.get(key)!.total_cups += s.total_cups;
    }
    return [...map.values()];
  });
</script>

<svelte:head>
  <title>Profile — Tazzina</title>
</svelte:head>

<div class="max-w-2xl space-y-6">
  <h1 class="text-2xl font-bold text-foreground">Profile</h1>

  <div class="rounded-lg border border-border bg-card p-6">
    <div class="flex items-center gap-4">
      {#if data.session?.user?.image}
        <img src={data.session.user.image} alt={data.session.user.name ?? ''} class="h-16 w-16 rounded-full" />
      {:else}
        <div class="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl">
          {(data.session?.user?.name ?? '?')[0]}
        </div>
      {/if}
      <div>
        <p class="text-lg font-semibold text-foreground">{data.session?.user?.name}</p>
        <p class="text-sm text-muted-foreground">{data.session?.user?.email}</p>
        <span class="inline-flex mt-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
          {data.session?.user?.role ?? 'user'}
        </span>
      </div>
    </div>
  </div>

  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">Teams</h2>
    {#if data.teams.length === 0}
      <p class="text-sm text-muted-foreground">Not a member of any team yet.</p>
    {:else}
      <ul class="space-y-2">
        {#each data.teams as team}
          <li class="flex items-center gap-2 text-sm text-foreground">
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            {team.name}
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">My Coffee History</h2>
    {#if sprintTotals().length === 0}
      <p class="text-sm text-muted-foreground">No coffee logged yet. Go log some!</p>
    {:else}
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border">
            <th class="pb-2 text-left text-muted-foreground font-medium">Sprint</th>
            <th class="pb-2 text-left text-muted-foreground font-medium">Team</th>
            <th class="pb-2 text-right text-muted-foreground font-medium">Cups</th>
          </tr>
        </thead>
        <tbody>
          {#each sprintTotals() as row}
            <tr class="border-b border-border/50">
              <td class="py-2 text-foreground">{row.sprint_name}</td>
              <td class="py-2 text-muted-foreground">{row.team_name}</td>
              <td class="py-2 text-right font-medium text-foreground">{row.total_cups}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
