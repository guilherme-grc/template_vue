import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/components/layout/MainLayout.vue';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';

import authRoutes from '@/features/auth/routes';
import dashboardRoutes from '@/features/dashboard/routes';
import taskRoutes from '@/features/tasks/routes';
import userRoutes from '@/features/users/routes';
import profileRoutes from '@/features/profile/routes';

/**
 * Each feature owns its own routes.js; this file only aggregates them and
 * applies the cross-cutting guards. Adding a new feature means adding one
 * import + spread here, not editing route definitions in place.
 */
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [...dashboardRoutes, ...taskRoutes, ...userRoutes, ...profileRoutes],
  },
  ...authRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const uiStore = useUIStore();

  uiStore.startLoading('Navegando...');

  const isAuthenticated = authStore.isAuthenticated;
  const user = authStore.user;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  if (to.meta.guestOnly && isAuthenticated) {
    next('/');
    return;
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    next('/');
    return;
  }

  if (to.meta.permission) {
    const { resource, action } = to.meta.permission;
    if (!authStore.can(resource, action)) {
      next('/');
      return;
    }
  }

  next();
});

router.afterEach(() => {
  const uiStore = useUIStore();
  setTimeout(() => {
    uiStore.stopLoading();
  }, 300);
});

export default router;
