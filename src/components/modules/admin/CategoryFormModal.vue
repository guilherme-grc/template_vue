<template>
  <AppModal 
    :isOpen="isOpen" 
    @close="$emit('close')" 
    :title="category ? 'Editar Categoria' : 'Nova Categoria'"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppInput 
          v-model="form.name" 
          label="Nome da Categoria" 
          placeholder="Ex: Almoço" 
          required 
        />
        <AppInput 
          v-model="form.icon" 
          label="Emoji / Ícone" 
          placeholder="Ex: 🍱" 
          required 
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Cor Tailwind</label>
          <select v-model="form.color" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 py-3 px-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all">
            <option value="blue">Azul</option>
            <option value="green">Verde</option>
            <option value="red">Vermelho</option>
            <option value="yellow">Amarelo</option>
            <option value="orange">Laranja</option>
            <option value="purple">Roxo</option>
            <option value="indigo">Índigo</option>
            <option value="gray">Cinza</option>
            <option value="slate">Slate</option>
          </select>
        </div>
        <AppInput 
          v-model="form.maxAmount" 
          label="Valor Máximo (R$)" 
          type="number" 
          placeholder="0.00 (0 = ilimitado)" 
          required 
        />
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <AppButton variant="secondary" @click="$emit('close')">Cancelar</AppButton>
        <AppButton type="submit" :loading="loading">Salvar</AppButton>
      </div>
    </form>
  </AppModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import AppModal from '@/components/common/AppModal.vue';
import AppInput from '@/components/common/AppInput.vue';
import AppButton from '@/components/common/AppButton.vue';

const props = defineProps({
  isOpen: Boolean,
  category: Object,
  loading: Boolean
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  icon: '',
  color: 'blue',
  maxAmount: 0
});

watch(() => props.category, (newCat) => {
  if (newCat) {
    form.value = { ...newCat };
  } else {
    form.value = {
      name: '',
      icon: '',
      color: 'blue',
      maxAmount: 0
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', { ...form.value });
};
</script>
