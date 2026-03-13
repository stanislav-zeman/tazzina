<script lang="ts">
  import type { PageData } from './$types';
  import ConsumptionLineChart from '$lib/components/charts/ConsumptionLineChart.svelte';
  import TeamBarChart from '$lib/components/charts/TeamBarChart.svelte';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  let selectedSprintName = $state(data.selectedSprintName);

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

  const sprintTeamTotals = $derived.by(() => {
    const filtered = data.summaries.filter((s) => s.sprint_name === selectedSprintName);
    const teamMap = new Map<string, { name: string; color: string; cups: number }>();
    for (const s of filtered) {
      if (!teamMap.has(s.team_id)) {
        teamMap.set(s.team_id, { name: s.team_name, color: s.chart_color, cups: 0 });
      }
      teamMap.get(s.team_id)!.cups += s.total_cups;
    }
    return [...teamMap.values()].sort((a, b) => b.cups - a.cups);
  });

  const barChartData = $derived.by(() => ({
    labels: sprintTeamTotals.map((t) => t.name),
    datasets: [
      {
        label: 'Total Cups',
        data: sprintTeamTotals.map((t) => t.cups),
        backgroundColor: sprintTeamTotals.map((t) => t.color)
      }
    ]
  }));
</script>

<svelte:head>
  <title>Overall Stats — Tazzina</title>
</svelte:head>

<div class="space-y-6">
  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">Progress Over Time</h2>
    {#if data.summaries.length > 0}
      <ConsumptionLineChart chartData={lineChartData} />
    {:else}
      <p class="text-muted-foreground text-sm">No data yet.</p>
    {/if}
  </div>

  <div class="rounded-lg border border-border bg-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Sprint Report</h2>
      {#if data.sprintNames.length > 1}
        <select
          bind:value={selectedSprintName}
          onchange={() => {
            const u = new URL(window.location.href);
            u.searchParams.set('sprint', selectedSprintName);
            history.replaceState({}, '', u.toString());
          }}
          class="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
        >
          {#each data.sprintNames as name}
            <option value={name}>{name}</option>
          {/each}
        </select>
      {:else if selectedSprintName}
        <span class="text-sm text-muted-foreground">{selectedSprintName}</span>
      {/if}
    </div>

    {#if sprintTeamTotals.length > 0}
      <div class="space-y-6">
        <TeamBarChart chartData={barChartData} />

        <div class="space-y-2">
          {#each sprintTeamTotals as team, i}
            <div class="flex items-center gap-3 py-2 {i < sprintTeamTotals.length - 1 ? 'border-b border-border' : ''}">
              <span class="w-6 text-sm font-medium text-muted-foreground">{i + 1}.</span>
              <span class="flex-1 text-sm font-medium">{team.name}</span>
              <span class="text-sm font-semibold">{team.cups} cups</span>
            </div>
          {/each}
        </div>
      </div>
    {:else}
      <p class="text-muted-foreground text-sm">No data for this sprint.</p>
    {/if}
  </div>
</div>
