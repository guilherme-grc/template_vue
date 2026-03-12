import { useAuthStore } from '@/stores/auth';

export function usePermissions() {
  const authStore = useAuthStore();

  const can = (resource, action) => {
    return authStore.can(resource, action);
  };

  const cannot = (resource, action) => {
    return !can(resource, action);
  };

  return {
    can,
    cannot,
    permissions: authStore.permissions
  };
}
