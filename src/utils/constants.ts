// Race configuration constants
export const RACE_CONFIG = {
  ROUND_TRANSITION_DELAY: 6000,
  TOTAL_ROUNDS: 6,
  HORSE_COUNT: 20,
  HORSES_PER_RACE: 10,
  FINISH_LINE_POSITION: 95, // percentage of track width
  MIN_HORSE_CONDITION: 60,
  MAX_HORSE_CONDITION: 100
};

// Racing simulation constants
export const RACE_SIMULATION = {
  STEP_SIZE: 0.005,
  MIN_CONDITION: 60,
  MAX_CONDITION: 100,
  
  // Racing style factors
  FRONTRUNNER_BOOST: 1.07,
  FRONTRUNNER_FADE: 0.25,
  CLOSER_START_PENALTY: 0.85,
  CLOSER_BOOST: 0.25,
  
  // Pack racing factors
  POSITION_FACTOR: 0.08,
  MAX_PACK_BOOST: 0.3,
  
  // Stability factors
  STABILITY_BASE_MIN: 0.9,
  STABILITY_BASE_MAX: 0.99,
  
  // Speed calculation
  BASE_MULTIPLIER: 0.075,
  MINIMUM_SPEED_FACTOR: 0.071,
  TRANSITION_RATE_BASE: 0.08,
  
  // Random factors
  BURST_CHANCE: 0.995,
  MIN_BURST_BOOST: 1.04,
  MAX_BURST_BOOST: 1.12
};

// UI constants
export const UI = {
  ANIMATION_DURATION: 300, // ms
  RACE_TRACK_HEIGHT: 500, // px
  LANE_HEIGHT: 50, // px
  HORSE_WIDTH: 50, // px
  HORSE_HEIGHT: 30, // px
  RESET_DELAY: 50 // ms
};

// Error messages
export const ERROR_MESSAGES = {
  RACE_GENERATION_FAILED: "Failed to generate race program",
  HORSE_GENERATION_FAILED: "Failed to generate horses",
  RACE_SIMULATION_ERROR: "Error occurred during race simulation"
}; 