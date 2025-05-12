import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RaceProgram from '../../components/RaceProgram.vue';
import { createTestingPinia } from '@pinia/testing';

describe('RaceProgram', () => {
  const mockRounds = [
    {
      id: 1,
      distance: 1000,
      status: 'in-progress',
      horses: [
        { id: 1, name: 'Thunder' },
        { id: 2, name: 'Lightning' }
      ]
    },
    {
      id: 2,
      distance: 2000,
      status: 'pending',
      horses: [
        { id: 3, name: 'Storm' },
        { id: 4, name: 'Rain' }
      ]
    }
  ];

  const createWrapper = (initialState = {}) => {
    return mount(RaceProgram, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              horseRacing: {
                raceProgram: {
                  rounds: mockRounds,
                  currentRound: 0,
                  ...initialState
                }
              }
            }
          })
        ]
      }
    });
  };

  it('renders the component with correct title', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('h2').text()).toBe('Program');
  });

  it('displays current round with active status', () => {
    const wrapper = createWrapper();
    const currentRound = wrapper.find('.bg-orange-200');
    
    expect(currentRound.exists()).toBe(true);
    expect(currentRound.text()).toContain('Round 1');
    expect(currentRound.text()).toContain('ACTIVE');
    expect(currentRound.text()).toContain('Thunder');
    expect(currentRound.text()).toContain('Lightning');
  });

  it('displays other rounds correctly', () => {
    const wrapper = createWrapper();
    const otherRounds = wrapper.findAll('.bg-white');
    
    expect(otherRounds).toHaveLength(1);
    expect(otherRounds[0].text()).toContain('Round 2');
    expect(otherRounds[0].text()).toContain('Storm');
    expect(otherRounds[0].text()).toContain('Rain');
  });
}); 