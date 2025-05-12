import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import RoundTransitionModal from '../../components/RoundTransitionModal.vue';

describe('RoundTransitionModal', () => {
  const defaultProps = {
    isVisible: true,
    nextRound: 2,
    nextRoundDistance: 2000,
    transitionDuration: 3000
  };

  const createWrapper = (props = {}) => {
    return mount(RoundTransitionModal, {
      props: {
        ...defaultProps,
        ...props
      }
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders when visible', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.fixed').exists()).toBe(true);
  });

  it('does not render when not visible', () => {
    const wrapper = createWrapper({ isVisible: false });
    expect(wrapper.find('.fixed').exists()).toBe(false);
  });

  it('displays correct round number', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('h2').text()).toBe('Round 2 Starting');
  });

  it('displays correct distance', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('p').text()).toContain('2000m');
  });

  it('starts countdown when mounted and visible', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.text-5xl').text()).toBe('3');
  });

  it('updates countdown every second', async () => {
    const wrapper = createWrapper();
    
    // Initial countdown
    expect(wrapper.find('.text-5xl').text()).toBe('3');
    
    // After 1 second
    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.find('.text-5xl').text()).toBe('2');
    
    // After 2 seconds
    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.find('.text-5xl').text()).toBe('1');
    
    // After 3 seconds
    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.find('.text-5xl').text()).toBe('0');
  });

  it('stops countdown when component is unmounted', () => {
    const wrapper = createWrapper();
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    
    wrapper.unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('stops countdown when visibility changes to false', async () => {
    const wrapper = createWrapper();
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    
    await wrapper.setProps({ isVisible: false });
    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('applies pulse animation class', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.transform').classes()).toContain('transform');
  });

  it('handles different transition durations', () => {
    const wrapper = createWrapper({ transitionDuration: 5000 });
    expect(wrapper.find('.text-5xl').text()).toBe('5');
  });

  it('cleans up interval on unmount even if countdown is not finished', async () => {
    const wrapper = createWrapper();
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    
    // Advance time but not enough to finish countdown
    await vi.advanceTimersByTimeAsync(1000);
    wrapper.unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
  });
}); 