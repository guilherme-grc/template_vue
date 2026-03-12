<template>
  <div class="relative w-full" ref="container">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
      {{ label }}
    </label>
    
    <div 
      class="min-h-[46px] w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 flex flex-wrap gap-2 cursor-pointer focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 transition-all"
      @click="toggleDropdown"
    >
      <div 
        v-for="option in selectedOptions" 
        :key="option.value"
        class="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"
      >
        {{ option.label }}
        <button @click.stop="removeOption(option)" class="hover:text-primary-900 dark:hover:text-primary-100">
          <X class="w-3 h-3" />
        </button>
      </div>
      
      <input
        v-if="searchable"
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="flex-1 bg-transparent border-none outline-none text-sm min-w-[60px] dark:text-white"
        :placeholder="selectedOptions.length === 0 ? placeholder : ''"
        @input="isOpen = true"
        @keydown.delete="handleBackspace"
      />
      <div v-else-if="selectedOptions.length === 0" class="text-gray-400 text-sm py-1">
        {{ placeholder }}
      </div>

      <div class="ml-auto flex items-center text-gray-400">
        <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isOpen }" />
      </div>
    </div>

    <!-- Dropdown -->
    <transition name="fade-slide">
      <div 
        v-if="isOpen" 
        class="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-60 overflow-y-auto py-2"
      >
        <div 
          v-for="option in filteredOptions" 
          :key="option.value"
          class="px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between"
          :class="{ 'text-primary-600 bg-primary-50/50 dark:bg-primary-900/10': isSelected(option) }"
          @click="selectOption(option)"
        >
          <span :class="{ 'font-bold': isSelected(option) }">{{ option.label }}</span>
          <Check v-if="isSelected(option)" class="w-4 h-4" />
        </div>
        <div v-if="filteredOptions.length === 0" class="px-4 py-8 text-center text-gray-500 text-sm">
          Nenhum resultado encontrado.
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { X, ChevronDown, Check } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true // [{ label: 'Option 1', value: 1 }, ...]
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Selecione...'
  },
  searchable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');
const container = ref(null);
const searchInput = ref(null);

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectedOptions = computed(() => {
  return props.options.filter(opt => props.modelValue.includes(opt.value));
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && props.searchable) {
    setTimeout(() => searchInput.value?.focus(), 0);
  }
};

const selectOption = (option) => {
  const newValue = [...props.modelValue];
  const index = newValue.indexOf(option.value);
  
  if (index > -1) {
    newValue.splice(index, 1);
  } else {
    newValue.push(option.value);
  }
  
  emit('update:modelValue', newValue);
  searchQuery.value = '';
};

const removeOption = (option) => {
  const newValue = props.modelValue.filter(v => v !== option.value);
  emit('update:modelValue', newValue);
};

const isSelected = (option) => props.modelValue.includes(option.value);

const handleBackspace = () => {
  if (!searchQuery.value && props.modelValue.length > 0) {
    const newValue = [...props.modelValue];
    newValue.pop();
    emit('update:modelValue', newValue);
  }
};

const handleClickOutside = (event) => {
  if (container.value && !container.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
