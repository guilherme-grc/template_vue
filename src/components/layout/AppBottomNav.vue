<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 z-50">
    <div class="flex items-center justify-between max-w-lg mx-auto">
      <router-link 
        v-for="item in navItems" 
        :key="item.path" 
        :to="item.path"
        class="flex flex-col items-center gap-1 transition-colors"
        :class="[
          $route.path === item.path 
            ? 'text-primary-600 dark:text-primary-400' 
            : 'text-gray-400 dark:text-gray-500'
        ]"
      >
        <component :is="item.icon" class="w-6 h-6" />
        <span class="text-[10px] font-medium uppercase tracking-wider">{{ item.name }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  User 
} from 'lucide-vue-next';

const navItems = [
  { name: 'Home', path: '/', icon: LayoutDashboard },
  { name: 'Novo', path: '/expenses/new', icon: PlusCircle },
  { name: 'Histórico', path: '/expenses', icon: History },
  { name: 'Perfil', path: '/profile', icon: User },
];
</script>
