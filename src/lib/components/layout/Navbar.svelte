<script lang="ts">
  import { signOut } from '@auth/sveltekit/client';
  import type { Session } from '@auth/sveltekit';

  interface Props {
    session: Session | null | undefined;
  }
  let { session }: Props = $props();
</script>

<header class="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
  <a href="/" class="flex items-center gap-2 font-bold text-foreground text-lg">
    <span>☕</span>
    <span>Tazzina</span>
  </a>
  <div class="flex items-center gap-4">
    {#if session?.user}
      <span class="text-sm text-muted-foreground">{session.user.name}</span>
      <button
        onclick={() => signOut({ redirectTo: '/login' })}
        class="text-sm text-muted-foreground hover:text-foreground"
      >
        Sign out
      </button>
    {/if}
  </div>
</header>
