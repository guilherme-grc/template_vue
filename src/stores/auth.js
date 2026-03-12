import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('auth_token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    permissions: (state) => state.user?.permissions || {},
    can: (state) => (resource, action) => {
      if (state.user?.role === 'ADMIN') return true;
      const perms = state.user?.permissions?.[resource];
      return perms ? !!perms[action] : false;
    }
  },
  actions: {
    setUser(user) {
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    setToken(token) {
      this.token = token;
      localStorage.setItem('auth_token', token);
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }
});
