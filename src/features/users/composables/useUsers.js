import { ref, computed } from 'vue';
import { userService } from '@/features/users/services/userService';
import { useToast } from '@/composables/useToast';

export function useUsers() {
  const toast = useToast();

  const users = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const search = ref('');
  const filterRole = ref('');
  const filterStatus = ref('');

  const fetchUsers = async () => {
    loading.value = true;
    try {
      users.value = await userService.getAll();
    } finally {
      loading.value = false;
    }
  };

  const filteredUsers = computed(() => {
    return users.value.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.value.toLowerCase()) ||
        user.email.toLowerCase().includes(search.value.toLowerCase());
      const matchesRole = !filterRole.value || user.role === filterRole.value;
      const matchesStatus = !filterStatus.value || user.status === filterStatus.value;
      return matchesSearch && matchesRole && matchesStatus;
    });
  });

  const saveUser = async (existingId, data) => {
    saving.value = true;
    try {
      if (existingId) {
        await userService.update(existingId, data);
        toast.success('Sucesso', 'Usuário atualizado com sucesso!');
      } else {
        await userService.create(data);
        toast.success('Sucesso', 'Usuário criado com sucesso!');
      }
      await fetchUsers();
    } catch (err) {
      toast.error('Erro', 'Não foi possível salvar o usuário.');
      throw err;
    } finally {
      saving.value = false;
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      await userService.toggleStatus(user.id);
      user.status = user.status === 'active' ? 'inactive' : 'active';
      toast.success('Status Alterado', `${user.name} está agora ${user.status === 'active' ? 'ativo' : 'inativo'}.`);
    } catch {
      toast.error('Erro', 'Não foi possível alterar o status.');
    }
  };

  return {
    users,
    loading,
    saving,
    search,
    filterRole,
    filterStatus,
    filteredUsers,
    fetchUsers,
    saveUser,
    toggleUserStatus,
  };
}
