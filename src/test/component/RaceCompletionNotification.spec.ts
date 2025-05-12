import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RaceCompletionNotification from '../../components/RaceCompletionNotification.vue';

describe('RaceCompletionNotification', () => {
  const createWrapper = (props = {}) => {
    return mount(RaceCompletionNotification, {
      props: {
        isVisible: false,
        finishTime: '',
        ...props
      }
    });
  };

  it('is not visible by default', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.bg-black').exists()).toBe(false);
  });

  it('becomes visible when isVisible is true', () => {
    const wrapper = createWrapper({ isVisible: true });
    expect(wrapper.find('.bg-black').exists()).toBe(true);
  });

  it('displays the completion message', () => {
    const wrapper = createWrapper({ isVisible: true });
    expect(wrapper.text()).toContain('Last horse finished the race!');
  });

  it('displays finish time when provided', () => {
    const wrapper = createWrapper({ 
      isVisible: true, 
      finishTime: '1:23.45' 
    });
    expect(wrapper.text()).toContain('Finish time: 1:23.45');
  });

  it('does not display finish time when not provided', () => {
    const wrapper = createWrapper({ isVisible: true });
    expect(wrapper.text()).not.toContain('Finish time:');
  });

  it('renders the info icon', () => {
    const wrapper = createWrapper({ isVisible: true });
    expect(wrapper.find('svg').exists()).toBe(true);
  });
}); 