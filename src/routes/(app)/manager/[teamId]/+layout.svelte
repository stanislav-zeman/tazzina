<script lang="ts">
  import { page } from '$app/stores';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    data: { team: { id: string; name: string } };
  }
  let { children, data }: Props = $props();
</script>

<div class="space-y-6">
  <div class="flex items-center gap-4 border-b border-border pb-4">
    <h2 class="text-xl font-semibold text-foreground">{data.team.name}</h2>
    <nav class="flex gap-2">
      <a
        href="/manager/{data.team.id}/members"
        class="px-3 py-1.5 rounded text-sm {$page.url.pathname.includes('/members') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
      >Members</a>
      <a
        href="/manager/{data.team.id}/sprints"
        class="px-3 py-1.5 rounded text-sm {$page.url.pathname.includes('/sprints') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
      >Sprints</a>
    </nav>
  </div>
  {@render children()}
</div>
