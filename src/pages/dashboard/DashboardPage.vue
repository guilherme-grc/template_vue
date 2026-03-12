<template>
  <div class="space-y-4">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Olá, {{ user?.name }}! 👋</h1>
        <p class="text-gray-500 dark:text-gray-400">Aqui está o resumo das suas despesas.</p>
      </div>
      <AppButton @click="$router.push('/expenses/new')">
        <template #left-icon><Plus class="w-5 h-5" /></template>
        Novo Reembolso
      </AppButton>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        label="Total Pendente" 
        value="R$ 1.250,00" 
        :icon="Clock" 
        variant="warning"
        :trend="12"
      />
      <StatCard 
        label="Aprovados" 
        value="R$ 4.820,00" 
        :icon="CheckCircle" 
        variant="success"
        :trend="5"
      />
      <StatCard 
        label="Rejeitados" 
        value="R$ 150,00" 
        :icon="XCircle" 
        variant="danger"
      />
      <StatCard 
        label="Limite Mensal" 
        value="R$ 10.000,00" 
        :icon="ShieldCheck" 
        variant="info"
      />
    </div>

    <!-- Charts & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="lg:col-span-1">
        <ExpenseChart />
      </div>
      
      <div class="lg:col-span-2">
        <div class="card h-full">
          <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 class="font-bold text-gray-900 dark:text-white">Atividade Recente</h3>
            <router-link to="/expenses" class="text-sm text-primary-600 font-medium hover:underline">Ver tudo</router-link>
          </div>
          
          <div class="divide-y divide-gray-100 dark:divide-gray-700">
            <div v-for="expense in recentExpenses" :key="expense.id" class="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                  {{ expense.categoryIcon }}
                </div>
                <div>
                  <p class="font-bold text-gray-900 dark:text-white">{{ expense.description }}</p>
                  <p class="text-xs text-gray-500">{{ expense.date }} • {{ expense.category }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-gray-900 dark:text-white">R$ {{ expense.amount }}</p>
                <AppBadge :variant="getStatusVariant(expense.status)">{{ expense.status }}</AppBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ShieldCheck 
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import AppButton from '@/components/common/AppButton.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import StatCard from '@/components/modules/dashboard/StatCard.vue';
import ExpenseChart from '@/components/modules/dashboard/ExpenseChart.vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const recentExpenses = [
  { id: 1, description: 'Almoço Executivo', amount: '45,00', date: '28 Fev 2026', category: 'Alimentação', categoryIcon: '🍱', status: 'Pendente' },
  { id: 2, description: 'Uber - Reunião Cliente', amount: '32,50', date: '27 Fev 2026', category: 'Transporte', categoryIcon: '🚗', status: 'Aprovado' },
  { id: 3, description: 'Café da Manhã', amount: '18,00', date: '27 Fev 2026', category: 'Alimentação', categoryIcon: '☕', status: 'Aprovado' },
  { id: 4, description: 'Estacionamento', amount: '25,00', date: '26 Fev 2026', category: 'Transporte', categoryIcon: '🅿️', status: 'Rejeitado' },
];

const getStatusVariant = (status) => {
  const variants = {
    'Pendente': 'warning',
    'Aprovado': 'success',
    'Rejeitado': 'danger',
    'Rascunho': 'default'
  };
  return variants[status] || 'default';
};
</script>
