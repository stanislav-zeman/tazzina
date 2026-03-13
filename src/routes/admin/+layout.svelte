<script lang="ts">
  import Navbar from '$lib/components/layout/Navbar.svelte';
  import Sidebar from '$lib/components/layout/Sidebar.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
    data: { session: App.PageData['session']; managedTeams: import('$lib/types').Team[] };
  }
  let { children, data }: Props = $props();
</script>

<div class="min-h-screen bg-background">
  <Navbar session={data.session} />
  <div class="flex">
    <Sidebar session={data.session} managedTeams={data.managedTeams} />
    <main class="flex-1 p-6">
      {@render children()}
    </main>
  </div>
</div>
