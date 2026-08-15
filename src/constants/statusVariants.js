/**
 * Central status -> label/badge-variant map. Any feature with a status field
 * imports this instead of redefining its own copy (kills the duplication
 * that used to live in every list page).
 */
export const TASK_STATUS = {
  pending: { label: 'Pendente', variant: 'warning' },
  in_progress: { label: 'Em Andamento', variant: 'info' },
  done: { label: 'Concluída', variant: 'success' },
};

export const USER_STATUS = {
  active: { label: 'Ativo', variant: 'success' },
  inactive: { label: 'Inativo', variant: 'default' },
};

export function statusLabel(map, key) {
  return map[key]?.label ?? key;
}

export function statusVariant(map, key) {
  return map[key]?.variant ?? 'default';
}
