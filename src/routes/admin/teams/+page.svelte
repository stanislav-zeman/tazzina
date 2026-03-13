<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }
  let { data, form }: Props = $props();

  let deleteId = $state<string | null>(null);
</script>

<svelte:head>
  <title>Manage Teams — Tazzina Admin</title>
</svelte:head>

<div class="space-y-6">
  <h2 class="text-xl font-semibold text-foreground">Teams</h2>

  {#if form?.error}
    <div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{form.error}</div>
  {/if}

  <form method="POST" action="?/create" use:enhance class="flex gap-2">
    <input
      name="name"
      placeholder="New team name"
      required
      class="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring flex-1"
    />
    <button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
      Create Team
    </button>
  </form>

  <div class="rounded-lg border border-border overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-muted/50">
        <tr>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.teams as team}
          <tr class="border-t border-border">
            <td class="px-4 py-3 text-foreground">{team.name}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2 items-center">
                <a
                  href="/admin/sprints?team={team.id}"
                  class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80"
                >
                  Sprints
                </a>
                <form method="POST" action="?/rename" use:enhance class="flex gap-2">
                  <input type="hidden" name="id" value={team.id} />
                  <input
                    name="name"
                    value={team.name}
                    class="rounded border border-input bg-background px-2 py-1 text-xs w-32"
                  />
                  <button type="submit" class="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs hover:bg-secondary/80">
                    Rename
                  </button>
                </form>
                <button
                  onclick={() => (deleteId = team.id)}
                  class="px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

{#if deleteId}
  {@const team = data.teams.find((t) => t.id === deleteId)}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-card rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
      <h3 class="text-lg font-semibold text-foreground mb-2">Delete Team</h3>
      <p class="text-sm text-muted-foreground mb-4">
        Are you sure you want to delete <strong>{team?.name}</strong>? This will also delete all sprints and coffee logs for this team.
      </p>
      <div class="flex gap-2 justify-end">
        <button
          onclick={() => (deleteId = null)}
          class="px-3 py-1.5 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80"
        >
          Cancel
        </button>
        <form method="POST" action="?/delete" use:enhance onsubmit={() => (deleteId = null)}>
          <input type="hidden" name="id" value={deleteId} />
          <button type="submit" class="px-3 py-1.5 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90">
            Delete
          </button>
        </form>
      </div>
    </div>
  </div>
{/if}
