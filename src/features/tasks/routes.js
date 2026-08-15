export default [
  {
    path: 'tasks',
    name: 'Tarefas',
    component: () => import('./pages/TaskListPage.vue'),
    meta: { requiresAuth: true, permission: { resource: 'task', action: 'view' } },
  },
];
