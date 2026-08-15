import { createCrudService } from '@/services/http/createCrudService';

const MOCK_USERS = [
  { id: 1, name: 'Administrador', email: 'admin@example.com', role: 'ADMIN', status: 'active' },
  { id: 2, name: 'Usuário Padrão', email: 'user@example.com', role: 'USER', status: 'active' },
  { id: 3, name: 'Maria Oliveira', email: 'maria@example.com', role: 'USER', status: 'active' },
  { id: 4, name: 'Pedro Santos', email: 'pedro@example.com', role: 'USER', status: 'inactive' },
];

const baseService = createCrudService('users', { mockData: MOCK_USERS });

/**
 * Composes the generic CRUD service with a domain-specific action
 * (toggleStatus) instead of the factory trying to anticipate every possible
 * verb a resource might need (OCP: extend by composition, not by editing
 * createCrudService).
 */
export const userService = {
  ...baseService,
  async toggleStatus(id) {
    const current = await baseService.getById(id);
    const nextStatus = current?.status === 'active' ? 'inactive' : 'active';
    return baseService.patch(id, { status: nextStatus });
  },
};
