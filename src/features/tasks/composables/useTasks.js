import { ref, computed } from 'vue';
import { taskService } from '@/features/tasks/services/taskService';
import { useToast } from '@/composables/useToast';

/**
 * Owns task state + orchestration (fetch, filter, CRUD). The page component
 * only renders and calls these functions — it doesn't know how tasks are
 * fetched or persisted (SRP).
 */
export function useTasks() {
  const toast = useToast();

  const tasks = ref([]);
  const loading = ref(false);
  const saving = ref(false);
  const search = ref('');
  const filterStatus = ref('');

  const fetchTasks = async () => {
    loading.value = true;
    try {
      tasks.value = await taskService.getAll();
    } finally {
      loading.value = false;
    }
  };

  const filteredTasks = computed(() => {
    return tasks.value.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.value.toLowerCase());
      const matchesStatus = !filterStatus.value || task.status === filterStatus.value;
      return matchesSearch && matchesStatus;
    });
  });

  const createTask = async (data) => {
    saving.value = true;
    try {
      await taskService.create({ ...data, status: 'pending' });
      toast.success('Sucesso', 'Tarefa criada com sucesso!');
      await fetchTasks();
    } catch (err) {
      toast.error('Erro', 'Não foi possível criar a tarefa.');
      throw err;
    } finally {
      saving.value = false;
    }
  };

  const updateTask = async (id, data) => {
    saving.value = true;
    try {
      await taskService.update(id, data);
      toast.success('Sucesso', 'Tarefa atualizada com sucesso!');
      await fetchTasks();
    } catch (err) {
      toast.error('Erro', 'Não foi possível atualizar a tarefa.');
      throw err;
    } finally {
      saving.value = false;
    }
  };

  const removeTask = async (id) => {
    try {
      await taskService.remove(id);
      tasks.value = tasks.value.filter((task) => task.id !== id);
      toast.success('Removida', 'Tarefa excluída com sucesso.');
    } catch {
      toast.error('Erro', 'Não foi possível excluir a tarefa.');
    }
  };

  return {
    tasks,
    loading,
    saving,
    search,
    filterStatus,
    filteredTasks,
    fetchTasks,
    createTask,
    updateTask,
    removeTask,
  };
}
