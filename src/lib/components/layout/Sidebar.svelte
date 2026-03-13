<script lang="ts">
  import { page } from '$app/stores';
  import type { Session } from '@auth/sveltekit';
  import type { Team } from '$lib/types';
  import { Home, Coffee, BarChart2, User, Users, Building2, ShieldCheck } from 'lucide-svelte';

  interface Props {
    session: Session | null | undefined;
    managedTeams?: Team[];
  }
  let { session, managedTeams = [] }: Props = $props();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/log', label: 'Log Coffee', icon: Coffee },
    { href: '/stats', label: 'Stats', icon: BarChart2 },
    { href: '/profile', label: 'Profile', icon: User }
  ];

  const adminItems = [
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/teams', label: 'Teams', icon: Building2 }
  ];

  function isActive(href: string) {
    return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
  }
</script>

<aside class="w-56 min-h-[calc(100vh-57px)] border-r border-border bg-card p-4">
  <nav class="space-y-1">
    {#each navItems as item}
      <a
        href={item.href}
        class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors {$page.url.pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
      >
        <item.icon size={16} />
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
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors {$page.url.pathname.startsWith(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
        >
          <item.icon size={16} />
          {item.label}
        </a>
      {/each}
    {/if}

    {#if managedTeams.length > 0}
      <div class="pt-4 pb-1">
        <p class="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Manage</p>
      </div>
      {#each managedTeams as team}
        <a
          href="/manager/{team.id}/members"
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors {isActive('/manager/' + team.id) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
        >
          <ShieldCheck size={16} />
          {team.name}
        </a>
      {/each}
    {/if}
  </nav>
</aside>
