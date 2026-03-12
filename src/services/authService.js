import api from './api';

// Auth service using API
export const authService = {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Fallback for development/demo if API is not available
      if (import.meta.env.DEV) {
        console.warn('API not available, using mock login');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'admin@reembolso.com' && password === 'admin123') {
          return {
            token: 'mock-admin-token',
            user: {
              id: 1,
              name: 'Administrador',
              email: 'admin@reembolso.com',
              role: 'ADMIN',
              department: 'TI',
              permissions: {
                reembolso: { insert: true, update: true, view: true, destroy: true }
              }
            }
          };
        } else if (email === 'user@reembolso.com' && password === 'user123') {
          return {
            token: 'mock-user-token',
            user: {
              id: 2,
              name: 'João Silva',
              email: 'user@reembolso.com',
              role: 'FUNCIONARIO',
              department: 'Vendas',
              permissions: {
                reembolso: { insert: false, update: false, view: true, destroy: false }
              }
            }
          };
        }
      }
      throw error.response?.data?.message || 'E-mail ou senha inválidos';
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      return JSON.parse(localStorage.getItem('user'));
    }
  }
};
