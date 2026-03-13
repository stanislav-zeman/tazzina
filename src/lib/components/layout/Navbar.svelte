<script lang="ts">
  import { signOut } from '@auth/sveltekit/client';
  import type { Session } from '@auth/sveltekit';
  import { Coffee } from 'lucide-svelte';

  interface Props {
    session: Session | null | undefined;
  }
  let { session }: Props = $props();
</script>

<header class="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
  <a href="/" class="flex items-center gap-2 font-bold text-foreground text-lg">
    <Coffee size={20} />
    <span>Tazzina</span>
  </a>
  <div class="flex items-center gap-4">
    {#if session?.user}
      <a href="/profile" class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-md">
        {#if session.user.image}
          <img src={session.user.image} alt={session.user.name ?? ''} class="h-6 w-6 rounded-full" />
        {/if}
        {session.user.name}
      </a>
      <button
        onclick={() => signOut({ redirectTo: '/login' })}
        class="text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-3 py-1.5 rounded-md"
      >
        Sign out
      </button>
    {/if}
  </div>
</header>
