<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div class="card w-full max-w-md p-8">
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary-200 dark:shadow-none">
          <Receipt class="w-10 h-10" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Reembolso<span class="text-primary-600">Pro</span></h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Acesse sua conta para continuar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <AppInput
          v-model="email"
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          required
        >
          <template #icon>
            <Mail class="w-5 h-5" />
          </template>
        </AppInput>

        <AppInput
          v-model="password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          required
        >
          <template #icon>
            <Lock class="w-5 h-5" />
          </template>
        </AppInput>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            <span class="text-gray-600 dark:text-gray-400">Lembrar de mim</span>
          </label>
          <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Esqueceu a senha?</a>
        </div>

        <AppButton
          type="submit"
          block
          :loading="loading"
        >
          Entrar
        </AppButton>
      </form>

      <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
        <p class="text-xs text-gray-400">
          Dica: admin@reembolso.com / admin123<br>
          ou user@reembolso.com / user123
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Mail, Lock, Receipt } from 'lucide-vue-next';
import AppInput from '@/components/common/AppInput.vue';
import AppButton from '@/components/common/AppButton.vue';
import { useAuth } from '@/composables/useAuth';

const email = ref('');
const password = ref('');
const { login, loading } = useAuth();

const handleLogin = () => {
  login(email.value, password.value);
};
</script>
