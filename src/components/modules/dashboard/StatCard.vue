<template>
  <div class="card p-6 flex items-center gap-4">
    <div 
      class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
      :class="colorClasses"
    >
      <component :is="icon" class="w-6 h-6" />
    </div>
    
    <div>
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{{ label }}</p>
      <div class="flex items-baseline gap-2">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ value }}</h3>
        <span v-if="trend" class="text-xs font-bold" :class="trend > 0 ? 'text-green-500' : 'text-red-500'">
          {{ trend > 0 ? '+' : '' }}{{ trend }}%
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  value: [String, Number],
  icon: Object,
  variant: { type: String, default: 'primary' },
  trend: Number
});

const colorClasses = computed(() => {
  const variants = {
    primary: 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
    success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    danger: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  };
  return variants[props.variant];
});
</script>
