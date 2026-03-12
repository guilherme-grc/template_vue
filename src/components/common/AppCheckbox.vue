<template>
  <label class="flex items-center gap-3 cursor-pointer group select-none">
    <div class="relative flex items-center justify-center">
      <input 
        type="checkbox" 
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="peer sr-only"
        :disabled="disabled"
      />
      <div 
        class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-md transition-all duration-200 peer-checked:bg-primary-600 peer-checked:border-primary-600 group-hover:border-primary-400 peer-focus:ring-4 peer-focus:ring-primary-500/10"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      ></div>
      <svg 
        class="absolute w-3.5 h-3.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100 pointer-events-none" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        stroke-width="4"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
      {{ label }}
    </span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>
