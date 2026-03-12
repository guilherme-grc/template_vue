<template>
  <div class="card p-6 h-full">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-bold text-gray-900 dark:text-white">Despesas por Categoria</h3>
      <select class="text-xs bg-gray-50 dark:bg-gray-700 border-none rounded-lg focus:ring-primary-500">
        <option>Este Mês</option>
        <option>Mês Passado</option>
      </select>
    </div>
    
    <div class="relative h-[250px]">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = {
  labels: ['Alimentação', 'Transporte', 'Hospedagem', 'Outros'],
  datasets: [
    {
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
      data: [40, 20, 30, 10],
      borderWidth: 0,
      cutout: '70%'
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          family: 'Inter'
        }
      }
    }
  }
};
</script>
