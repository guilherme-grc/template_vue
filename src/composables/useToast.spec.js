import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToast } from './useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // toasts is module-level state; clear it between tests
    const { toasts } = useToast();
    toasts.value.splice(0);
  });

  it('adds a toast with the given type', () => {
    const { success, toasts } = useToast();
    success('Title', 'Message');
    expect(toasts.value).toHaveLength(1);
    expect(toasts.value[0]).toMatchObject({ title: 'Title', message: 'Message', type: 'success' });
  });

  it('auto-removes the toast after its duration', () => {
    const { add, toasts } = useToast();
    add({ title: 'T', message: 'M', duration: 1000 });
    expect(toasts.value).toHaveLength(1);
    vi.advanceTimersByTime(1000);
    expect(toasts.value).toHaveLength(0);
  });

  it('removes a toast by id', () => {
    const { add, remove, toasts } = useToast();
    add({ title: 'T', message: 'M', duration: 0 });
    const id = toasts.value[0].id;
    remove(id);
    expect(toasts.value).toHaveLength(0);
  });
});
