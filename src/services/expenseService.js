import api from './api';

// Expense service using API
export const expenseService = {
  async getAll(filters = {}) {
    try {
      const response = await api.get('/expenses', { params: filters });
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
          { id: 1, description: 'Almoço Executivo', amount: 45.00, date: '2026-02-28', category: 'Alimentação', categoryIcon: '🍱', status: 'Pendente', establishment: 'Restaurante Sabor' },
          { id: 2, description: 'Uber - Reunião Cliente', amount: 32.50, date: '2026-02-27', category: 'Transporte', categoryIcon: '🚗', status: 'Aprovado', establishment: 'Uber' },
          { id: 3, description: 'Café da Manhã', amount: 18.00, date: '2026-02-27', category: 'Alimentação', categoryIcon: '☕', status: 'Aprovado', establishment: 'Padaria Central' },
          { id: 4, description: 'Estacionamento', amount: 25.00, date: '2026-02-26', category: 'Transporte', categoryIcon: '🅿️', status: 'Rejeitado', establishment: 'Estacione Aqui', rejectionReason: 'Comprovante ilegível' },
        ];
      }
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/expenses', data);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { ...data, id: Date.now(), status: 'Enviado' };
      }
      throw error;
    }
  },

  async updateStatus(id, status, reason = '') {
    try {
      const response = await api.patch(`/expenses/${id}/status`, { status, reason });
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
      }
      throw error;
    }
  }
};
