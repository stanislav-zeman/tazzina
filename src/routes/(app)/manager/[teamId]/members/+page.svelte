<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  interface Props {
    data: PageData;
    form: ActionData;
  }
  let { data, form }: Props = $props();
</script>

<svelte:head>
  <title>Members — Tazzina</title>
</svelte:head>

<div class="space-y-6">
  {#if form?.error}
    <div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{form.error}</div>
  {/if}

  <form method="POST" action="?/add" use:enhance class="flex gap-2">
    <select name="user_id" class="rounded-md border border-input bg-background px-3 py-2 text-sm flex-1">
      {#each data.nonMembers as user}
        <option value={user.id}>{user.name} ({user.email})</option>
      {/each}
    </select>
    <button type="submit" class="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90" disabled={data.nonMembers.length === 0}>
      Add Member
    </button>
  </form>

  <div class="rounded-lg border border-border overflow-hidden">
    <table class="w-full text-sm">
      <thead class="bg-muted/50">
        <tr>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
          <th class="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each data.members as member}
          <tr class="border-t border-border">
            <td class="px-4 py-3 font-medium text-foreground">{member.name}</td>
            <td class="px-4 py-3 text-muted-foreground">{member.email}</td>
            <td class="px-4 py-3">
              <form method="POST" action="?/remove" use:enhance>
                <input type="hidden" name="user_id" value={member.id} />
                <button type="submit" class="px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs hover:bg-destructive/90">
                  Remove
                </button>
              </form>
            </td>
          </tr>
        {/each}
        {#if data.members.length === 0}
          <tr>
            <td colspan="3" class="px-4 py-6 text-center text-muted-foreground text-sm">No members yet.</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>
