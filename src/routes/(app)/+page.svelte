<script lang="ts">
  import type { PageData } from './$types';

  interface Props {
    data: PageData;
  }
  let { data }: Props = $props();

  function formatDate(d: Date | string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Dashboard — Tazzina</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
    <a
      href="/log"
      class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm font-medium"
    >
      ☕ Log Coffee
    </a>
  </div>

  {#if data.activeSprints.length === 0}
    <div class="rounded-lg border border-border bg-card p-8 text-center">
      <p class="text-muted-foreground">No active sprints. Ask an admin to create one.</p>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each data.activeSprints as sprint}
        <div class="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">{sprint.team_name}</p>
              <h3 class="mt-1 text-lg font-semibold text-foreground">{sprint.name}</h3>
            </div>
            <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>
          </div>
          <div class="mt-4">
            <p class="text-3xl font-bold text-foreground">{sprint.total_cups}</p>
            <p class="text-sm text-muted-foreground">cups this sprint</p>
          </div>
          <div class="mt-4 text-xs text-muted-foreground">
            {formatDate(sprint.start_date)} — {formatDate(sprint.end_date)}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
