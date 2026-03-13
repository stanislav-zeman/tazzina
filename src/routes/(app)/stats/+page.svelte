<script lang="ts">
  import { browser } from '$app/environment';
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  // Build line chart data: teams x sprints
  const lineChartData = $derived(() => {
    const teamMap = new Map<string, { name: string; data: Map<string, number> }>();
    for (const s of data.summaries) {
      if (!teamMap.has(s.team_id)) {
        teamMap.set(s.team_id, { name: s.team_name, data: new Map() });
      }
      teamMap.get(s.team_id)!.data.set(s.sprint_name, s.total_cups);
    }

    const allSprints = [...new Set(data.summaries.map((s) => s.sprint_name))].reverse();
    const datasets = [...teamMap.values()].map((team, i) => ({
      label: team.name,
      data: allSprints.map((sprint) => team.data.get(sprint) ?? 0),
      borderColor: `hsl(${(i * 60) % 360}, 70%, 50%)`,
      backgroundColor: `hsla(${(i * 60) % 360}, 70%, 50%, 0.1)`,
      tension: 0.3
    }));

    return { labels: allSprints, datasets };
  });

  // Bar chart: per-user totals
  const barChartData = $derived(() => {
    const users = [...new Map(data.userStats.map((u) => [u.user_id, u.user_name])).entries()];
    const totals = data.userStats.reduce(
      (acc, s) => {
        acc[s.user_id] = (acc[s.user_id] ?? 0) + s.total_cups;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      labels: users.map(([, name]) => name),
      datasets: [
        {
          label: 'Cups',
          data: users.map(([id]) => totals[id] ?? 0),
          backgroundColor: 'hsl(25, 70%, 50%)'
        }
      ]
    };
  });
</script>

<svelte:head>
  <title>Stats — Tazzina</title>
</svelte:head>

<div class="space-y-6">
  <h1 class="text-2xl font-bold text-foreground">Statistics</h1>

  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">Cups per Sprint (all teams)</h2>
    {#if browser && data.summaries.length > 0}
      {#await import('$lib/components/charts/ConsumptionLineChart.svelte') then { default: Chart }}
        <Chart chartData={lineChartData()} />
      {/await}
    {:else if data.summaries.length === 0}
      <p class="text-muted-foreground text-sm">No data yet.</p>
    {:else}
      <p class="text-muted-foreground text-sm">Loading chart...</p>
    {/if}
  </div>

  <div class="rounded-lg border border-border bg-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Per-User — {data.selectedSprintName || 'Latest Sprint'}</h2>
      <form method="GET">
        <select
          name="team"
          onchange={(e) => (e.currentTarget as HTMLSelectElement).form?.submit()}
          class="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          {#each data.teams as team}
            <option value={team.id} selected={team.id === data.selectedTeamId}>{team.name}</option>
          {/each}
        </select>
      </form>
    </div>
    {#if browser && data.userStats.length > 0}
      {#await import('$lib/components/charts/TeamBarChart.svelte') then { default: Chart }}
        <Chart chartData={barChartData()} />
      {/await}
    {:else if data.userStats.length === 0}
      <p class="text-muted-foreground text-sm">No data for this sprint.</p>
    {:else}
      <p class="text-muted-foreground text-sm">Loading chart...</p>
    {/if}
  </div>
</div>
