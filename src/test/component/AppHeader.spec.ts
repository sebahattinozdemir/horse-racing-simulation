import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { useHorseRacingStore } from '../../store/horseRacing';
import { createTestingPinia } from '@pinia/testing';
import AppHeader from '../../components/AppHeader.vue';

describe('AppHeader', () => {
  const createWrapper = (initialState = {}) => {
    return mount(AppHeader, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              horseRacing: {
                isRacing: false,
                isPaused: false,
                isCompleted: false,
                ...initialState
              }
            }
          })
        ]
      }
    });
  };

  it('renders the component with correct title', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('h1').text()).toBe('Horse Racing Simulator');
  });

  it('shows generate program button when not racing or paused', () => {
    const wrapper = createWrapper();
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe('GENERATE PROGRAM');
    expect(button.attributes('disabled')).toBeUndefined();
  });

  it('calls generateRaceProgram when generate program button is clicked', async () => {
    const wrapper = createWrapper();
    const store = useHorseRacingStore();
    
    await wrapper.find('button').trigger('click');
    expect(store.generateRaceProgram).toHaveBeenCalledTimes(1);
  });
}); 