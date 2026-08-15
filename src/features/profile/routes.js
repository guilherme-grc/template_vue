export default [
  {
    path: 'profile',
    name: 'Perfil',
    component: () => import('./pages/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },
];
