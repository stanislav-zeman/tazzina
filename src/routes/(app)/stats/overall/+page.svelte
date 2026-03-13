<script lang="ts">
  import type { PageData } from './$types';
  import ConsumptionLineChart from '$lib/components/charts/ConsumptionLineChart.svelte';
  import TeamBarChart from '$lib/components/charts/TeamBarChart.svelte';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  const lineChartData = $derived.by(() => {
    const teamMap = new Map<string, { name: string; color: string; data: Map<string, number> }>();
    for (const s of data.summaries) {
      if (!teamMap.has(s.team_id)) {
        teamMap.set(s.team_id, { name: s.team_name, color: s.chart_color, data: new Map() });
      }
      teamMap.get(s.team_id)!.data.set(s.sprint_name, s.total_cups);
    }

    const allSprints = [...new Set(data.summaries.map((s) => s.sprint_name))].reverse();
    const datasets = [...teamMap.values()].map((team) => ({
      label: team.name,
      data: allSprints.map((sprint) => team.data.get(sprint) ?? 0),
      borderColor: team.color,
      backgroundColor: team.color + '1a',
      tension: 0.3
    }));

    return { labels: allSprints, datasets };
  });

  const barChartData = $derived.by(() => ({
    labels: data.teamTotals.map((t) => t.team_name),
    datasets: [
      {
        label: 'Total Cups',
        data: data.teamTotals.map((t) => t.total_cups),
        backgroundColor: data.teamTotals.map((t) => t.chart_color)
      }
    ]
  }));
</script>

<svelte:head>
  <title>Overall Stats — Tazzina</title>
</svelte:head>

<div class="space-y-6">
  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">Cups per Sprint (All Teams)</h2>
    {#if data.summaries.length > 0}
      <ConsumptionLineChart chartData={lineChartData} />
    {:else}
      <p class="text-muted-foreground text-sm">No data yet.</p>
    {/if}
  </div>

  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">Total Cups by Team</h2>
    {#if data.teamTotals.length > 0}
      <TeamBarChart chartData={barChartData} />
    {:else}
      <p class="text-muted-foreground text-sm">No data yet.</p>
    {/if}
  </div>

  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">Team Rankings</h2>
    {#if data.teamTotals.length > 0}
      <div class="space-y-2">
        {#each data.teamTotals as team, i}
          <div class="flex items-center gap-3 py-2 {i < data.teamTotals.length - 1 ? 'border-b border-border' : ''}">
            <span class="w-6 text-sm font-medium text-muted-foreground">{i + 1}.</span>
            <span class="flex-1 text-sm font-medium">{team.team_name}</span>
            <span class="text-xs text-muted-foreground mr-4">{team.sprint_count} sprints</span>
            <span class="text-sm font-semibold">{team.total_cups} cups</span>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-muted-foreground text-sm">No data yet.</p>
    {/if}
  </div>
</div>
