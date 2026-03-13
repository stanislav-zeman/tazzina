<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }
  let { data, form }: Props = $props();

  function formatDate(d: Date | string) {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Sprints — Tazzina</title>
</svelte:head>

<div class="space-y-6">
  {#if form?.error}
    <div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{form.error}</div>
  {/if}

  <form method="POST" action="?/create" use:enhance class="rounded-lg border border-border bg-card p-4 space-y-3">
    <h3 class="font-medium text-foreground">Create Sprint</h3>
    <div class="grid grid-cols-3 gap-3">
      <input
        name="name"
        placeholder="Sprint name"
        required
        class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        name="start_date"
        type="date"
        required
        class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <input
        name="end_date"
        type="date"
        required
        class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
    <button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
      Create Sprint
    </button>
  </form>

  <div class="rounded-lg border border-border overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-muted/50">
        <tr>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Start</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">End</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.sprints as sprint}
          {@const now = new Date()}
          {@const start = new Date(sprint.start_date)}
          {@const end = new Date(sprint.end_date)}
          {@const isActive = start <= now && end >= now}
          <tr class="border-t border-border">
            <td class="px-4 py-3 font-medium text-foreground">{sprint.name}</td>
            <td class="px-4 py-3 text-muted-foreground">{formatDate(sprint.start_date)}</td>
            <td class="px-4 py-3 text-muted-foreground">{formatDate(sprint.end_date)}</td>
            <td class="px-4 py-3">
              {#if isActive}
                <span class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>
              {:else if end < now}
                <span class="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Past</span>
              {:else}
                <span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Upcoming</span>
              {/if}
            </td>
            <td class="px-4 py-3">
              <form method="POST" action="?/delete" use:enhance>
                <input type="hidden" name="id" value={sprint.id} />
                <button type="submit" class="px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90">
                  Delete
                </button>
              </form>
            </td>
          </tr>
        {/each}
        {#if data.sprints.length === 0}
          <tr>
            <td colspan="5" class="px-4 py-6 text-center text-muted-foreground text-sm">No sprints yet.</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>
