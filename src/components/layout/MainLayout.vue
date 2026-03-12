<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Desktop Sidebar -->
    <AppSidebar />

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Header -->
      <AppHeader />

      <!-- Main Content -->
      <main class="flex-1 p-4 pb-24 md:pb-4">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>

      <!-- Mobile Bottom Nav -->
      <AppBottomNav />
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue';
import AppBottomNav from './AppBottomNav.vue';
import AppHeader from './AppHeader.vue';
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
