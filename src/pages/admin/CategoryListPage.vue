<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Categorias de Despesa</h1>
        <p class="text-gray-500 dark:text-gray-400">Configure os tipos de despesas permitidos e seus limites.</p>
      </div>
      <AppButton @click="openCreateModal">
        <template #left-icon><Plus class="w-5 h-5" /></template>
        Nova Categoria
      </AppButton>
    </div>

    <!-- Categories Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="category in categories" :key="category.id" class="card group hover:border-primary-500 transition-all duration-300">
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div 
              class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
              :class="`bg-${category.color}-100 dark:bg-${category.color}-900/30`"
            >
              {{ category.icon }}
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button @click="editCategory(category)" class="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                <Edit2 class="w-4 h-4" />
              </button>
              <button @click="deleteCategory(category)" class="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ category.name }}</h3>
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
            <span class="text-xs text-gray-500 uppercase font-bold tracking-wider">Limite</span>
            <span class="text-sm font-bold" :class="category.maxAmount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
              {{ category.maxAmount > 0 ? `R$ ${category.maxAmount.toFixed(2)}` : 'Ilimitado' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Form Modal -->
    <CategoryFormModal 
      :isOpen="isModalOpen" 
      :category="editingCategory" 
      :loading="submitting"
      @close="closeModal" 
      @save="handleSave" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Plus, Edit2, Trash2 } from 'lucide-vue-next';
import AppButton from '@/components/common/AppButton.vue';
import CategoryFormModal from '@/components/modules/admin/CategoryFormModal.vue';
import { categoryService } from '@/services/categoryService';
import { useToast } from '@/composables/useToast';

const toast = useToast();
const categories = ref([]);
const isModalOpen = ref(false);
const editingCategory = ref(null);
const submitting = ref(false);

const fetchCategories = async () => {
  categories.value = await categoryService.getAll();
};

const openCreateModal = () => {
  editingCategory.value = null;
  isModalOpen.value = true;
};

const editCategory = (category) => {
  editingCategory.value = { ...category };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingCategory.value = null;
};

const handleSave = async (data) => {
  submitting.value = true;
  try {
    if (editingCategory.value) {
      await categoryService.update(editingCategory.value.id, data);
      toast.success('Sucesso', 'Categoria atualizada com sucesso!');
    } else {
      await categoryService.create(data);
      toast.success('Sucesso', 'Categoria criada com sucesso!');
    }
    await fetchCategories();
    closeModal();
  } catch (err) {
    toast.error('Erro', 'Não foi possível salvar a categoria.');
  } finally {
    submitting.value = false;
  }
};

const deleteCategory = async (category) => {
  if (!confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) return;
  
  try {
    await categoryService.delete(category.id);
    toast.success('Sucesso', 'Categoria excluída com sucesso!');
    await fetchCategories();
  } catch (err) {
    toast.error('Erro', 'Não foi possível excluir a categoria.');
  }
};

onMounted(fetchCategories);
</script>
