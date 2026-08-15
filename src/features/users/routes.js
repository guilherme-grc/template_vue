export default [
  {
    path: 'admin/users',
    name: 'Usuários',
    component: () => import('./pages/UserListPage.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' },
  },
];
