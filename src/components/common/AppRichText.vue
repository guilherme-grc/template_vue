<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
      {{ label }}
    </label>
    <div 
      class="rich-text-container bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10"
    >
      <div ref="editorElement" class="min-h-[150px] dark:text-white"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Escreva aqui...'
  }
});

const emit = defineEmits(['update:modelValue']);

const editorElement = ref(null);
let quill = null;

onMounted(() => {
  quill = new Quill(editorElement.value, {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
      ]
    }
  });

  // Set initial content
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue;
  }

  // Listen for changes
  quill.on('text-change', () => {
    const html = quill.root.innerHTML;
    if (html === '<p><br></p>') {
      emit('update:modelValue', '');
    } else {
      emit('update:modelValue', html);
    }
  });
});

// Watch for external changes
watch(() => props.modelValue, (newVal) => {
  if (quill && newVal !== quill.root.innerHTML) {
    quill.root.innerHTML = newVal || '';
  }
});
</script>

<style>
/* Custom Quill Styling to match app theme */
.ql-toolbar.ql-snow {
  border: none !important;
  border-bottom: 1px solid #f3f4f6 !important;
  padding: 8px !important;
}

.dark .ql-toolbar.ql-snow {
  border-bottom-color: #374151 !important;
  background-color: #1f2937 !important;
}

.ql-container.ql-snow {
  border: none !important;
  font-family: inherit !important;
  font-size: 0.875rem !important;
}

.ql-editor {
  padding: 16px !important;
}

.ql-editor.ql-blank::before {
  color: #9ca3af !important;
  font-style: normal !important;
  left: 16px !important;
}

.dark .ql-editor {
  color: white !important;
}

.dark .ql-stroke {
  stroke: #9ca3af !important;
}

.dark .ql-fill {
  fill: #9ca3af !important;
}

.dark .ql-picker {
  color: #9ca3af !important;
}
</style>
