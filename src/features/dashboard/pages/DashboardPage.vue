<template>
  <div class="space-y-4">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Olá, {{ user?.name }}! 👋</h1>
        <p class="text-gray-500 dark:text-gray-400">Aqui está o resumo das suas tarefas.</p>
      </div>
      <AppButton @click="$router.push('/tasks')">
        <template #left-icon><ListTodo class="w-5 h-5" /></template>
        Ver Tarefas
      </AppButton>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard label="Pendentes" :value="statusCounts.pending" :icon="Clock" variant="warning" />
      <StatCard label="Em Andamento" :value="statusCounts.in_progress" :icon="Loader" variant="info" />
      <StatCard label="Concluídas" :value="statusCounts.done" :icon="CheckCircle" variant="success" />
    </div>

    <!-- Charts & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-1">
        <ActivityChart :counts="statusCounts" />
      </div>

      <div class="lg:col-span-2">
        <div class="card h-full">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 dark:text-white">Tarefas Recentes</h3>
            <router-link to="/tasks" class="text-sm text-primary-600 font-medium hover:underline">Ver tudo</router-link>
          </div>

          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="task in recentTasks" :key="task.id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <div>
                <p class="font-bold text-gray-900 dark:text-white">{{ task.title }}</p>
                <p class="text-xs text-gray-500">{{ task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem prazo' }}</p>
              </div>
              <AppBadge :variant="statusVariant(TASK_STATUS, task.status)">{{ statusLabel(TASK_STATUS, task.status) }}</AppBadge>
            </div>
            <div v-if="!loading && recentTasks.length === 0" class="p-8 text-center text-gray-400 text-sm">
              Nenhuma tarefa ainda.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ListTodo, Clock, Loader, CheckCircle } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import AppButton from '@/components/common/AppButton.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import StatCard from '@/features/dashboard/components/StatCard.vue';
import ActivityChart from '@/features/dashboard/components/ActivityChart.vue';
import { useDashboard } from '@/features/dashboard/composables/useDashboard';
import { TASK_STATUS, statusLabel, statusVariant } from '@/constants/statusVariants';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const { loading, statusCounts, recentTasks } = useDashboard();
</script>
