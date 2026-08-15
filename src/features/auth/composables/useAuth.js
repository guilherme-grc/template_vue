import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { authService } from '@/features/auth/services/authService';
import { useToast } from '@/composables/useToast';

/**
 * Thin orchestration layer for the login page and anything that needs to log
 * out (sidebar, profile page). Exposes only what those callers need — the
 * store setters and API call details stay internal (ISP).
 */
export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  const toast = useToast();
  const loading = ref(false);

  const login = async (email, password) => {
    loading.value = true;
    uiStore.startLoading('Autenticando...');
    try {
      const data = await authService.login(email, password);
      authStore.setToken(data.token);
      authStore.setUser(data.user);
      toast.success('Bem-vindo!', `Olá, ${data.user.name}`);
      router.push('/');
    } catch (err) {
      toast.error('Falha no Login', err.message || String(err));
    } finally {
      loading.value = false;
      uiStore.stopLoading();
    }
  };

  const logout = () => {
    uiStore.startLoading('Saindo...');
    setTimeout(() => {
      authStore.logout();
      router.push('/login');
      toast.info('Sessão encerrada', 'Você saiu do sistema');
      uiStore.stopLoading();
    }, 500);
  };

  return {
    login,
    logout,
    loading,
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
  };
}
