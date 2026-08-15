<template>
  <div class="card p-6 h-full">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-bold text-gray-900 dark:text-white">Tarefas por Status</h3>
    </div>

    <div class="relative h-[250px]">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TASK_STATUS } from '@/constants/statusVariants';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  counts: { type: Object, default: () => ({ pending: 0, in_progress: 0, done: 0 }) },
});

const chartData = computed(() => ({
  labels: Object.values(TASK_STATUS).map((s) => s.label),
  datasets: [
    {
      backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
      data: Object.keys(TASK_STATUS).map((key) => props.counts[key] || 0),
      borderWidth: 0,
      cutout: '70%',
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12, family: 'Inter' },
      },
    },
  },
};
</script>
