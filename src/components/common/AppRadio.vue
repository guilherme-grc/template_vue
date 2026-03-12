<template>
  <label class="flex items-center gap-3 cursor-pointer group select-none">
    <div class="relative flex items-center justify-center">
      <input 
        type="radio" 
        :name="name"
        :value="value"
        :checked="modelValue === value"
        @change="$emit('update:modelValue', value)"
        class="peer sr-only"
        :disabled="disabled"
      />
      <div 
        class="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full transition-all duration-200 peer-checked:border-primary-600 group-hover:border-primary-400 peer-focus:ring-4 peer-focus:ring-primary-500/10"
        :class="{ 'opacity-50 cursor-not-allowed': disabled }"
      ></div>
      <div 
        class="absolute w-2.5 h-2.5 bg-primary-600 rounded-full scale-0 transition-transform duration-200 peer-checked:scale-100 pointer-events-none"
      ></div>
    </div>
    <span v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
      {{ label }}
    </span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  value: {
    type: [String, Number, Boolean],
    required: true
  },
  name: {
    type: String,
    required: true
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
