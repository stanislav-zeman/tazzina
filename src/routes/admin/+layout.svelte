<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
</script>

<div class="space-y-6">
  <nav class="flex gap-4 border-b border-border pb-4">
    <a href="/admin/users" class="text-sm font-medium hover:text-foreground text-muted-foreground">Users</a>
    <a href="/admin/teams" class="text-sm font-medium hover:text-foreground text-muted-foreground">Teams</a>
    <a href="/admin/sprints" class="text-sm font-medium hover:text-foreground text-muted-foreground">Sprints</a>
  </nav>
  {@render children()}
</div>
