<template>
  <div class="grid grid-cols-12 gap-4">
    <div 
      v-for="(field, index) in form" 
      :key="field.name || index"
      :class="field.class || 'col-span-12'"
    >
      <!-- Text, Number, Date, Email, Password -->
      <AppInput
        v-if="['text', 'number', 'date', 'email', 'password'].includes(field.type)"
        :modelValue="getValue(field.name)"
        @update:modelValue="setValue(field.name, $event)"
        :label="field.label"
        :type="field.type"
        :placeholder="field.placeholder"
        :required="field.required"
        :disabled="field.disabled || readonly"
        :step="field.step"
      />

      <!-- Textarea -->
      <div v-else-if="field.type === 'textarea'" class="space-y-1.5">
        <label v-if="field.label" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <textarea
          :value="getValue(field.name)"
          @input="setValue(field.name, $event.target.value)"
          class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all min-h-[100px] dark:text-white"
          :placeholder="field.placeholder"
          :required="field.required"
          :disabled="field.disabled || readonly"
        ></textarea>
      </div>

      <!-- Select (Standard) -->
      <div v-else-if="field.type === 'select' && !field.multiple" class="space-y-1.5">
        <label v-if="field.label" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <select
          :value="getValue(field.name)"
          @change="setValue(field.name, $event.target.value)"
          class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all dark:text-white"
          :required="field.required"
          :disabled="field.disabled || readonly"
        >
          <option value="" disabled>{{ field.placeholder || 'Selecione...' }}</option>
          <option 
            v-for="opt in field.options" 
            :key="getOptionValue(opt, field)" 
            :value="getOptionValue(opt, field)"
          >
            {{ getOptionLabel(opt, field) }}
          </option>
        </select>
      </div>

      <!-- Multi-Select / Searchable Select -->
      <AppMultiSelect
        v-else-if="field.type === 'select' && field.multiple"
        :modelValue="getValue(field.name) || []"
        @update:modelValue="setValue(field.name, $event)"
        :label="field.label"
        :placeholder="field.placeholder"
        :options="formatOptions(field.options, field)"
        :searchable="field.searchable !== false"
        :disabled="field.disabled || readonly"
      />

      <!-- Rich Text Editor -->
      <AppRichText
        v-else-if="field.type === 'rich-text'"
        :modelValue="getValue(field.name)"
        @update:modelValue="setValue(field.name, $event)"
        :label="field.label"
        :placeholder="field.placeholder"
        :disabled="field.disabled || readonly"
      />

      <!-- Radio Group -->
      <div v-else-if="field.type === 'radio'" class="space-y-3">
        <label v-if="field.label" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {{ field.label }}
          <span v-if="field.required" class="text-red-500">*</span>
        </label>
        <div class="flex flex-wrap gap-6">
          <AppRadio
            v-for="opt in field.options"
            :key="getOptionValue(opt, field)"
            :modelValue="getValue(field.name)"
            @update:modelValue="setValue(field.name, $event)"
            :name="field.name"
            :value="getOptionValue(opt, field)"
            :label="getOptionLabel(opt, field)"
            :disabled="field.disabled || readonly"
          />
        </div>
      </div>

      <!-- Checkbox -->
      <AppCheckbox
        v-else-if="field.type === 'checkbox'"
        :modelValue="getValue(field.name)"
        @update:modelValue="setValue(field.name, $event)"
        :label="field.label"
        :disabled="field.disabled || readonly"
      />
    </div>
  </div>
</template>

<script setup>
import { getNestedValue, setNestedValue } from '@/utils/objectUtils';
import AppInput from '@/components/common/AppInput.vue';
import AppMultiSelect from '@/components/common/AppMultiSelect.vue';
import AppRichText from '@/components/common/AppRichText.vue';
import AppRadio from '@/components/common/AppRadio.vue';
import AppCheckbox from '@/components/common/AppCheckbox.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  form: {
    type: Array,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const getValue = (path) => {
  return getNestedValue(props.modelValue, path);
};

const setValue = (path, value) => {
  const newModel = { ...props.modelValue };
  setNestedValue(newModel, path, value);
  emit('update:modelValue', newModel);
};

const getOptionLabel = (opt, field) => {
  if (typeof opt === 'string') return opt;
  return opt[field.valueLabel || 'label'];
};

const getOptionValue = (opt, field) => {
  if (typeof opt === 'string') return opt;
  return opt[field.valueProp || 'value'];
};

const formatOptions = (options, field) => {
  if (!options) return [];
  return options.map(opt => ({
    label: getOptionLabel(opt, field),
    value: getOptionValue(opt, field)
  }));
};
</script>
