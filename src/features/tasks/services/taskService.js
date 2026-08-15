import { createCrudService } from '@/services/http/createCrudService';

const MOCK_TASKS = [
  { id: 1, title: 'Configurar ambiente de desenvolvimento', description: '', status: 'done', priority: 'high', dueDate: '2026-08-10' },
  { id: 2, title: 'Escrever testes do módulo de tarefas', description: '', status: 'in_progress', priority: 'medium', dueDate: '2026-08-18' },
  { id: 3, title: 'Revisar PR de autenticação', description: '', status: 'pending', priority: 'high', dueDate: '2026-08-16' },
  { id: 4, title: 'Atualizar documentação do template', description: '', status: 'pending', priority: 'low', dueDate: '2026-08-22' },
];

/**
 * Example of extending the CRUD factory (OCP): a brand-new resource needs
 * only this config, no copy-pasted try/catch block.
 */
export const taskService = createCrudService('tasks', { mockData: MOCK_TASKS });
