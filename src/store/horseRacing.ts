import { defineStore } from 'pinia';
import { COLORS, ROUND_DISTANCES } from '../types';
import { resetHorseProgress } from '../utils/raceUtils';
import { RACE_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import type { Horse, RaceProgram, RaceResult } from '../types';

const HORSE_NAMES = [
  'Thunder Bolt', 'Silver Arrow', 'Midnight Star', 'Golden Hooves', 'Wind Runner',
  'Storm Chaser', 'Royal Gallop', 'Diamond Dust', 'Swift Spirit', 'Blazing Speed',
  'Lucky Charm', 'Highland Racer', 'Shadow Dancer', 'Victory Lap', 'Rapid Fire',
  'Mystic Stride', 'Brave Heart', 'Enchanted Run', 'Stellar Dash', 'Noble Steed',
  'Epic Journey', 'Graceful Gait', 'Wild Glory', 'Mighty Hoof', 'Daring Dash'
];

export const useHorseRacingStore = defineStore('horseRacing', {
  state: () => ({
    allHorses: [] as Horse[],
    raceProgram: {
      rounds: [],
      currentRound: 0,
      status: 'idle'
    } as RaceProgram,
    roundTransitionDelay: RACE_CONFIG.ROUND_TRANSITION_DELAY, 
    isTransitioning: false, 
    nextRoundIndex: -1,
    error: null as string | null
  }),
  
  getters: {
    getHorseById: (state) => (id: number) => {
      return state.allHorses.find(horse => horse.id === id);
    },
    
    getCurrentRound: (state) => {
      if (state.raceProgram.rounds.length === 0) return null;
      return state.raceProgram.rounds[state.raceProgram.currentRound];
    },
    
    getNextRound: (state) => {
      if (state.nextRoundIndex < 0 || state.nextRoundIndex >= state.raceProgram.rounds.length) {
        return null;
      }
      return state.raceProgram.rounds[state.nextRoundIndex];
    },
    
    isRacing: (state) => {
      return state.raceProgram.status === 'racing';
    },
    
    isPaused: (state) => {
      return state.raceProgram.status === 'paused';
    },
    
    isCompleted: (state) => {
      return state.raceProgram.status === 'completed';
    },

    canStart: (state) => {
      return (state.raceProgram.status === 'generated' || 
              state.raceProgram.status === 'paused') && 
             !state.isTransitioning;
    },
    
    hasError: (state) => {
      return state.error !== null;
    }
  },
  
  actions: {
    /**
     * Generates horses for the simulation
     */
    generateHorses() {
      try {
        this.allHorses = [];
        
        const shuffledNames = [...HORSE_NAMES].sort(() => Math.random() - 0.5).slice(0, RACE_CONFIG.HORSE_COUNT);
        const shuffledColors = [...COLORS].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < RACE_CONFIG.HORSE_COUNT; i++) {
          this.allHorses.push({
            id: i + 1,
            name: shuffledNames[i],
            // Generate condition between MIN and MAX values
            condition: Math.floor(Math.random() * (RACE_CONFIG.MAX_HORSE_CONDITION - RACE_CONFIG.MIN_HORSE_CONDITION + 1)) + RACE_CONFIG.MIN_HORSE_CONDITION,
            color: shuffledColors[i]
          });
        }
        
        this.error = null;
      } catch (error) {
        console.error('Error generating horses:', error);
        this.error = ERROR_MESSAGES.HORSE_GENERATION_FAILED;
      }
    },
    
    /**
     * Generates the race program with multiple rounds
     */
    generateRaceProgram() {
      try {
        this.raceProgram.rounds = [];
        this.raceProgram.currentRound = 0;
        this.raceProgram.status = 'generated';
        this.isTransitioning = false;
        this.nextRoundIndex = -1;
        
        for (let i = 0; i < RACE_CONFIG.TOTAL_ROUNDS; i++) {
          const shuffledHorses = [...this.allHorses]
            .sort(() => Math.random() - 0.5)
            .slice(0, RACE_CONFIG.HORSES_PER_RACE)
            .map(horse => ({
              ...horse, 
              progress: 0,    
              position: undefined  
            }));
          
          this.raceProgram.rounds.push({
            id: i + 1,
            distance: ROUND_DISTANCES[i],
            horses: shuffledHorses,
            results: [],
            status: 'pending'
          });
        }
        
        this.error = null;
      } catch (error) {
        console.error('Error generating race program:', error);
        this.error = ERROR_MESSAGES.RACE_GENERATION_FAILED;
      }
    },
    
    /**
     * Starts the race if conditions allow
     */
    startRace() {
      try {
        if (!this.canStart) return;
        
        if (this.isTransitioning) return;
        
        this.raceProgram.status = 'racing';
        
        if (this.getCurrentRound) {
          this.getCurrentRound.status = 'in-progress';
        }
        
        this.error = null;
      } catch (error) {
        console.error('Error starting race:', error);
        this.pauseRace();
      }
    },
    
    /**
     * Pauses the race
     */
    pauseRace() {
      if (this.raceProgram.status !== 'racing') return;
      this.raceProgram.status = 'paused';
    },
    
    /**
     * Begins transition to the next round
     */
    beginTransitionToNextRound() {
      try {
        if (this.raceProgram.currentRound >= RACE_CONFIG.TOTAL_ROUNDS - 1) {
          this.raceProgram.status = 'completed';
          this.isTransitioning = false;
          return;
        }
        
        // Make sure we're not already transitioning
        if (this.isTransitioning) {
          return;
        }
        
        this.isTransitioning = true;
        this.nextRoundIndex = this.raceProgram.currentRound + 1;
        
        this.raceProgram.status = 'paused';
        
        setTimeout(() => {
          this.completeTransitionToNextRound();
        }, this.roundTransitionDelay);
        
        this.error = null;
      } catch (error) {
        console.error('Error during round transition:', error);
        this.isTransitioning = false;
        this.pauseRace();
      }
    },
    
    /**
     * Completes the transition to the next round
     */
    completeTransitionToNextRound() {
      try {
        this.raceProgram.currentRound++;
        
        if (this.getCurrentRound) {
          this.getCurrentRound.horses.forEach(horse => {
            horse.progress = 0;
            horse.position = undefined;
          });
          
          resetHorseProgress(this.getCurrentRound.horses);
          this.getCurrentRound.status = 'pending';
        } 
        
        this.isTransitioning = false;
        this.nextRoundIndex = -1;
        
        const currentRoundId = this.raceProgram.currentRound;
        
        setTimeout(() => {
          if (this.raceProgram.currentRound === currentRoundId) {
            this.raceProgram.status = 'racing';
            if (this.getCurrentRound) {
              this.getCurrentRound.status = 'in-progress';
            }
          } 
        }, 500);
        
        this.error = null;
      } catch (error) {
        console.error('Error completing round transition:', error);
        this.isTransitioning = false;
        this.pauseRace();
      }
    },
    
    /**
     * Updates live race results during a race
     * 
     * @param result - The race result to update
     */
    updateLiveResults(result: RaceResult) {
      try {
        if (this.raceProgram.currentRound >= 0 && this.raceProgram.currentRound < this.raceProgram.rounds.length) {
          const currentRound = this.raceProgram.rounds[this.raceProgram.currentRound];
          
          const existingIndex = currentRound.results.findIndex(r => r.horseId === result.horseId);
          
          if (existingIndex >= 0) {
            currentRound.results[existingIndex] = result;
          } else {
            currentRound.results.push(result);
          }
        }
        
        this.error = null;
      } catch (error) {
        console.error('Error updating live results:', error);
      }
    },
    
    /**
     * Finalizes the results for the current round
     * 
     * @param finalResults - Array of final race results
     */
    finishCurrentRound(finalResults: RaceResult[]) {
      try {
        if (this.raceProgram.currentRound >= 0 && this.raceProgram.currentRound < this.raceProgram.rounds.length) {
          const currentRound = this.raceProgram.rounds[this.raceProgram.currentRound];
          
          finalResults.forEach(result => {
            const existingIndex = currentRound.results.findIndex(r => r.horseId === result.horseId);
            
            if (existingIndex >= 0) {
              currentRound.results[existingIndex] = result;
            } else {
              currentRound.results.push(result);
            }
          });
          
          currentRound.status = 'completed';
          
          this.beginTransitionToNextRound();
        }
        
        this.error = null;
      } catch (error) {
        console.error('Error finishing current round:', error);
        this.pauseRace();
      }
    },
    
    /**
     * Updates a horse's progress during the race
     * 
     * @param horseId - ID of the horse to update
     * @param progress - New progress value (0-1)
     */
    updateHorseProgress(horseId: number, progress: number) {
      try {
        if (!this.getCurrentRound) return;
        
        const horse = this.getCurrentRound.horses.find(h => h.id === horseId);
        if (horse) {
          horse.progress = progress;
        }
        
        this.error = null;
      } catch (error) {
        console.error('Error updating horse progress:', error);
      }
    },
    
    /**
     * Toggles between racing and paused states
     */
    toggleRace() {
      if (this.isTransitioning) return;
      
      if (this.raceProgram.status === 'racing') {
        this.pauseRace();
      } else {
        this.startRace();
      }
    },
    
    /**
     * Restarts the race simulation
     */
    restart() {
      try {
        this.raceProgram.rounds.forEach(round => {
          resetHorseProgress(round.horses);
        });
        
        this.raceProgram.status = 'idle';
        this.raceProgram.currentRound = 0;
        this.isTransitioning = false;
        this.nextRoundIndex = -1;
        this.error = null;
      } catch (error) {
        console.error('Error restarting race:', error);
        this.error = ERROR_MESSAGES.RACE_SIMULATION_ERROR;
      }
    },
    
    /**
     * Clears any error messages
     */
    clearError() {
      this.error = null;
    }
  }
}); 