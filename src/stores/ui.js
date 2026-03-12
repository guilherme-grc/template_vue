import { defineStore } from 'pinia';

export const useUIStore = defineStore('ui', {
  state: () => ({
    isLoading: false,
    loadingMessage: '',
    isSidebarExpanded: true,
    isHovered: false
  }),
  actions: {
    setLoading(status, message = '') {
      this.isLoading = status;
      this.loadingMessage = message;
    },
    startLoading(message = 'Carregando...') {
      this.isLoading = true;
      this.loadingMessage = message;
    },
    stopLoading() {
      this.isLoading = false;
      this.loadingMessage = '';
    },
    toggleSidebar() {
      this.isSidebarExpanded = !this.isSidebarExpanded;
    },
    setHover(status) {
      this.isHovered = status;
    }
  }
});
