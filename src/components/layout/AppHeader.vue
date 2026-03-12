<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 sticky top-0 z-40">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 md:hidden">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
          <Receipt class="w-5 h-5" />
        </div>
        <span class="font-bold text-lg text-gray-900 dark:text-white">Reembolso<span class="text-primary-600">Pro</span></span>
      </div>
      
      <div class="hidden md:block">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ pageTitle }}</h2>
      </div>

      <div class="flex items-center gap-4">
        <button 
          @click="uiStore.toggleSidebar"
          class="hidden md:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
        >
          <Menu v-if="!uiStore.isSidebarExpanded" class="w-5 h-5" />
          <ChevronLeft v-else class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ user?.name || 'Usuário' }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ user?.role || 'Funcionário' }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
            {{ userInitials }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Receipt, Menu, ChevronLeft } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();

const user = computed(() => authStore.user);
const userInitials = computed(() => {
  if (!user.value?.name) return 'U';
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const pageTitle = computed(() => {
  return route.name || 'Dashboard';
});
</script>
