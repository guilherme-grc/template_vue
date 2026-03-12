<template>
  <div class="space-y-4">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Usuários</h1>
        <p class="text-gray-500 dark:text-gray-400">Gerencie os funcionários e seus limites de reembolso.</p>
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
          <option value="FUNCIONARIO">Funcionário</option>
        </select>
        <select v-model="filterStatus" class="rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500 transition-all">
          <option value="">Todos os Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
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

      <template #cell(limit)="{ value }">
        <span class="font-bold text-gray-900 dark:text-white">
          R$ {{ value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
        </span>
      </template>

      <template #cell(status)="{ value }">
        <AppBadge :variant="value === 'Ativo' ? 'success' : 'default'">{{ value }}</AppBadge>
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

    <!-- User Form Modal -->
    <UserFormModal 
      :isOpen="isModalOpen" 
      :user="editingUser" 
      :loading="submitting"
      @close="closeModal" 
      @save="handleSave" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { UserPlus, Search, Edit2, Power } from 'lucide-vue-next';
import AppButton from '@/components/common/AppButton.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import DynamicTable from '@/components/common/DynamicTable.vue';
import UserFormModal from '@/components/modules/admin/UserFormModal.vue';
import { userService } from '@/services/userService';
import { useToast } from '@/composables/useToast';

const toast = useToast();
const users = ref([]);
const search = ref('');
const filterRole = ref('');
const filterStatus = ref('');
const isModalOpen = ref(false);
const editingUser = ref(null);
const submitting = ref(false);
const loading = ref(false);

const tableColumns = [
  { key: 'name', label: 'Usuário', sortable: true },
  { key: 'department', label: 'Departamento', sortable: true },
  { key: 'limit', label: 'Limite Mensal', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Ações', sortable: false, align: 'right' },
];

const fetchUsers = async () => {
  loading.value = true;
  try {
    users.value = await userService.getAll();
  } finally {
    loading.value = false;
  }
};

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.value.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.value.toLowerCase());
    const matchesRole = !filterRole.value || u.role === filterRole.value;
    const matchesStatus = !filterStatus.value || u.status === filterStatus.value;
    return matchesSearch && matchesRole && matchesStatus;
  });
});

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

const handleSave = async (userData) => {
  submitting.value = true;
  try {
    if (editingUser.value) {
      await userService.update(editingUser.value.id, userData);
      toast.success('Sucesso', 'Usuário atualizado com sucesso!');
    } else {
      await userService.create(userData);
      toast.success('Sucesso', 'Usuário criado com sucesso!');
    }
    await fetchUsers();
    closeModal();
  } catch (err) {
    toast.error('Erro', 'Não foi possível salvar o usuário.');
  } finally {
    submitting.value = false;
  }
};

const toggleUserStatus = async (user) => {
  try {
    await userService.toggleStatus(user.id);
    user.status = user.status === 'Ativo' ? 'Inativo' : 'Ativo';
    toast.success('Status Alterado', `O usuário ${user.name} está agora ${user.status.toLowerCase()}.`);
  } catch (err) {
    toast.error('Erro', 'Não foi possível alterar o status.');
  }
};

onMounted(fetchUsers);
</script>
