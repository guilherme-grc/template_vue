<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all"
              :class="maxWidthClass"
            >
              <div class="flex items-center justify-between mb-4">
                <DialogTitle as="h3" class="text-lg font-bold leading-6 text-gray-900 dark:text-white">
                  {{ title }}
                </DialogTitle>
                <button 
                  @click="closeModal" 
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <div class="mt-2">
                <slot></slot>
              </div>

              <div v-if="$slots.footer" class="mt-6 flex items-center justify-end gap-3">
                <slot name="footer"></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { X } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  size: { type: String, default: 'md' }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const maxWidthClass = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };
  return sizes[props.size];
});
</script>
