<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }
  let { data, form }: Props = $props();

  let selectedTeamId = $state('');
  let selectedSprintId = $state('');

  $effect(() => {
    if (selectedTeamId) {
      const team = data.teams.find((t) => t.id === selectedTeamId);
      selectedSprintId = team?.activeSprint?.id ?? '';
    }
  });

  const teamsWithActiveSpints = $derived(data.teams.filter((t) => t.activeSprint));

  function now() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }
</script>

<svelte:head>
  <title>Log Coffee — Tazzina</title>
</svelte:head>

<div class="max-w-lg mx-auto space-y-6">
  <h1 class="text-2xl font-bold text-foreground">Log Coffee</h1>

  {#if form?.error}
    <div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{form.error}</div>
  {/if}

  {#if teamsWithActiveSpints.length === 0}
    <div class="rounded-lg border border-border bg-card p-8 text-center">
      <p class="text-muted-foreground">You're not part of any team with an active sprint.</p>
    </div>
  {:else}
    <form method="POST" use:enhance class="space-y-4 rounded-lg border border-border bg-card p-6">
      <div class="space-y-2">
        <label for="team_id" class="text-sm font-medium text-foreground">Team</label>
        <select
          id="team_id"
          name="team_id"
          bind:value={selectedTeamId}
          required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select a team</option>
          {#each teamsWithActiveSpints as team}
            <option value={team.id}>{team.name}</option>
          {/each}
        </select>
      </div>

      <input type="hidden" name="sprint_id" value={selectedSprintId} />

      {#if selectedTeamId}
        {@const team = data.teams.find((t) => t.id === selectedTeamId)}
        {#if team?.activeSprint}
          <p class="text-sm text-muted-foreground">Sprint: <strong>{team.activeSprint.name}</strong></p>
        {/if}
      {/if}

      <div class="space-y-2">
        <label for="coffee_type" class="text-sm font-medium text-foreground">Coffee Type</label>
        <select
          id="coffee_type"
          name="coffee_type"
          required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Select type</option>
          {#each data.coffeeTypes as ct}
            <option value={ct.value}>{ct.label}</option>
          {/each}
        </select>
      </div>

      <div class="space-y-2">
        <label for="cup_count" class="text-sm font-medium text-foreground">Cups</label>
        <input
          id="cup_count"
          name="cup_count"
          type="number"
          min="1"
          max="20"
          value="1"
          required
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div class="space-y-2">
        <label for="logged_at" class="text-sm font-medium text-foreground">When</label>
        <input
          id="logged_at"
          name="logged_at"
          type="datetime-local"
          value={now()}
          class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        type="submit"
        class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
      >
        Log Coffee ☕
      </button>
    </form>
  {/if}
</div>
