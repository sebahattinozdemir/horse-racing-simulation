import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import RaceResults from '../../components/RaceResults.vue';
import { createTestingPinia } from '@pinia/testing';

describe('RaceResults', () => {
  const mockCurrentRound = {
    id: 1,
    distance: 1000,
    status: 'in-progress',
    horses: [
      { id: 1, name: 'Thunder' },
      { id: 2, name: 'Lightning' }
    ],
    results: [
      { horseId: 1, horseName: 'Thunder', position: 1, finishTime: '1:23.45' },
      { horseId: 2, horseName: 'Lightning', position: 2 }
    ]
  };

  const mockCompletedRound = {
    id: 2,
    distance: 2000,
    status: 'completed',
    horses: [
      { id: 3, name: 'Storm' },
      { id: 4, name: 'Rain' }
    ],
    results: [
      { horseId: 3, horseName: 'Storm', position: 1, finishTime: '2:45.67' },
      { horseId: 4, horseName: 'Rain', position: 2, finishTime: '2:46.78' }
    ]
  };

  const createWrapper = (initialState = {}) => {
    return mount(RaceResults, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              horseRacing: {
                raceProgram: {
                  rounds: [mockCurrentRound, mockCompletedRound],
                  currentRound: 0
                },
                isRacing: true,
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
    expect(wrapper.find('h2').text()).toBe('Results');
  });

  it('shows empty state message when no results exist', () => {
    const wrapper = createWrapper({
      raceProgram: { rounds: [], currentRound: -1 },
      isRacing: false
    });
    expect(wrapper.text()).toContain('No results yet');
  });

  it('displays current round results with live status', () => {
    const wrapper = createWrapper();
    const currentRound = wrapper.find('.border-yellow-400');
    
    expect(currentRound.exists()).toBe(true);
    expect(currentRound.text()).toContain('Round 1');
    expect(currentRound.text()).toContain('LIVE');
    expect(currentRound.text()).toContain('Thunder');
    expect(currentRound.text()).toContain('Lightning');
  });

  it('displays completed round results', () => {
    const wrapper = createWrapper();
    const completedRound = wrapper.findAll('.bg-white').at(1);
    
    expect(completedRound?.text()).toContain('Round 2');
    expect(completedRound?.text()).toContain('Storm');
    expect(completedRound?.text()).toContain('Rain');
    expect(completedRound?.text()).toContain('2:45.67');
  });

  it('shows correct lane numbers for current round horses', () => {
    const wrapper = createWrapper();
    const lanes = wrapper.findAll('tbody tr td').map(td => td.text());
    expect(lanes).toContain('1');
    expect(lanes).toContain('2');
  });

  it('shows finish time when available', () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain('1:23.45');
  });

  it('shows dash when finish time is not available', () => {
    const wrapper = createWrapper();
    const times = wrapper.findAll('tbody tr td:nth-child(4)').map(td => td.text());
    expect(times).toContain('-');
  });
}); 