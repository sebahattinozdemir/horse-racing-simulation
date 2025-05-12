import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RaceTrackLane from '../../components/RaceTrackLane.vue';

describe('RaceTrackLane', () => {
  const mockHorse = {
    id: 1,
    name: 'Thunder',
    progress: 0.5,
    color: '#FF0000'
  };

  const createWrapper = (props = {}) => {
    return mount(RaceTrackLane, {
      props: {
        laneNumber: 1,
        horse: undefined,
        isResetting: false,
        ...props
      }
    });
  };

  it('renders lane number correctly', () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain('1');
  });

  it('renders horse when provided', () => {
    const wrapper = createWrapper({ horse: mockHorse });
    expect(wrapper.text()).toContain('Thunder');
    expect(wrapper.find('img[alt="Horse"]').exists()).toBe(true);
  });

  it('does not render horse when not provided', () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).not.toContain('Thunder');
    expect(wrapper.find('img[alt="Horse"]').exists()).toBe(false);
  });

  it('applies correct horse position based on progress', () => {
    const wrapper = createWrapper({ horse: mockHorse });
    const horseElement = wrapper.find('.will-change-left');
    expect(horseElement.attributes('style')).toContain('left: 47.5%'); // 0.5 * 95 = 47.5
  });

  it('caps horse position at 95% when progress is 100%', () => {
    const wrapper = createWrapper({
      horse: { ...mockHorse, progress: 1 }
    });
    const horseElement = wrapper.find('.will-change-left');
    expect(horseElement.attributes('style')).toContain('left: 95%');
  });

  it('applies transition-none class when isResetting is true', () => {
    const wrapper = createWrapper({
      horse: mockHorse,
      isResetting: true
    });
    const horseElement = wrapper.find('.will-change-left');
    expect(horseElement.classes()).toContain('transition-none');
    expect(horseElement.classes()).not.toContain('transition-left');
  });

  it('applies transition-left class when isResetting is false', () => {
    const wrapper = createWrapper({
      horse: mockHorse,
      isResetting: false
    });
    const horseElement = wrapper.find('.will-change-left');
    expect(horseElement.classes()).toContain('transition-left');
    expect(horseElement.classes()).not.toContain('transition-none');
  });

  it('applies correct text color based on background brightness', () => {
    // Test with dark color (should have white text)
    const darkWrapper = createWrapper({
      horse: { ...mockHorse, color: '#000000' }
    });
    const darkNameTag = darkWrapper.find('.will-change-left .text-xs');
    expect(darkNameTag.classes()).toContain('text-white');

    // Test with light color (should have dark text)
    const lightWrapper = createWrapper({
      horse: { ...mockHorse, color: '#FFFFFF' }
    });
    const lightNameTag = lightWrapper.find('.will-change-left .text-xs');
    expect(lightNameTag.classes()).toContain('text-gray-800');
  });

  it('handles horse with undefined progress', () => {
    const wrapper = createWrapper({
      horse: { ...mockHorse, progress: undefined }
    });
    const horseElement = wrapper.find('.will-change-left');
    expect(horseElement.attributes('style')).toContain('left: 0%');
  });

  it('handles horse with null progress', () => {
    const wrapper = createWrapper({
      horse: { ...mockHorse, progress: null }
    });
    const horseElement = wrapper.find('.will-change-left');
    expect(horseElement.attributes('style')).toContain('left: 0%');
  });
}); 