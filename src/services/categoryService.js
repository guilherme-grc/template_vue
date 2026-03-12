import api from './api';

// Category service using API
export const categoryService = {
  async getAll() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
          { id: 1, name: 'Almoço', icon: '🍱', color: 'blue', maxAmount: 60 },
          { id: 2, name: 'Café da Manhã', icon: '☕', color: 'orange', maxAmount: 30 },
          { id: 3, name: 'Jantar', icon: '🍽️', color: 'indigo', maxAmount: 80 },
          { id: 4, name: 'Uber / Táxi', icon: '🚗', color: 'green', maxAmount: 150 },
          { id: 5, name: 'Combustível', icon: '⛽', color: 'yellow', maxAmount: 300 },
          { id: 6, name: 'Estacionamento', icon: '🅿️', color: 'gray', maxAmount: 50 },
          { id: 7, name: 'Hospedagem', icon: '🏨', color: 'purple', maxAmount: 500 },
          { id: 8, name: 'Outros', icon: '📦', color: 'slate', maxAmount: 0 },
        ];
      }
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await api.post('/categories', data);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { ...data, id: Date.now() };
      }
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await api.put(`/categories/${id}`, data);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { ...data, id };
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/categories/${id}`);
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
