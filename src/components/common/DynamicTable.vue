<template>
  <div class="space-y-4">
    <!-- Table Toolbar -->
    <div v-if="searchable || exportable" class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div v-if="searchable" class="w-full md:max-w-md">
        <AppInput 
          v-model="searchQuery" 
          :placeholder="searchPlaceholder"
          class="w-full"
        >
          <template #icon><Search class="w-5 h-5" /></template>
        </AppInput>
      </div>
      
      <div v-if="exportable" class="flex items-center gap-2">
        <AppButton variant="secondary" size="sm" @click="handleExport">
          <template #left-icon><Download class="w-4 h-4" /></template>
          Exportar CSV
        </AppButton>
      </div>
    </div>

    <!-- Table Container -->
    <div class="card overflow-hidden border border-gray-100 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
            <tr>
              <th 
                v-for="col in columns" 
                :key="col.key"
                @click="col.sortable !== false && toggleSort(col.key)"
                class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider select-none transition-colors"
                :class="[
                  col.sortable !== false ? 'cursor-pointer hover:text-primary-600' : '',
                  col.align === 'right' ? 'text-right' : (col.align === 'center' ? 'text-center' : 'text-left'),
                  col.class || ''
                ]"
              >
                <div class="flex items-center gap-2" :class="[
                  col.align === 'right' ? 'justify-end' : (col.align === 'center' ? 'justify-center' : 'justify-start')
                ]">
                  {{ col.label }}
                  <template v-if="col.sortable !== false">
                    <ChevronUp v-if="sortColumn === col.key && sortDirection === 'asc'" class="w-3 h-3 text-primary-600" />
                    <ChevronDown v-else-if="sortColumn === col.key && sortDirection === 'desc'" class="w-3 h-3 text-primary-600" />
                    <ChevronsUpDown v-else class="w-3 h-3 opacity-30" />
                  </template>
                </div>
              </th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700 relative">
            <!-- Loading Overlay -->
            <div v-if="loading" class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div class="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <tr 
              v-for="(row, rowIndex) in filteredAndSortedData" 
              :key="row.id || rowIndex"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group"
              @click="$emit('row-click', row)"
              :class="{ 'cursor-pointer': clickable }"
            >
              <td 
                v-for="col in columns" 
                :key="col.key"
                class="px-6 py-4 text-sm"
                :class="[
                  col.align === 'right' ? 'text-right' : (col.align === 'center' ? 'text-center' : 'text-left'),
                  col.cellClass || ''
                ]"
              >
                <!-- Slot for custom cell rendering -->
                <slot :name="`cell(${col.key})`" :value="getCellValue(row, col.key)" :row="row">
                  <span class="text-gray-600 dark:text-gray-300">
                    {{ formatValue(getCellValue(row, col.key), col) }}
                  </span>
                </slot>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredAndSortedData.length === 0 && !loading">
              <td :colspan="columns.length" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center justify-center text-gray-400">
                  <Inbox class="w-12 h-12 mb-2 opacity-20" />
                  <p class="text-base font-medium">{{ emptyText }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination (Optional Placeholder) -->
    <div v-if="pagination && totalPages > 1" class="flex items-center justify-between px-2">
      <p class="text-sm text-gray-500">
        Mostrando {{ filteredAndSortedData.length }} de {{ data.length }} registros
      </p>
      <!-- Add actual pagination controls here if needed -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Search, Download, ChevronUp, ChevronDown, ChevronsUpDown, Inbox, X } from 'lucide-vue-next';
import AppInput from '@/components/common/AppInput.vue';
import AppButton from '@/components/common/AppButton.vue';
import { useDataTable } from '@/composables/useDataTable';
import { getNestedValue } from '@/utils/objectUtils';

const props = defineProps({
  columns: {
    type: Array,
    required: true
    // [{ key: 'name', label: 'Name', sortable: true, align: 'left', format: (val) => ... }]
  },
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: 'Pesquisar...'
  },
  exportable: {
    type: Boolean,
    default: false
  },
  exportFilename: {
    type: String,
    default: 'export.csv'
  },
  clickable: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: 'Nenhum registro encontrado.'
  },
  pagination: {
    type: Boolean,
    default: false
  },
  defaultSort: {
    type: Object,
    default: () => ({ column: '', direction: 'asc' })
  }
});

const emit = defineEmits(['row-click', 'export']);

const searchQuery = ref('');

const { 
  data: tableData, 
  sortedData, 
  sortColumn, 
  sortDirection, 
  toggleSort, 
  exportToCSV 
} = useDataTable(props.data, { 
  defaultSortColumn: props.defaultSort.column, 
  defaultSortDirection: props.defaultSort.direction 
});

// Keep internal data in sync with prop
watch(() => props.data, (newVal) => {
  tableData.value = newVal;
}, { deep: true });

const filteredAndSortedData = computed(() => {
  if (!searchQuery.value) return sortedData.value;
  
  const query = searchQuery.value.toLowerCase();
  return sortedData.value.filter(row => {
    return props.columns.some(col => {
      if (col.searchable === false) return false;
      const val = getCellValue(row, col.key);
      return String(val).toLowerCase().includes(query);
    });
  });
});

const getCellValue = (row, key) => {
  return getNestedValue(row, key);
};

const formatValue = (val, col) => {
  if (col.format) return col.format(val);
  if (val === null || val === undefined) return '-';
  return val;
};

const handleExport = () => {
  const exportCols = props.columns
    .filter(c => c.exportable !== false && c.key !== 'actions')
    .map(c => ({ key: c.key, label: c.label }));
    
  exportToCSV(props.exportFilename, exportCols);
  emit('export');
};
</script>
