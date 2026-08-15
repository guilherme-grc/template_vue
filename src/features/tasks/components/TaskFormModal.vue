<template>
  <AppModal :isOpen="isOpen" @close="$emit('close')" :title="task ? 'Editar Tarefa' : 'Nova Tarefa'" size="lg">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <DynamicForm v-model="form" :form="formConfig" />

      <div class="mt-6 flex justify-end gap-3">
        <AppButton type="button" variant="secondary" @click="$emit('close')">Cancelar</AppButton>
        <AppButton type="submit" :loading="loading">Salvar</AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import AppModal from '@/components/common/AppModal.vue';
import AppButton from '@/components/common/AppButton.vue';
import DynamicForm from '@/components/common/DynamicForm.vue';

const props = defineProps({
  isOpen: Boolean,
  task: Object,
  loading: Boolean,
});

const emit = defineEmits(['close', 'save']);

const emptyForm = () => ({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  status: 'pending',
});

const form = ref(emptyForm());

watch(
  () => props.task,
  (task) => {
    form.value = task ? { ...task } : emptyForm();
  },
  { immediate: true }
);

const formConfig = computed(() => [
  {
    label: 'Título',
    name: 'title',
    type: 'text',
    placeholder: 'Ex: Revisar módulo X',
    class: 'col-span-12',
    required: true,
  },
  {
    label: 'Prazo',
    name: 'dueDate',
    type: 'date',
    class: 'col-span-12 md:col-span-6',
  },
  {
    label: 'Prioridade',
    name: 'priority',
    type: 'select',
    options: [
      { label: 'Baixa', value: 'low' },
      { label: 'Média', value: 'medium' },
      { label: 'Alta', value: 'high' },
    ],
    class: 'col-span-12 md:col-span-6',
  },
  {
    label: 'Descrição',
    name: 'description',
    type: 'rich-text',
    placeholder: 'Detalhe a tarefa...',
    class: 'col-span-12',
  },
]);

const handleSubmit = () => {
  emit('save', { ...form.value });
};
</script>
