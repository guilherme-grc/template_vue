import { ref, computed } from 'vue';

export function useDataTable(initialData, options = {}) {
  const data = ref(initialData);
  const sortColumn = ref(options.defaultSortColumn || '');
  const sortDirection = ref(options.defaultSortDirection || 'asc'); // 'asc' or 'desc'

  const sortedData = computed(() => {
    if (!sortColumn.value) return data.value;

    return [...data.value].sort((a, b) => {
      let valA = a[sortColumn.value];
      let valB = b[sortColumn.value];

      // Handle nested properties if needed (e.g., 'user.name')
      if (sortColumn.value.includes('.')) {
        valA = sortColumn.value.split('.').reduce((obj, key) => obj?.[key], a);
        valB = sortColumn.value.split('.').reduce((obj, key) => obj?.[key], b);
      }

      if (valA === valB) return 0;
      
      const modifier = sortDirection.value === 'asc' ? 1 : -1;
      
      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * modifier;
      }
      
      return (valA > valB ? 1 : -1) * modifier;
    });
  });

  const toggleSort = (column) => {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn.value = column;
      sortDirection.value = 'asc';
    }
  };

  const exportToCSV = (filename = 'export.csv', columns = []) => {
    if (data.value.length === 0) return;

    const headers = columns.length > 0 ? columns.map(c => c.label) : Object.keys(data.value[0]);
    const keys = columns.length > 0 ? columns.map(c => c.key) : Object.keys(data.value[0]);

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of sortedData.value) {
      const values = keys.map(key => {
        let val = key.includes('.') ? key.split('.').reduce((obj, k) => obj?.[k], row) : row[key];
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    data,
    sortColumn,
    sortDirection,
    sortedData,
    toggleSort,
    exportToCSV
  };
}
