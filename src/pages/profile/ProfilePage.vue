<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
      <AppButton variant="secondary" @click="handleLogout">
        <template #left-icon><LogOut class="w-5 h-5" /></template>
        Sair da Conta
      </AppButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Profile Card -->
      <div class="md:col-span-1 space-y-6">
        <div class="card p-6 text-center">
          <div class="relative inline-block mb-4">
            <div class="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-sm">
              {{ userInitials }}
            </div>
            <button class="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors">
              <Camera class="w-4 h-4" />
            </button>
          </div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ user?.name }}</h2>
          <p class="text-sm text-gray-500">{{ user?.role }} • {{ user?.department }}</p>
          
          <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-500">Limite Mensal</span>
              <span class="font-bold text-gray-900 dark:text-white">R$ {{ user?.limit?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00' }}</span>
            </div>
            <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div class="bg-primary-600 h-2 rounded-full" style="width: 45%"></div>
            </div>
            <p class="text-[10px] text-gray-400 mt-2 text-left uppercase font-bold tracking-wider">45% do limite utilizado</p>
          </div>
        </div>

        <div class="card p-4 space-y-2">
          <button class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            <div class="flex items-center gap-3">
              <Shield class="w-5 h-5 text-gray-400" />
              <span class="text-sm font-medium">Segurança</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-400" />
          </button>
          <button class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            <div class="flex items-center gap-3">
              <Bell class="w-5 h-5 text-gray-400" />
              <span class="text-sm font-medium">Notificações</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-400" />
          </button>
          <button class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300">
            <div class="flex items-center gap-3">
              <HelpCircle class="w-5 h-5 text-gray-400" />
              <span class="text-sm font-medium">Ajuda & Suporte</span>
            </div>
            <ChevronRight class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <!-- Settings Form -->
      <div class="md:col-span-2">
        <div class="card p-8">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Informações Pessoais</h3>
          
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AppInput 
                v-model="form.name" 
                label="Nome Completo" 
                required 
              />
              <AppInput 
                v-model="form.email" 
                label="E-mail" 
                type="email" 
                disabled 
                hint="O e-mail não pode ser alterado."
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AppInput 
                v-model="form.phone" 
                label="Telefone / WhatsApp" 
                placeholder="(00) 00000-0000"
              />
              <AppInput 
                v-model="form.department" 
                label="Departamento" 
                disabled
              />
            </div>

            <div class="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <AppButton type="submit" :loading="saving">
                Salvar Alterações
              </AppButton>
            </div>
          </form>
        </div>

        <div class="card p-8 mt-8 border-red-100 dark:border-red-900/30">
          <h3 class="text-lg font-bold text-red-600 mb-2">Zona de Perigo</h3>
          <p class="text-sm text-gray-500 mb-6">Ao excluir sua conta, todos os seus dados de reembolso serão permanentemente removidos.</p>
          <AppButton variant="danger">Excluir Minha Conta</AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  Camera, 
  LogOut, 
  ChevronRight, 
  Shield, 
  Bell, 
  HelpCircle 
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useAuth } from '@/composables/useAuth';
import AppButton from '@/components/common/AppButton.vue';
import AppInput from '@/components/common/AppInput.vue';
import { useToast } from '@/composables/useToast';

const authStore = useAuthStore();
const { logout } = useAuth();
const toast = useToast();

const user = computed(() => authStore.user);
const userInitials = computed(() => {
  if (!user.value?.name) return 'U';
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

const form = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
  phone: '(11) 98765-4321',
  department: user.value?.department || ''
});

const saving = ref(false);

const handleUpdateProfile = async () => {
  saving.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  saving.value = false;
  toast.success('Perfil Atualizado', 'Suas informações foram salvas com sucesso.');
};

const handleLogout = () => {
  logout();
};
</script>
