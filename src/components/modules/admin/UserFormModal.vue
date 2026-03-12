<template>
  <AppModal 
    :isOpen="isOpen" 
    @close="$emit('close')" 
    :title="user ? 'Editar Usuário' : 'Novo Usuário'"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppInput 
          v-model="form.name" 
          label="Nome Completo" 
          placeholder="Ex: João Silva" 
          required 
        />
        <AppInput 
          v-model="form.email" 
          label="E-mail" 
          type="email" 
          placeholder="exemplo@empresa.com" 
          required 
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Departamento</label>
          <select v-model="form.department" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 py-3 px-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all">
            <option value="TI">TI</option>
            <option value="Vendas">Vendas</option>
            <option value="Marketing">Marketing</option>
            <option value="RH">RH</option>
            <option value="Financeiro">Financeiro</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Perfil</label>
          <select v-model="form.role" class="w-full rounded-xl border-gray-200 dark:border-gray-700 dark:bg-gray-800 py-3 px-4 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all">
            <option value="ADMIN">Administrador</option>
            <option value="FUNCIONARIO">Funcionário</option>
          </select>
        </div>
      </div>

      <AppInput 
        v-model="form.limit" 
        label="Limite Mensal (R$)" 
        type="number" 
        placeholder="0.00" 
        required 
      />

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
  user: Object,
  loading: Boolean
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  email: '',
  department: 'TI',
  role: 'FUNCIONARIO',
  limit: 0
});

watch(() => props.user, (newUser) => {
  if (newUser) {
    form.value = { ...newUser };
  } else {
    form.value = {
      name: '',
      email: '',
      department: 'TI',
      role: 'FUNCIONARIO',
      limit: 0
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', { ...form.value });
};
</script>
