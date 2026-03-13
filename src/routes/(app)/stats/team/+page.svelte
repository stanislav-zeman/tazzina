<script lang="ts">
  import type { PageData } from './$types';
  import ConsumptionLineChart from '$lib/components/charts/ConsumptionLineChart.svelte';
  import TeamBarChart from '$lib/components/charts/TeamBarChart.svelte';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  const lineChartData = $derived.by(() => {
    const sprints = [...data.sprintSummaries].reverse();
    const color = sprints[0]?.chart_color ?? data.teams.find((t) => t.id === data.selectedTeamId)?.chart_color ?? '#3b82f6';
    return {
      labels: sprints.map((s) => s.sprint_name),
      datasets: [
        {
          label: data.teams.find((t) => t.id === data.selectedTeamId)?.name ?? 'Team',
          data: sprints.map((s) => s.total_cups),
          borderColor: color,
          backgroundColor: color + '1a',
          tension: 0.3
        }
      ]
    };
  });

  const leaderboard = $derived.by(() => {
    const totals = new Map<string, { name: string; avatar: string | null; color: string; cups: number }>();
    for (const s of data.userStats) {
      if (!totals.has(s.user_id)) {
        totals.set(s.user_id, { name: s.user_name, avatar: s.user_avatar_url, color: s.chart_color, cups: 0 });
      }
      totals.get(s.user_id)!.cups += s.total_cups;
    }
    return [...totals.values()].sort((a, b) => b.cups - a.cups);
  });

  const barChartData = $derived.by(() => ({
    labels: leaderboard.map((m) => m.name),
    datasets: [
      {
        label: 'Total Cups',
        data: leaderboard.map((m) => m.cups),
        backgroundColor: leaderboard.map((m) => m.color)
      }
    ]
  }));
</script>

<svelte:head>
  <title>Team Stats — Tazzina</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex justify-end">
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

  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">Progress Over Time</h2>
    {#if data.sprintSummaries.length > 0}
      <ConsumptionLineChart chartData={lineChartData} />
    {:else}
      <p class="text-muted-foreground text-sm">No sprint data yet.</p>
    {/if}
  </div>

  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">
      Cups per Person — {data.selectedSprintName || 'Latest Sprint'}
    </h2>
    {#if leaderboard.length > 0}
      <TeamBarChart chartData={barChartData} />
    {:else}
      <p class="text-muted-foreground text-sm">No data for this sprint.</p>
    {/if}
  </div>

  <div class="rounded-lg border border-border bg-card p-6">
    <h2 class="text-lg font-semibold mb-4">
      Leaderboard — {data.selectedSprintName || 'Latest Sprint'}
    </h2>
    {#if leaderboard.length > 0}
      <div class="space-y-2">
        {#each leaderboard as member, i}
          <div class="flex items-center gap-3 py-2 {i < leaderboard.length - 1 ? 'border-b border-border' : ''}">
            <span class="w-6 text-sm font-medium text-muted-foreground">{i + 1}.</span>
            {#if member.avatar}
              <img src={member.avatar} alt={member.name} class="w-7 h-7 rounded-full" />
            {:else}
              <div class="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {member.name[0]}
              </div>
            {/if}
            <span class="flex-1 text-sm font-medium">{member.name}</span>
            <span class="text-sm font-semibold">{member.cups} cups</span>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-muted-foreground text-sm">No data for this sprint.</p>
    {/if}
  </div>
</div>
