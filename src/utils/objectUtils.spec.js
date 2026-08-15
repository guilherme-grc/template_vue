import { describe, it, expect } from 'vitest';
import { getNestedValue, setNestedValue } from './objectUtils';

describe('getNestedValue', () => {
  it('reads a top-level value', () => {
    expect(getNestedValue({ a: 1 }, 'a')).toBe(1);
  });

  it('reads a nested value via dot path', () => {
    expect(getNestedValue({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42);
  });

  it('returns undefined for a missing path', () => {
    expect(getNestedValue({ a: {} }, 'a.b.c')).toBeUndefined();
  });

  it('returns undefined when no path is given', () => {
    expect(getNestedValue({ a: 1 }, '')).toBeUndefined();
  });
});

describe('setNestedValue', () => {
  it('sets a top-level value', () => {
    expect(setNestedValue({}, 'a', 1)).toEqual({ a: 1 });
  });

  it('creates intermediate objects for a nested path', () => {
    expect(setNestedValue({}, 'a.b.c', 42)).toEqual({ a: { b: { c: 42 } } });
  });

  it('preserves sibling keys', () => {
    expect(setNestedValue({ a: { x: 1 } }, 'a.y', 2)).toEqual({ a: { x: 1, y: 2 } });
  });
});
