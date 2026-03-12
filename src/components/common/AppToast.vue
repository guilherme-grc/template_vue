<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[280px] max-w-md"
        :class="[
          toast.type === 'success' ? 'bg-white dark:bg-gray-800 border-green-100 dark:border-green-900/30' : '',
          toast.type === 'error' ? 'bg-white dark:bg-gray-800 border-red-100 dark:border-red-900/30' : '',
          toast.type === 'info' ? 'bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900/30' : '',
        ]"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          :class="[
            toast.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : '',
            toast.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : '',
            toast.type === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : '',
          ]"
        >
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
          <XCircle v-else-if="toast.type === 'error'" class="w-5 h-5" />
          <Info v-else class="w-5 h-5" />
        </div>
        
        <div class="flex-1">
          <p class="text-sm font-bold text-gray-900 dark:text-white">{{ toast.title }}</p>
          <p v-if="toast.message" class="text-xs text-gray-500 dark:text-gray-400">{{ toast.message }}</p>
        </div>
        
        <button @click="remove(toast.id)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next';
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
