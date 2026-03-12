import { ref } from 'vue';

const toasts = ref([]);

export function useToast() {
  const add = ({ title, message, type = 'info', duration = 3000 }) => {
    const id = Date.now();
    toasts.value.push({ id, title, message, type });
    
    if (duration > 0) {
      setTimeout(() => {
        remove(id);
      }, duration);
    }
  };

  const remove = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (title, message) => add({ title, message, type: 'success' });
  const error = (title, message) => add({ title, message, type: 'error' });
  const info = (title, message) => add({ title, message, type: 'info' });

  return {
    toasts,
    add,
    remove,
    success,
    error,
    info
  };
}
