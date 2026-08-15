import httpClient from '@/services/http/httpClient';
import { env } from '@/config/env';

const MOCK_USERS = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    token: 'mock-admin-token',
    user: {
      id: 1,
      name: 'Administrador',
      email: 'admin@example.com',
      role: 'ADMIN',
      permissions: {
        task: { insert: true, update: true, view: true, destroy: true },
      },
    },
  },
  {
    email: 'user@example.com',
    password: 'user123',
    token: 'mock-user-token',
    user: {
      id: 2,
      name: 'Usuário Padrão',
      email: 'user@example.com',
      role: 'USER',
      permissions: {
        task: { insert: true, update: false, view: true, destroy: false },
      },
    },
  },
];

/**
 * Login isn't a CRUD resource, so it stays a hand-written service instead of
 * going through createCrudService — but it still depends only on
 * `httpClient`/`env` (DIP), never on axios or import.meta.env directly.
 */
export const authService = {
  async login(email, password) {
    try {
      const response = await httpClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      if (env.isDev) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const match = MOCK_USERS.find((m) => m.email === email && m.password === password);
        if (match) {
          return { token: match.token, user: match.user };
        }
      }
      throw error.response?.data?.message || 'E-mail ou senha inválidos';
    }
  },

  async getProfile() {
    try {
      const response = await httpClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      return JSON.parse(localStorage.getItem('user'));
    }
  },
};
