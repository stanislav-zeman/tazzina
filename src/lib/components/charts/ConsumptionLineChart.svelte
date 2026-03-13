<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Chart,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
  } from 'chart.js';

  Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

  interface Props {
    chartData: {
      labels: string[];
      datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        tension: number;
      }[];
    };
  }
  let { chartData }: Props = $props();

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const chart = new Chart(canvas, {
      type: 'line',
      data: JSON.parse(JSON.stringify(chartData)),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
      }
    });
    return () => chart.destroy();
  });
</script>

<div class="relative h-64 w-full">
  <canvas bind:this={canvas}></canvas>
</div>
