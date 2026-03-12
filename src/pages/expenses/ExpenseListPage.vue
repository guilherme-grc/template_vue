<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Histórico de Reembolsos</h1>
        <p class="text-gray-500 dark:text-gray-400">Acompanhe o status dos seus pedidos de reembolso.</p>
      </div>
      <AppButton v-if="can('reembolso', 'insert')" @click="$router.push('/expenses/new')">
        <template #left-icon><Plus class="w-5 h-5" /></template>
        Novo Reembolso
      </AppButton>
    </div>

    <!-- Filters -->
    <div class="card p-4 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <AppInput v-model="search" placeholder="Buscar por descrição ou estabelecimento...">
          <template #icon><Search class="w-5 h-5" /></template>
        </AppInput>
      </div>
      <div class="flex gap-4">
        <select v-model="filterStatus" class="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all">
          <option value="">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Aprovado">Aprovado</option>
          <option value="Rejeitado">Rejeitado</option>
        </select>
        <select v-model="filterCategory" class="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all">
          <option value="">Todas Categorias</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
        </select>
      </div>
    </div>

    <!-- Dynamic Table -->
    <DynamicTable 
      :columns="tableColumns" 
      :data="filteredExpenses" 
      :loading="loading"
      exportable
      exportFilename="reembolsos.csv"
      clickable
      @row-click="viewDetail"
    >
      <!-- Custom Cell Rendering -->
      <template #cell(description)="{ value, row }">
        <div>
          <p class="font-bold text-gray-900 dark:text-white">{{ value }}</p>
          <p class="text-xs text-gray-500">{{ row.establishment }}</p>
        </div>
      </template>

      <template #cell(category)="{ value, row }">
        <div class="flex items-center gap-2">
          <span>{{ row.categoryIcon }}</span>
          <span class="text-sm text-gray-600 dark:text-gray-300">{{ value }}</span>
        </div>
      </template>

      <template #cell(status)="{ value }">
        <AppBadge :variant="getStatusVariant(value)">{{ value }}</AppBadge>
      </template>

      <template #cell(actions)="{ row }">
        <AppButton size="sm" variant="ghost" @click.stop="viewDetail(row)">
          <Eye class="w-4 h-4" />
        </AppButton>
      </template>
    </DynamicTable>

    <!-- Detail Modal -->
    <ExpenseDetailModal 
      :isOpen="isModalOpen" 
      :expense="selectedExpense" 
      @close="closeModal"
      @updated="fetchExpenses"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Plus, Search, Eye } from 'lucide-vue-next';
import AppButton from '@/components/common/AppButton.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import DynamicTable from '@/components/common/DynamicTable.vue';
import ExpenseDetailModal from '@/components/modules/expenses/ExpenseDetailModal.vue';
import { expenseService } from '@/services/expenseService';
import { categoryService } from '@/services/categoryService';
import { usePermissions } from '@/composables/usePermissions';

const { can } = usePermissions();
const expenses = ref([]);
const categories = ref([]);
const search = ref('');
const filterStatus = ref('');
const filterCategory = ref('');
const isModalOpen = ref(false);
const selectedExpense = ref(null);
const loading = ref(false);

const tableColumns = [
  { key: 'description', label: 'Despesa', sortable: true },
  { key: 'category', label: 'Categoria', sortable: true },
  { 
    key: 'date', 
    label: 'Data', 
    sortable: true,
    format: (val) => new Date(val).toLocaleDateString('pt-BR')
  },
  { 
    key: 'amount', 
    label: 'Valor', 
    sortable: true,
    format: (val) => `R$ ${val.toFixed(2)}`
  },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false, align: 'right' },
];

const fetchExpenses = async () => {
  loading.value = true;
  try {
    expenses.value = await expenseService.getAll();
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  categories.value = await categoryService.getAll();
};

const filteredExpenses = computed(() => {
  return expenses.value.filter(e => {
    const matchesSearch = e.description.toLowerCase().includes(search.value.toLowerCase()) || 
                          e.establishment.toLowerCase().includes(search.value.toLowerCase());
    const matchesStatus = !filterStatus.value || e.status === filterStatus.value;
    const matchesCategory = !filterCategory.value || e.category === filterCategory.value;
    return matchesSearch && matchesStatus && matchesCategory;
  });
});

const viewDetail = (expense) => {
  selectedExpense.value = expense;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedExpense.value = null;
};

const getStatusVariant = (status) => {
  const variants = {
    'Pendente': 'warning',
    'Aprovado': 'success',
    'Rejeitado': 'danger',
    'Rascunho': 'default'
  };
  return variants[status] || 'default';
};

onMounted(() => {
  fetchExpenses();
  fetchCategories();
});
</script>
