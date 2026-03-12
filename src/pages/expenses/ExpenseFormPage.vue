<template>
  <div class="max-w-4xl mx-auto space-y-4 pb-20">
    <div class="flex items-center gap-4 mb-2">
      <button @click="$router.back()" class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Novo Reembolso</h1>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Main Info Card -->
      <div class="card p-4 md:p-6 space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Selecione a Categoria</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              type="button"
              @click="form.categoryId = cat.id"
              class="flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200"
              :class="[
                form.categoryId === cat.id 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-4 ring-primary-500/10' 
                  : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
              ]"
            >
              <span class="text-3xl mb-2">{{ cat.icon }}</span>
              <span class="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">{{ cat.name }}</span>
            </button>
          </div>
        </div>

        <!-- Dynamic Form Section -->
        <DynamicForm v-model="form" :form="formConfig" />
      </div>

      <!-- Attachment Card -->
      <div class="card p-4 md:p-6">
        <h3 class="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Paperclip class="w-5 h-5 text-primary-600" />
          Comprovante / Recibo
        </h3>

        <div v-if="!form.attachment" class="relative">
          <input 
            type="file" 
            accept="image/*,application/pdf" 
            capture="environment"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            @change="handleFileChange"
          />
          <div class="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <div class="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 mb-4">
              <Camera class="w-8 h-8" />
            </div>
            <p class="font-bold text-gray-900 dark:text-white">Tirar Foto ou Anexar PDF</p>
            <p class="text-xs text-gray-500 mt-1">Formatos aceitos: JPG, PNG, PDF (Máx 5MB)</p>
          </div>
        </div>

        <div v-else class="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div v-if="form.attachment.type.startsWith('image/')" class="aspect-video flex items-center justify-center">
            <img :src="form.attachment.previewUrl" class="max-w-full max-h-full object-contain" />
          </div>
          <div v-else class="p-10 flex flex-col items-center justify-center">
            <FileText class="w-16 h-16 text-primary-600 mb-3" />
            <p class="font-bold text-gray-900 dark:text-white">{{ form.attachment.name }}</p>
            <p class="text-xs text-gray-500">{{ (form.attachment.size / 1024).toFixed(1) }} KB</p>
          </div>
          
          <button 
            type="button"
            @click="removeAttachment"
            class="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-xl shadow-lg hover:bg-red-700 transition-all active:scale-90"
          >
            <Trash2 class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 pt-4">
        <AppButton 
          type="submit" 
          block 
          size="lg"
          :loading="submitting"
          :disabled="!isFormValid"
        >
          Enviar para Reembolso
        </AppButton>
        <AppButton 
          variant="secondary" 
          block 
          size="lg"
          @click="saveDraft"
          type="button"
        >
          Salvar Rascunho
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ArrowLeft, 
  Paperclip, 
  Camera,
  Trash2
} from 'lucide-vue-next';
import AppButton from '@/components/common/AppButton.vue';
import DynamicForm from '@/components/common/DynamicForm.vue';
import { useUpload } from '@/composables/useUpload';
import { expenseService } from '@/services/expenseService';
import { categoryService } from '@/services/categoryService';
import { useToast } from '@/composables/useToast';
import { usePermissions } from '@/composables/usePermissions';

const router = useRouter();
const toast = useToast();
const { can } = usePermissions();
const { processFile } = useUpload();

const categories = ref([]);
const submitting = ref(false);

const projectOptions = [
  { label: 'Projeto Alpha', value: 'alpha' },
  { label: 'Projeto Beta', value: 'beta' },
  { label: 'Projeto Gamma', value: 'gamma' },
  { label: 'Marketing Q1', value: 'mkt_q1' },
  { label: 'Vendas Externas', value: 'sales' },
  { label: 'Treinamento', value: 'training' },
];

const form = ref({
  categoryId: null,
  amount: '',
  date: new Date().toISOString().split('T')[0],
  establishment: '',
  description: '',
  attachment: null,
  tags: [],
  paymentMethod: 'credit',
  confirmAccuracy: false
});

const formConfig = computed(() => [
  {
    label: "Valor (R$)",
    name: "amount",
    type: "number",
    step: "0.01",
    placeholder: "0,00",
    class: "col-span-12 md:col-span-4",
    required: true,
  },
  {
    label: "Data da Despesa",
    name: "date",
    type: "date",
    class: "col-span-12 md:col-span-4",
    required: true,
  },
  {
    label: "Estabelecimento",
    name: "establishment",
    type: "text",
    placeholder: "Ex: Uber, Restaurante...",
    class: "col-span-12 md:col-span-4",
    required: true,
  },
  {
    label: "Tags / Projetos",
    name: "tags",
    type: "select",
    multiple: true,
    options: projectOptions,
    class: "col-span-12 md:col-span-6",
  },
  {
    label: "Forma de Pagamento",
    name: "paymentMethod",
    type: "radio",
    options: [
      { label: "Cartão de Crédito", value: "credit" },
      { label: "Dinheiro / Pix", value: "cash" },
    ],
    class: "col-span-12 md:col-span-6",
  },
  {
    label: "Descrição Detalhada / Justificativa",
    name: "description",
    type: "rich-text",
    placeholder: "Descreva o motivo da despesa...",
    class: "col-span-12",
  },
  {
    label: "Confirmo que todas as informações acima são verdadeiras e precisas.",
    name: "confirmAccuracy",
    type: "checkbox",
    class: "col-span-12",
  }
]);

const isFormValid = computed(() => {
  return form.value.categoryId && 
         form.value.amount > 0 && 
         form.value.date && 
         form.value.establishment && 
         form.value.attachment &&
         form.value.confirmAccuracy;
});

const fetchCategories = async () => {
  categories.value = await categoryService.getAll();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    form.value.attachment = await processFile(file);
  } catch (err) {
    // Error handled in composable
  }
};

const removeAttachment = () => {
  form.value.attachment = null;
};

const saveDraft = () => {
  localStorage.setItem('expense_draft', JSON.stringify(form.value));
  toast.success('Rascunho Salvo', 'Você pode continuar depois.');
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await expenseService.create(form.value);
    toast.success('Sucesso!', 'Sua despesa foi enviada para análise.');
    localStorage.removeItem('expense_draft');
    router.push('/expenses');
  } catch (err) {
    toast.error('Erro', 'Não foi possível enviar a despesa.');
  } finally {
    submitting.value = false;
  }
};

// Auto-save draft
watch(form, (newVal) => {
  if (newVal.categoryId || newVal.amount || newVal.establishment) {
    localStorage.setItem('expense_draft_auto', JSON.stringify(newVal));
  }
}, { deep: true });

onMounted(async () => {
  await fetchCategories();
  
  const savedDraft = localStorage.getItem('expense_draft') || localStorage.getItem('expense_draft_auto');
  if (savedDraft) {
    const draft = JSON.parse(savedDraft);
    form.value = { ...draft, attachment: null };
  }
});
</script>
