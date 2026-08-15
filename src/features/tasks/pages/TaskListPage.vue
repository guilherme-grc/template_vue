<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Tarefas</h1>
        <p class="text-gray-500 dark:text-gray-400">Acompanhe e gerencie as tarefas do time.</p>
      </div>
      <AppButton v-if="can('task', 'insert')" @click="openCreateModal">
        <template #left-icon><Plus class="w-5 h-5" /></template>
        Nova Tarefa
      </AppButton>
    </div>

    <!-- Filters -->
    <div class="card p-4 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <AppInput v-model="search" placeholder="Buscar por título...">
          <template #icon><Search class="w-5 h-5" /></template>
        </AppInput>
      </div>
      <select v-model="filterStatus" class="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all">
        <option value="">Todos os Status</option>
        <option v-for="(meta, key) in TASK_STATUS" :key="key" :value="key">{{ meta.label }}</option>
      </select>
    </div>

    <!-- Dynamic Table -->
    <DynamicTable
      :columns="tableColumns"
      :data="filteredTasks"
      :loading="loading"
      exportable
      exportFilename="tarefas.csv"
    >
      <template #cell(status)="{ value }">
        <AppBadge :variant="statusVariant(TASK_STATUS, value)">{{ statusLabel(TASK_STATUS, value) }}</AppBadge>
      </template>

      <template #cell(actions)="{ row }">
        <div class="flex items-center justify-end gap-2">
          <button v-if="can('task', 'update')" @click="editTask(row)" class="p-2 text-gray-400 hover:text-primary-600 transition-colors">
            <Edit2 class="w-4 h-4" />
          </button>
          <button v-if="can('task', 'destroy')" @click="confirmRemove(row)" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </template>
    </DynamicTable>

    <TaskFormModal
      :isOpen="isModalOpen"
      :task="editingTask"
      :loading="saving"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Search, Edit2, Trash2 } from 'lucide-vue-next';
import AppButton from '@/components/common/AppButton.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import DynamicTable from '@/components/common/DynamicTable.vue';
import TaskFormModal from '@/features/tasks/components/TaskFormModal.vue';
import { useTasks } from '@/features/tasks/composables/useTasks';
import { usePermissions } from '@/composables/usePermissions';
import { TASK_STATUS, statusLabel, statusVariant } from '@/constants/statusVariants';

const { can } = usePermissions();
const {
  loading,
  saving,
  search,
  filterStatus,
  filteredTasks,
  fetchTasks,
  createTask,
  updateTask,
  removeTask,
} = useTasks();

const isModalOpen = ref(false);
const editingTask = ref(null);

const tableColumns = [
  { key: 'title', label: 'Tarefa', sortable: true },
  {
    key: 'priority',
    label: 'Prioridade',
    sortable: true,
    format: (val) => ({ low: 'Baixa', medium: 'Média', high: 'Alta' }[val] || val),
  },
  {
    key: 'dueDate',
    label: 'Prazo',
    sortable: true,
    format: (val) => (val ? new Date(val).toLocaleDateString('pt-BR') : '-'),
  },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false, align: 'right' },
];

const openCreateModal = () => {
  editingTask.value = null;
  isModalOpen.value = true;
};

const editTask = (task) => {
  editingTask.value = { ...task };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingTask.value = null;
};

const confirmRemove = (task) => {
  if (confirm(`Excluir a tarefa "${task.title}"?`)) {
    removeTask(task.id);
  }
};

const handleSave = async (data) => {
  try {
    if (editingTask.value) {
      await updateTask(editingTask.value.id, data);
    } else {
      await createTask(data);
    }
    closeModal();
  } catch {
    // toast already shown by useTasks
  }
};

onMounted(fetchTasks);
</script>
