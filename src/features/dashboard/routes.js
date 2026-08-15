export default [
  {
    path: '',
    name: 'Dashboard',
    component: () => import('./pages/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
];
