<template>
  <transition name="fade">
    <div 
      v-if="uiStore.isLoading" 
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
    >
      <div class="relative">
        <!-- Outer Ring -->
        <div class="w-16 h-16 border-4 border-primary-100 dark:border-primary-900/30 rounded-full"></div>
        <!-- Spinning Ring -->
        <div class="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div class="mt-4 flex flex-col items-center">
        <p class="text-lg font-bold text-gray-900 dark:text-white animate-pulse">
          {{ uiStore.loadingMessage || 'Carregando...' }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest font-bold">
          Reembolso Pro
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
