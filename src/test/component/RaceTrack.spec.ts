import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import RaceTrack from '../../components/RaceTrack.vue';
import { createTestingPinia } from '@pinia/testing';
import { useHorseRacingStore } from '../../store/horseRacing';
import { formatDistance } from '../../utils/raceUtils';

describe('RaceTrack', () => {
  const mockCurrentRound = {
    id: 1,
    distance: 1000,
    status: 'in-progress',
    horses: [
      { id: 1, name: 'Thunder', progress: 0, color: '#FF0000' },
      { id: 2, name: 'Lightning', progress: 0, color: '#0000FF' }
    ],
    results: []
  };

  const createWrapper = (initialState = {}) => {
    return mount(RaceTrack, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              horseRacing: {
                raceProgram: {
                  rounds: [mockCurrentRound],
                  currentRound: 0,
                  status: 'idle'
                },
                isRacing: false,
                isPaused: false,
                isTransitioning: false,
                canStart: true,
                ...initialState
              }
            }
          })
        ]
      }
    });
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders race track with correct number of lanes', () => {
    const wrapper = createWrapper();
    const lanes = wrapper.findAllComponents({ name: 'RaceTrackLane' });
    expect(lanes).toHaveLength(10);
  });

  it('renders race track header with correct props', () => {
    const wrapper = createWrapper();
    const header = wrapper.findComponent({ name: 'RaceTrackHeader' });
    
    expect(header.exists()).toBe(true);
    expect(header.props('currentRoundNumber')).toBe(1);
    expect(header.props('currentRaceDistance')).toBe(formatDistance(1000));
    expect(header.props('isRacing')).toBe(false);
    expect(header.props('canToggle')).toBe(false);
  });

  it('shows completion notification when last horse finishes', async () => {
    const wrapper = createWrapper({
      raceProgram: {
        rounds: [{
          ...mockCurrentRound,
          horses: [
            { id: 1, name: 'Thunder', progress: 100, color: '#FF0000' },
            { id: 2, name: 'Lightning', progress: 100, color: '#0000FF' }
          ],
          results: [
            { horseId: 1, horseName: 'Thunder', position: 1, finishTime: '1.23s' },
            { horseId: 2, horseName: 'Lightning', position: 2, finishTime: '1.45s' }
          ]
        }],
        currentRound: 0,
        status: 'completed'
      },
      isRacing: false
    });

    const store = useHorseRacingStore();
    store.finishCurrentRound([
      { horseId: 1, horseName: 'Thunder', position: 1, finishTime: '1.23s' },
      { horseId: 2, horseName: 'Lightning', position: 2, finishTime: '1.45s' }
    ]);
    
    await wrapper.vm.$nextTick();
    await vi.runAllTimersAsync();

    const notification = wrapper.findComponent({ name: 'RaceCompletionNotification' });
    expect(notification.exists()).toBe(true);
  });

  it('shows transition modal when transitioning between rounds', () => {
    const wrapper = createWrapper({
      isTransitioning: true,
      raceProgram: {
        rounds: [
          mockCurrentRound,
          {
            id: 2,
            distance: 2000,
            status: 'pending',
            horses: [
              { id: 1, name: 'Thunder', progress: 0, color: '#FF0000' },
              { id: 2, name: 'Lightning', progress: 0, color: '#0000FF' }
            ],
            results: []
          }
        ],
        currentRound: 0,
        status: 'transitioning'
      }
    });

    const modal = wrapper.findComponent({ name: 'RoundTransitionModal' });
    expect(modal.exists()).toBe(true);
    expect(modal.props('isVisible')).toBe(true);
    expect(modal.props('nextRound')).toBe(2);
  });

  it('formats race time correctly', () => {
    const wrapper = createWrapper();
    const formattedTime = (wrapper.vm as any).formatTime(1234);
    expect(formattedTime).toBe('1.23s');
  });
}); 