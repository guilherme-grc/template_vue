import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../components/layout/MainLayout.vue';
import { useAuthStore } from '../stores/auth';
import { useUIStore } from '../stores/ui';

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../pages/dashboard/DashboardPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'expenses',
        name: 'Histórico',
        component: () => import('../pages/expenses/ExpenseListPage.vue'),
        meta: { requiresAuth: true, permission: { resource: 'reembolso', action: 'view' } }
      },
      {
        path: 'expenses/new',
        name: 'Novo Reembolso',
        component: () => import('../pages/expenses/ExpenseFormPage.vue'),
        meta: { requiresAuth: true, permission: { resource: 'reembolso', action: 'insert' } }
      },
      {
        path: 'admin/users',
        name: 'Usuários',
        component: () => import('../pages/admin/UserListPage.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'admin/categories',
        name: 'Categorias',
        component: () => import('../pages/admin/CategoryListPage.vue'),
        meta: { requiresAuth: true, role: 'ADMIN' }
      },
      {
        path: 'profile',
        name: 'Perfil',
        component: () => import('../pages/profile/ProfilePage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/auth/LoginPage.vue'),
    meta: { guestOnly: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  
  // Start loading on route change
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

  // Check specific permissions
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
  // Small delay to make the transition smoother
  setTimeout(() => {
    uiStore.stopLoading();
  }, 300);
});

export default router;
