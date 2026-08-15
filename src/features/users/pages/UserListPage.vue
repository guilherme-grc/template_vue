<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Usuários</h1>
        <p class="text-gray-500 dark:text-gray-400">Gerencie os usuários e seus perfis de acesso.</p>
      </div>
      <AppButton @click="openCreateModal">
        <template #left-icon><UserPlus class="w-5 h-5" /></template>
        Novo Usuário
      </AppButton>
    </div>

    <!-- Filters -->
    <div class="card p-4 flex flex-col md:flex-row gap-4">
      <div class="flex-1">
        <AppInput v-model="search" placeholder="Buscar por nome ou e-mail...">
          <template #icon><Search class="w-5 h-5" /></template>
        </AppInput>
      </div>
      <div class="flex gap-4">
        <select v-model="filterRole" class="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all">
          <option value="">Todos os Perfis</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">Usuário</option>
        </select>
        <select v-model="filterStatus" class="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all">
          <option value="">Todos os Status</option>
          <option v-for="(meta, key) in USER_STATUS" :key="key" :value="key">{{ meta.label }}</option>
        </select>
      </div>
    </div>

    <!-- Dynamic Table -->
    <DynamicTable
      :columns="tableColumns"
      :data="filteredUsers"
      :loading="loading"
      exportable
      exportFilename="usuarios.csv"
    >
      <template #cell(name)="{ value, row }">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
            {{ value.charAt(0) }}
          </div>
          <div>
            <p class="font-bold text-gray-900 dark:text-white">{{ value }}</p>
            <p class="text-xs text-gray-500">{{ row.email }} • {{ row.role }}</p>
          </div>
        </div>
      </template>

      <template #cell(status)="{ value }">
        <AppBadge :variant="statusVariant(USER_STATUS, value)">{{ statusLabel(USER_STATUS, value) }}</AppBadge>
      </template>

      <template #cell(actions)="{ row }">
        <div class="flex items-center justify-end gap-2">
          <button @click="editUser(row)" class="p-2 text-gray-400 hover:text-primary-600 transition-colors">
            <Edit2 class="w-4 h-4" />
          </button>
          <button @click="toggleUserStatus(row)" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
            <Power class="w-4 h-4" />
          </button>
        </div>
      </template>
    </DynamicTable>

    <UserFormModal
      :isOpen="isModalOpen"
      :user="editingUser"
      :loading="saving"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { UserPlus, Search, Edit2, Power } from 'lucide-vue-next';
import AppButton from '@/components/common/AppButton.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import DynamicTable from '@/components/common/DynamicTable.vue';
import UserFormModal from '@/features/users/components/UserFormModal.vue';
import { useUsers } from '@/features/users/composables/useUsers';
import { USER_STATUS, statusLabel, statusVariant } from '@/constants/statusVariants';

const {
  loading,
  saving,
  search,
  filterRole,
  filterStatus,
  filteredUsers,
  fetchUsers,
  saveUser,
  toggleUserStatus,
} = useUsers();

const isModalOpen = ref(false);
const editingUser = ref(null);

const tableColumns = [
  { key: 'name', label: 'Usuário', sortable: true },
  { key: 'role', label: 'Perfil', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false, align: 'right' },
];

const openCreateModal = () => {
  editingUser.value = null;
  isModalOpen.value = true;
};

const editUser = (user) => {
  editingUser.value = { ...user };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingUser.value = null;
};

const handleSave = async (data) => {
  try {
    await saveUser(editingUser.value?.id, data);
    closeModal();
  } catch {
    // toast already shown by useUsers
  }
};

onMounted(fetchUsers);
</script>
