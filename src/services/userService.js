import api from './api';

// User service using API
export const userService = {
  async getAll() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
          { id: 1, name: 'Administrador', email: 'admin@reembolso.com', role: 'ADMIN', department: 'TI', status: 'Ativo', limit: 10000 },
          { id: 2, name: 'João Silva', email: 'user@reembolso.com', role: 'FUNCIONARIO', department: 'Vendas', status: 'Ativo', limit: 2000 },
          { id: 3, name: 'Maria Oliveira', email: 'maria@reembolso.com', role: 'FUNCIONARIO', department: 'Marketing', status: 'Ativo', limit: 3000 },
          { id: 4, name: 'Pedro Santos', email: 'pedro@reembolso.com', role: 'FUNCIONARIO', department: 'Vendas', status: 'Inativo', limit: 1500 },
        ];
      }
      throw error;
    }
  },

  async create(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { ...userData, id: Date.now(), status: 'Ativo' };
      }
      throw error;
    }
  },

  async update(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { ...userData, id };
      }
      throw error;
    }
  },

  async toggleStatus(id) {
    try {
      const response = await api.patch(`/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
      throw error;
    }
  }
};
