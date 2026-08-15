import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AppButton from './AppButton.vue';

describe('AppButton', () => {
  it('renders the default slot content', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Save' } });
    expect(wrapper.text()).toBe('Save');
  });

  it('emits click when clicked', async () => {
    const wrapper = mount(AppButton, { slots: { default: 'Save' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('disables the button and hides slot content while loading', () => {
    const wrapper = mount(AppButton, {
      props: { loading: true },
      slots: { default: 'Save' },
    });
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.text()).not.toContain('Save');
  });

  it('is disabled when the disabled prop is set', () => {
    const wrapper = mount(AppButton, { props: { disabled: true } });
    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
