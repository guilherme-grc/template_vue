import { ref, computed, onMounted } from 'vue';
import { taskService } from '@/features/tasks/services/taskService';

/**
 * Aggregates data for the dashboard page. Keeps the page free of fetching
 * and derived-state logic (SRP).
 */
export function useDashboard() {
  const tasks = ref([]);
  const loading = ref(false);

  const fetchTasks = async () => {
    loading.value = true;
    try {
      tasks.value = await taskService.getAll();
    } finally {
      loading.value = false;
    }
  };

  const statusCounts = computed(() => {
    return tasks.value.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      { pending: 0, in_progress: 0, done: 0 }
    );
  });

  const recentTasks = computed(() => tasks.value.slice(0, 5));

  onMounted(fetchTasks);

  return {
    tasks,
    loading,
    statusCounts,
    recentTasks,
  };
}
