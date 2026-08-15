<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
    <div class="card w-full max-w-md p-8">
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-primary-200 dark:shadow-none">
          <Boxes class="w-10 h-10" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ appName }}</h1>
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
          Dica: admin@example.com / admin123<br>
          ou user@example.com / user123
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Mail, Lock, Boxes } from 'lucide-vue-next';
import AppInput from '@/components/common/AppInput.vue';
import AppButton from '@/components/common/AppButton.vue';
import { useAuth } from '@/features/auth/composables/useAuth';
import { env } from '@/config/env';

const appName = env.appName;
const email = ref('');
const password = ref('');
const { login, loading } = useAuth();

const handleLogin = () => {
  login(email.value, password.value);
};
</script>
