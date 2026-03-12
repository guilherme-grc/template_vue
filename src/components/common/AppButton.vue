<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    :class="[
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
      sizeClasses[size],
      variantClasses[variant],
      block ? 'w-full' : '',
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <slot v-if="!loading" name="left-icon"></slot>
    <span v-if="loading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
    <slot v-else></slot>
    <slot v-if="!loading" name="right-icon"></slot>
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  customClass: { type: String, default: '' }
});

defineEmits(['click']);

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-2xl',
};

const variantClasses = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm shadow-primary-200 dark:shadow-none',
  secondary: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200 dark:shadow-none',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm shadow-green-200 dark:shadow-none',
};
</script>
