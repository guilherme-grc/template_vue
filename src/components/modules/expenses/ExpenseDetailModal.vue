<template>
  <AppModal 
    :isOpen="isOpen" 
    @close="$emit('close')" 
    title="Detalhes do Reembolso"
    size="lg"
  >
    <div v-if="expense" class="space-y-6">
      <!-- Status Header -->
      <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-2xl shadow-sm">
            {{ expense.categoryIcon }}
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Status Atual</p>
            <AppBadge :variant="getStatusVariant(expense.status)">{{ expense.status }}</AppBadge>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Valor Total</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">R$ {{ expense.amount.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Descrição</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.description }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Estabelecimento</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.establishment }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Data da Despesa</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDate(expense.date) }}</p>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Categoria</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">{{ expense.category }}</p>
          </div>
          <div v-if="expense.rejectionReason">
            <p class="text-xs text-red-500 uppercase font-bold tracking-wider mb-1">Motivo da Rejeição</p>
            <p class="text-sm font-medium text-red-600 dark:text-red-400">{{ expense.rejectionReason }}</p>
          </div>
        </div>
      </div>

      <!-- Attachment Preview -->
      <div>
        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Comprovante Anexado</p>
        <div class="relative group rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 aspect-video flex items-center justify-center">
          <img 
            v-if="isImage" 
            :src="expense.attachmentUrl || 'https://picsum.photos/seed/receipt/800/600'" 
            class="w-full h-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
            @click="zoomImage"
          />
          <div v-else class="flex flex-col items-center gap-2">
            <FileText class="w-12 h-12 text-primary-600" />
            <p class="text-sm font-bold">comprovante.pdf</p>
            <AppButton size="sm" variant="secondary">Visualizar PDF</AppButton>
          </div>
          
          <div class="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <AppButton size="sm" variant="secondary" customClass="bg-white/90 backdrop-blur">
              <Download class="w-4 h-4" />
            </AppButton>
          </div>
        </div>
      </div>

      <!-- Admin Actions -->
      <div v-if="canUpdate && expense.status === 'Pendente'" class="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
        <p class="text-sm font-bold text-gray-900 dark:text-white">Ações do Administrador</p>
        <div class="flex flex-col sm:flex-row gap-3">
          <AppButton 
            variant="success" 
            block 
            @click="handleApprove"
            :loading="loading"
          >
            <template #left-icon><CheckCircle class="w-5 h-5" /></template>
            Aprovar Reembolso
          </AppButton>
          <AppButton 
            variant="danger" 
            block 
            @click="showRejectReason = true"
            :loading="loading"
          >
            <template #left-icon><XCircle class="w-5 h-5" /></template>
            Rejeitar
          </AppButton>
        </div>

        <div v-if="showRejectReason" class="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <AppInput 
            v-model="rejectionReason" 
            label="Justificativa da Rejeição" 
            placeholder="Informe o motivo da rejeição..." 
            required 
          />
          <div class="flex justify-end gap-2">
            <AppButton size="sm" variant="ghost" @click="showRejectReason = false">Cancelar</AppButton>
            <AppButton size="sm" variant="danger" @click="handleReject" :disabled="!rejectionReason">Confirmar Rejeição</AppButton>
          </div>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { FileText, Download, CheckCircle, XCircle } from 'lucide-vue-next';
import AppModal from '@/components/common/AppModal.vue';
import AppButton from '@/components/common/AppButton.vue';
import AppBadge from '@/components/common/AppBadge.vue';
import AppInput from '@/components/common/AppInput.vue';
import { expenseService } from '@/services/expenseService';
import { useToast } from '@/composables/useToast';
import { usePermissions } from '@/composables/usePermissions';

const props = defineProps({
  isOpen: Boolean,
  expense: Object
});

const emit = defineEmits(['close', 'updated']);

const toast = useToast();
const { can } = usePermissions();

const canUpdate = computed(() => can('reembolso', 'update'));
const isImage = ref(true); // Mocking image type
const loading = ref(false);
const showRejectReason = ref(false);
const rejectionReason = ref('');

const getStatusVariant = (status) => {
  const variants = {
    'Pendente': 'warning',
    'Aprovado': 'success',
    'Rejeitado': 'danger',
    'Rascunho': 'default'
  };
  return variants[status] || 'default';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const handleApprove = async () => {
  loading.value = true;
  try {
    await expenseService.updateStatus(props.expense.id, 'Aprovado');
    toast.success('Aprovado', 'Reembolso aprovado com sucesso!');
    emit('updated');
    emit('close');
  } catch (err) {
    toast.error('Erro', 'Não foi possível aprovar o reembolso.');
  } finally {
    loading.value = false;
  }
};

const handleReject = async () => {
  loading.value = true;
  try {
    await expenseService.updateStatus(props.expense.id, 'Rejeitado', rejectionReason.value);
    toast.success('Rejeitado', 'Reembolso rejeitado com sucesso.');
    emit('updated');
    emit('close');
  } catch (err) {
    toast.error('Erro', 'Não foi possível rejeitar o reembolso.');
  } finally {
    loading.value = false;
  }
};

const zoomImage = () => {
  // Simple zoom logic or open in new tab
  window.open(props.expense.attachmentUrl || 'https://picsum.photos/seed/receipt/1200/900', '_blank');
};
</script>
