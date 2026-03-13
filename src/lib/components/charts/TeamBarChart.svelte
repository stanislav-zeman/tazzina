<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

  Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

  interface Props {
    chartData: {
      labels: string[];
      datasets: { label: string; data: number[]; backgroundColor: string | string[] }[];
    };
  }
  let { chartData }: Props = $props();

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const chart = new Chart(canvas, {
      type: 'bar',
      data: JSON.parse(JSON.stringify(chartData)),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
    return () => chart.destroy();
  });
</script>

<div class="relative h-64 w-full">
  <canvas bind:this={canvas}></canvas>
</div>
