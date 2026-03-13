<script lang="ts">
  import { page } from '$app/stores';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }
  let { children }: Props = $props();
</script>

<div class="space-y-6">
  <div class="flex items-center gap-4 border-b border-border pb-4">
    <h1 class="text-2xl font-bold text-foreground">Statistics</h1>
    <nav class="flex gap-2">
      <a
        href="/stats/team"
        class="px-3 py-1.5 rounded text-sm {$page.url.pathname.startsWith('/stats/team') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
      >Team</a>
      <a
        href="/stats/overall"
        class="px-3 py-1.5 rounded text-sm {$page.url.pathname.startsWith('/stats/overall') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
      >Overall</a>
    </nav>
  </div>
  {@render children()}
</div>
