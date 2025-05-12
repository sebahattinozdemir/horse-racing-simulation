import { describe, it, expect, beforeEach } from 'vitest';
import { calculateHorseSpeed, simulateRaceStep, resetHorseProgress, formatDistance } from '../../utils/raceUtils';
import type { Horse } from '../../types';

describe('raceUtils', () => {
  describe('calculateHorseSpeed', () => {
    let testHorse: Horse;
    
    beforeEach(() => {
      testHorse = {
        id: 1,
        name: 'Test Horse',
        condition: 80,
        color: '#FF0000',
        progress: 0
      };
    });
    
    it('should calculate a valid speed value', () => {
      const speed = calculateHorseSpeed(testHorse, 1200, 0);
      expect(speed).toBeGreaterThan(0);
      expect(speed).toBeLessThan(0.2); // Speed should be reasonable
    });
    
    it('should initialize race day factors on first call', () => {
      expect(testHorse.raceDayFactor).toBeUndefined();
      calculateHorseSpeed(testHorse, 1200, 0);
      expect(testHorse.raceDayFactor).toBeDefined();
      expect(testHorse.trackPreference).toBeDefined();
      expect(testHorse.luckyFactor).toBeDefined();
      expect(testHorse.racingStyle).toBeDefined();
    });
        
    it('should adjust speed based on race distance', () => {
      const shortRaceSpeed = calculateHorseSpeed(testHorse, 1200, 0.5);
      const longRaceSpeed = calculateHorseSpeed(testHorse, 2200, 0.5);
      
      // Horses should move faster in shorter races
      expect(shortRaceSpeed).toBeGreaterThan(longRaceSpeed);
    });
  });
  
  describe('simulateRaceStep', () => {
    let horses: Horse[];
    let finishedHorses: Set<number>;
    
    beforeEach(() => {
      horses = [
        { id: 1, name: 'Horse 1', condition: 80, color: '#FF0000', progress: 0 },
        { id: 2, name: 'Horse 2', condition: 75, color: '#00FF00', progress: 0 },
        { id: 3, name: 'Horse 3', condition: 90, color: '#0000FF', progress: 0 }
      ];
      finishedHorses = new Set<number>();
    });
    
    it('should update horse progress', () => {
      simulateRaceStep(horses, 1200, finishedHorses);
      
      horses.forEach(horse => {
        expect(horse.progress).toBeGreaterThan(0);
      });
    });
    
    it('should mark horses as finished when they reach the finish line', () => {
      // Set a horse close to the finish line
      horses[0].progress = 0.99;
      
      const results = simulateRaceStep(horses, 1200, finishedHorses, 0.1);
      
      expect(finishedHorses.has(1)).toBe(true);
      expect(results.length).toBe(1);
      expect(results[0].horseId).toBe(1);
      expect(results[0].position).toBe(1);
    });
    
    it('should update horse positions based on progress', () => {
      horses[0].progress = 0.5;
      horses[1].progress = 0.7;
      horses[2].progress = 0.3;
      
      simulateRaceStep(horses, 1200, finishedHorses);
      
      expect(horses[0].position).toBe(2);
      expect(horses[1].position).toBe(1);
      expect(horses[2].position).toBe(3);
    });
  });
  
  describe('resetHorseProgress', () => {
    it('should reset all horse progress and race-day factors', () => {
      const horses: Horse[] = [
        { 
          id: 1, 
          name: 'Horse 1', 
          condition: 80, 
          color: '#FF0000', 
          progress: 0.5,
          position: 2,
          raceDayFactor: 1.02,
          trackPreference: 0.98,
          luckyFactor: 1.01,
          lastSpeedFactor: 0.12,
          distancePreference: 0.02
        }
      ];
      
      resetHorseProgress(horses);
      
      expect(horses[0].progress).toBe(0);
      expect(horses[0].position).toBeUndefined();
      expect(horses[0].raceDayFactor).toBeUndefined();
      expect(horses[0].trackPreference).toBeUndefined();
      expect(horses[0].luckyFactor).toBeUndefined();
      expect(horses[0].lastSpeedFactor).toBeUndefined();
      expect(horses[0].distancePreference).toBeUndefined();
    });
  });
  
  describe('formatDistance', () => {
    it('should format distance correctly', () => {
      expect(formatDistance(1200)).toBe('1200m');
      expect(formatDistance(2200)).toBe('2200m');
    });
  });
}); 