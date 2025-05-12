import type { Horse, RaceResult } from '../types';
import { RACE_SIMULATION } from './constants';

/**
 * Calculates the speed of a horse based on various factors
 * 
 * @param horse - The horse object
 * @param distance - Race distance in meters
 * @param progress - Current progress of the horse (0-1)
 * @returns Speed factor for the horse
 */
export function calculateHorseSpeed(horse: Horse, distance: number, progress: number = 0): number {
  // Initialize horse race-day attributes if not already set
  if (horse.raceDayFactor === undefined) {
    // Random factor for day-to-day performance variation (95-105%)
    horse.raceDayFactor = 0.95 + (Math.random() * 0.1);
    
    // Random factor for track conditions (96-104%)
    horse.trackPreference = 0.96 + (Math.random() * 0.08);
    
    // Random luck factor (97-103%)
    horse.luckyFactor = 0.97 + (Math.random() * 0.06);
    
    // Assign a racing style if not already set
    if (!horse.racingStyle) {
      const styleRandom = Math.random();
      if (styleRandom < 0.3) {
        // Frontrunner: Fast start, may fade
        horse.racingStyle = "frontrunner";
      } else if (styleRandom < 0.7) {
        // Steady: Consistent pace
        horse.racingStyle = "steady";
      } else {
        // Closer: Slow start, strong finish
        horse.racingStyle = "closer";
      }
    }
    
    horse.lastSpeedFactor = 1.0;
  }
  
  // Base speed calculation from horse condition
  const conditionFactor = Math.pow((horse.condition - RACE_SIMULATION.MIN_CONDITION) / 
    (RACE_SIMULATION.MAX_CONDITION - RACE_SIMULATION.MIN_CONDITION), 2.0);
  const baseSpeed = (horse.condition / 10) * (0.90 + conditionFactor * 0.7);
  
  // Factor for race incidents (falls, bumps, etc) - not currently used
  const incidentFactor = 1.0;
  
  // Random burst of speed calculation
  const burstChance = RACE_SIMULATION.BURST_CHANCE;
  const hasBurst = Math.random() > burstChance;
  const burstFactor = hasBurst ? 
    RACE_SIMULATION.MIN_BURST_BOOST + (Math.random() * (RACE_SIMULATION.MAX_BURST_BOOST - RACE_SIMULATION.MIN_BURST_BOOST)) : 
    1.0;
  
  // Racing style effectiveness based on horse condition
  const styleEffectiveness = 0.7 + ((horse.condition - RACE_SIMULATION.MIN_CONDITION) / 
    (RACE_SIMULATION.MAX_CONDITION - RACE_SIMULATION.MIN_CONDITION) * 0.3);
  let racingStyleFactor = 1.0;
  
  // Apply racing style effects based on progress
  if (horse.racingStyle === "frontrunner") {
    // Frontrunners start fast but may fade
    const fadeFactor = RACE_SIMULATION.FRONTRUNNER_FADE * 
      (1 - ((horse.condition - RACE_SIMULATION.MIN_CONDITION) / 
      (RACE_SIMULATION.MAX_CONDITION - RACE_SIMULATION.MIN_CONDITION)));
    racingStyleFactor = (RACE_SIMULATION.FRONTRUNNER_BOOST * styleEffectiveness) * (1 - (progress * progress * fadeFactor));
  } else if (horse.racingStyle === "closer") {
    // Closers start slow but finish strong
    const closingPower = RACE_SIMULATION.CLOSER_BOOST * styleEffectiveness;
    racingStyleFactor = RACE_SIMULATION.CLOSER_START_PENALTY + (progress * progress * progress * closingPower);
  } else {
    // Steady pacers maintain consistent speed
    racingStyleFactor = 1.0 * styleEffectiveness;
  }
  
  // Pack racing effect - horses run faster when following others
  let packRacingFactor = 1.0;
  if (horse.position && horse.position > 1) {
    // Better conditioned horses are less dependent on pack
    const independenceFactor = Math.min(1.0, Math.max(0.5, horse.condition / RACE_SIMULATION.MAX_CONDITION));
    const packDependence = 1.2 - independenceFactor;
    
    // Calculate boost based on position
    const positionFactor = Math.min((horse.position - 1) * RACE_SIMULATION.POSITION_FACTOR, RACE_SIMULATION.MAX_PACK_BOOST);
    const packBoost = positionFactor * packDependence;
    
    packRacingFactor = 1.0 + packBoost;
  }
  
  // Horse speed consistency based on condition
  const stabilityBase = Math.max(
    RACE_SIMULATION.STABILITY_BASE_MIN, 
    Math.min(RACE_SIMULATION.STABILITY_BASE_MAX, (horse.condition / RACE_SIMULATION.MAX_CONDITION))
  );
  const stabilityVariance = (RACE_SIMULATION.MAX_CONDITION - horse.condition) / 2000;
  const stabilityRandom = Math.random() * stabilityVariance;
  const stabilityFactor = stabilityBase + stabilityRandom;
  
  // Small random adjustment for natural variation
  const randomAdjustment = ((Math.random() * 0.01) - 0.005) * (1.01 - stabilityFactor);
  
  // Section factor creates small sinusoidal variations in speed
  const sectionFactor = Math.sin((progress * Math.PI * 2) + (horse.id * 0.7)) * 0.01;
  
  // Combine all factors to get target speed factor
  const targetFactor = (horse.raceDayFactor || 1.0) * 
                     (horse.trackPreference || 1.0) * 
                     (horse.luckyFactor || 1.0) * 
                     incidentFactor * burstFactor * 
                     racingStyleFactor * packRacingFactor * 
                     (1 + sectionFactor) * (1 + randomAdjustment);
  
  // Smooth speed changes for more realistic movement
  const transitionRate = RACE_SIMULATION.TRANSITION_RATE_BASE * (1 + ((horse.condition - RACE_SIMULATION.MIN_CONDITION) / 
    (RACE_SIMULATION.MAX_CONDITION - RACE_SIMULATION.MIN_CONDITION) * 0.5));
  let newSpeedFactor = (horse.lastSpeedFactor || 1.0) * (1 - transitionRate) + targetFactor * transitionRate;
  
  horse.lastSpeedFactor = newSpeedFactor;
  
  // Apply distance preference factor
  if (horse.distancePreference === undefined) {
    // Random preference for shorter (-0.03) to longer (+0.03) races
    horse.distancePreference = (Math.random() * 0.06) - 0.03;
  }
  
  // Adjust speed based on how well the distance matches the horse's preference
  let raceLength = distance / 1200; // 1.0 for shortest race, 1.83 for longest
  const distanceMatchFactor = 1 - Math.abs(raceLength - (1 + horse.distancePreference)) * 0.03;
  
  // Calculate final speed based on condition
  const conditionImpact = (horse.condition - RACE_SIMULATION.MIN_CONDITION) / 
    (RACE_SIMULATION.MAX_CONDITION - RACE_SIMULATION.MIN_CONDITION);
  
  const baseMultiplier = RACE_SIMULATION.BASE_MULTIPLIER * (1 + (conditionImpact * 0.25));
  
  // Scale speed by distance (shorter races = faster speeds)
  const distanceScalingFactor = 1200 / distance;
  
  // Set minimum and maximum speed bounds
  const minimumSpeedFactor = RACE_SIMULATION.MINIMUM_SPEED_FACTOR * distanceScalingFactor;
  
  const conditionSpeedBonus = 1 + (conditionImpact * 0.2);
  const maxSpeedMultiplier = (distance / 1200) * 0.1 * conditionSpeedBonus;
  const maximumSpeedFactor = maxSpeedMultiplier * distanceScalingFactor;
  
  // Calculate final speed and ensure it's within bounds
  const calculatedSpeed = baseSpeed * baseMultiplier * newSpeedFactor * distanceMatchFactor * distanceScalingFactor;
  
  return Math.min(
    Math.max(calculatedSpeed, minimumSpeedFactor), 
    maximumSpeedFactor
  );
}

/**
 * Simulates one step of the race for all horses
 * 
 * @param horses - Array of horses in the race
 * @param distance - Race distance in meters
 * @param finishedHorses - Set of IDs of horses that have finished
 * @param stepSize - Simulation step size (default: 0.005)
 * @returns Array of race results for horses that finished in this step
 */
export function simulateRaceStep(
  horses: Horse[], 
  distance: number, 
  finishedHorses: Set<number>,
  stepSize: number = RACE_SIMULATION.STEP_SIZE
): RaceResult[] {
  const results: RaceResult[] = [];
  const positions: {id: number, progress: number}[] = [];
  
  // Update each horse's progress
  horses.forEach(horse => {
    // Skip horses that have already finished
    if (finishedHorses.has(horse.id)) return;
    
    // Initialize progress if needed
    if (horse.progress === undefined || horse.progress === null) {
      horse.progress = 0;
    }
    
    // Calculate speed and new progress
    const speed = calculateHorseSpeed(horse, distance, horse.progress);
    const newProgress = Math.max(horse.progress + speed * stepSize, horse.progress);
    
    // Check if horse has finished
    if (newProgress >= 1) {
      finishedHorses.add(horse.id);
      positions.push({ id: horse.id, progress: 1 });
      
      // Add to results
      results.push({
        position: finishedHorses.size, 
        horseId: horse.id,
        horseName: horse.name
      });
    } else {
      positions.push({ id: horse.id, progress: newProgress });
    }
  });
  
  // Sort horses by progress to determine positions
  positions.sort((a, b) => b.progress - a.progress);
  
  // Update horse positions
  positions.forEach((pos, index) => {
    const horse = horses.find(h => h.id === pos.id);
    if (horse) {
      horse.position = index + 1;
      horse.progress = pos.progress;
    }
  });
  
  return results;
}

/**
 * Resets all horses to their starting state
 * 
 * @param horses - Array of horses to reset
 */
export function resetHorseProgress(horses: Horse[]): void {
  if (!horses || !horses.length) return;
  
  horses.forEach(horse => {
    // Reset progress and position
    horse.progress = 0;
    horse.position = undefined;
    
    // Reset race-day factors
    horse.raceDayFactor = undefined;
    horse.trackPreference = undefined;
    horse.luckyFactor = undefined;
    horse.lastSpeedFactor = undefined;
    horse.distancePreference = undefined;
    
    // Clean up any extra properties
    if ('left' in horse) {
      delete (horse as Record<string, unknown>).left;
    }
    if ('style' in horse) {
      delete (horse as Record<string, unknown>).style;
    }
  });
}

/**
 * Formats distance in meters to a readable string
 * 
 * @param meters - Distance in meters
 * @returns Formatted distance string
 */
export function formatDistance(meters: number): string {
  return `${meters}m`;
} 