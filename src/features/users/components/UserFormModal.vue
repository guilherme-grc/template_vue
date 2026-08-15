<template>
  <AppModal :isOpen="isOpen" @close="$emit('close')" :title="user ? 'Editar Usuário' : 'Novo Usuário'">
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppInput v-model="form.name" label="Nome Completo" placeholder="Ex: João Silva" required />
        <AppInput v-model="form.email" label="E-mail" type="email" placeholder="exemplo@empresa.com" required />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Perfil</label>
        <select v-model="form.role" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 py-3 px-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all">
          <option value="ADMIN">Administrador</option>
          <option value="USER">Usuário</option>
        </select>
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <AppButton type="button" variant="secondary" @click="$emit('close')">Cancelar</AppButton>
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
  user: Object,
  loading: Boolean,
});

const emit = defineEmits(['close', 'save']);

const emptyForm = () => ({ name: '', email: '', role: 'USER', status: 'active' });

const form = ref(emptyForm());

watch(
  () => props.user,
  (user) => {
    form.value = user ? { ...user } : emptyForm();
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('save', { ...form.value });
};
</script>
