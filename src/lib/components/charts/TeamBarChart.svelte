<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

  Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

  interface Props {
    chartData: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
      }[];
    };
  }
  let { chartData }: Props = $props();

  let canvas: HTMLCanvasElement;
  let chart = $state<Chart | undefined>(undefined);

  onMount(() => {
    chart = new Chart(canvas, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
    return () => chart?.destroy();
  });

  $effect(() => {
    if (chart) {
      chart.data = chartData;
      chart.update();
    }
  });
</script>

<div class="relative h-64 w-full">
  <canvas bind:this={canvas}></canvas>
</div>
