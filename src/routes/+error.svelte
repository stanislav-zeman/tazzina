<script lang="ts">
  import { page } from '$app/stores';
</script>

<div class="min-h-screen flex items-center justify-center bg-background">
  <div class="text-center space-y-4">
    <h1 class="text-6xl font-bold text-foreground">{$page.status}</h1>
    <p class="text-xl text-muted-foreground">{$page.error?.message ?? 'Something went wrong'}</p>
    <a href="/" class="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
      Go home
    </a>
  </div>
</div>
