<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative group">
      <div v-if="$slots.icon" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors">
        <slot name="icon"></slot>
      </div>
      
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="w-full bg-white dark:bg-gray-800 border transition-all duration-200 outline-none rounded-xl text-sm py-3"
        :class="[
          $slots.icon ? 'pl-12 pr-4' : 'px-4',
          error 
            ? 'border-red-300 dark:border-red-900 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900' : ''
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
      />
    </div>
    
    <p v-if="error" class="mt-1.5 text-xs text-red-500 font-medium">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-xs text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  id: String,
  error: String,
  hint: String,
  required: Boolean,
  disabled: Boolean
});

defineEmits(['update:modelValue', 'blur']);
</script>
