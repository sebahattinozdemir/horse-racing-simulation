import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RaceTrackHeader from '../../components/RaceTrackHeader.vue';

describe('RaceTrackHeader', () => {
  const defaultProps = {
    currentRoundNumber: 1,
    currentRaceDistance: '1000m',
    isRacing: false,
    canToggle: true,
    showTimer: false,
    raceTime: 0
  };

  it('renders correctly with default props', () => {
    const wrapper = mount(RaceTrackHeader, {
      props: defaultProps
    });

    expect(wrapper.text()).toContain('Round 1 of 6 - 1000m');
    expect(wrapper.text()).toContain('PLAY');
    expect(wrapper.text()).toContain('00.00s');
  });

  it('shows PAUSE button when race is in progress', () => {
    const wrapper = mount(RaceTrackHeader, {
      props: {
        ...defaultProps,
        isRacing: true
      }
    });

    expect(wrapper.text()).toContain('PAUSE');
  });

  it('disables the toggle button when canToggle is false', () => {
    const wrapper = mount(RaceTrackHeader, {
      props: {
        ...defaultProps,
        canToggle: false
      }
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
  });

  it('emits toggle-race event when button is clicked', async () => {
    const wrapper = mount(RaceTrackHeader, {
      props: defaultProps
    });

    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('toggle-race')).toBeTruthy();
  });

  it('formats time correctly', () => {
    const wrapper = mount(RaceTrackHeader, {
      props: {
        ...defaultProps,
        showTimer: true,
        raceTime: 1500 // 1.5 seconds
      }
    });

    expect(wrapper.text()).toContain('1.50s');
  });

  it('shows timer when showTimer is true', () => {
    const wrapper = mount(RaceTrackHeader, {
      props: {
        ...defaultProps,
        showTimer: true,
        raceTime: 2000
      }
    });

    expect(wrapper.text()).toContain('2.00s');
  });
}); 