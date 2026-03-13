<script lang="ts">
  import { page } from '$app/stores';
  import type { Session } from '@auth/sveltekit';

  interface Props {
    session: Session | null | undefined;
  }
  let { session }: Props = $props();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '🏠' },
    { href: '/log', label: 'Log Coffee', icon: '☕' },
    { href: '/stats', label: 'Stats', icon: '📊' },
    { href: '/profile', label: 'Profile', icon: '👤' }
  ];

  const adminItems = [
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/teams', label: 'Teams', icon: '🏢' },
    { href: '/admin/sprints', label: 'Sprints', icon: '🏃' }
  ];
</script>

<aside class="w-56 min-h-[calc(100vh-57px)] border-r border-border bg-card p-4">
  <nav class="space-y-1">
    {#each navItems as item}
      <a
        href={item.href}
        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors {$page.url.pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
      >
        <span>{item.icon}</span>
        {item.label}
      </a>
    {/each}

    {#if session?.user?.role === 'admin'}
      <div class="pt-4 pb-1">
        <p class="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</p>
      </div>
      {#each adminItems as item}
        <a
          href={item.href}
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors {$page.url.pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
        >
          <span>{item.icon}</span>
          {item.label}
        </a>
      {/each}
    {/if}
  </nav>
</aside>
