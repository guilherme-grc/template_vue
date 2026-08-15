<template>
  <aside 
    class="hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 transition-all duration-300 ease-in-out z-50"
    :class="[isExpanded ? 'w-64' : 'w-20']"
    @mouseenter="uiStore.setHover(true)"
    @mouseleave="uiStore.setHover(false)"
  >
    <!-- Header -->
    <div class="p-4 flex items-center" :class="[isExpanded ? 'justify-between' : 'justify-center']">
      <div v-if="isExpanded" class="flex items-center gap-4 text-primary-600 overflow-hidden whitespace-nowrap">
        <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shrink-0">
          <Boxes class="w-6 h-6" />
        </div>
        <span class="font-bold text-xl tracking-tight text-gray-900 dark:text-white">{{ appName }}</span>
      </div>
      <div v-else class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shrink-0">
        <Boxes class="w-6 h-6" />
      </div>
    </div>

    <nav class="flex-1 px-4 space-y-1 mt-4 overflow-y-auto overflow-x-hidden">
      <div v-for="item in menuItems" :key="item.name">
        <!-- Regular Item -->
        <router-link 
          v-if="!item.children"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors group relative"
          :class="[
            $route.path === item.path 
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span 
            v-if="isExpanded" 
            class="font-medium transition-opacity duration-300"
          >
            {{ item.name }}
          </span>
          
          <!-- Tooltip for collapsed state -->
          <div 
            v-if="!isExpanded"
            class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]"
          >
            {{ item.name }}
          </div>
        </router-link>

        <!-- Dropdown Item -->
        <div v-else class="space-y-1">
          <button 
            @click="toggleSubmenu(item.name)"
            class="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors group relative"
            :class="[
              isSubmenuOpen(item.name)
                ? 'text-primary-600' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 shrink-0" />
            <span 
              v-if="isExpanded" 
              class="font-medium flex-1 text-left"
            >
              {{ item.name }}
            </span>
            <ChevronDown 
              v-if="isExpanded" 
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isSubmenuOpen(item.name) }"
            />

            <!-- Tooltip for collapsed state -->
            <div 
              v-if="!isExpanded"
              class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]"
            >
              {{ item.name }}
            </div>
          </button>

          <!-- Submenu Content -->
          <div 
            v-if="isSubmenuOpen(item.name) && isExpanded" 
            class="pl-10 space-y-1 animate-in slide-in-from-top-1 duration-200"
          >
            <router-link 
              v-for="child in item.children" 
              :key="child.path" 
              :to="child.path"
              class="flex items-center gap-4 px-4 py-2 rounded-xl text-sm transition-colors"
              :class="[
                $route.path === child.path 
                  ? 'text-primary-600 font-bold' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary-600'
              ]"
            >
              {{ child.name }}
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <div class="p-4 border-t border-gray-200 dark:border-gray-700">
      <button 
        @click="handleLogout"
        class="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group relative"
      >
        <LogOut class="w-5 h-5 shrink-0" />
        <span v-if="isExpanded" class="font-medium">Sair</span>
        
        <!-- Tooltip for collapsed state -->
        <div 
          v-if="!isExpanded"
          class="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]"
        >
          Sair
        </div>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  LayoutDashboard,
  ListTodo,
  Users,
  Settings,
  LogOut,
  Boxes,
  ChevronDown,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useAuth } from '@/features/auth/composables/useAuth';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';
import { usePermissions } from '@/composables/usePermissions';
import { env } from '@/config/env';

const appName = env.appName;
const router = useRouter();
const { logout } = useAuth();
const authStore = useAuthStore();
const uiStore = useUIStore();
const { can } = usePermissions();

const isExpanded = computed(() => uiStore.isSidebarExpanded || uiStore.isHovered);

const openSubmenus = ref([]);

const menuItems = computed(() => {
  const items = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, show: true },
    { name: 'Tarefas', path: '/tasks', icon: ListTodo, show: can('task', 'view') },
    { name: 'Usuários', path: '/admin/users', icon: Users, show: authStore.isAdmin },
    { name: 'Perfil', path: '/profile', icon: Settings, show: true },
  ];

  return items.filter((item) => item.show);
});

const toggleSubmenu = (name) => {
  const index = openSubmenus.value.indexOf(name);
  if (index > -1) {
    openSubmenus.value.splice(index, 1);
  } else {
    openSubmenus.value.push(name);
  }
};

const isSubmenuOpen = (name) => openSubmenus.value.includes(name);

const handleLogout = () => {
  logout();
};
</script>
