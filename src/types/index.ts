export interface Horse {
  id: number;
  name: string;
  condition: number;
  color: string;
  position?: number;
  progress?: number;
  lastSpeedFactor?: number; 
  racingStyle?: 'frontrunner' | 'steady' | 'closer'; 
  
  raceDayFactor?: number;     
  trackPreference?: number;   
  luckyFactor?: number;       
  distancePreference?: number; 
}

export interface RaceRound {
  id: number;
  distance: number;
  horses: Horse[];
  results: RaceResult[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface RaceResult {
  position: number;
  horseId: number;
  horseName: string;
  finishTime?: string; 
}

export interface RaceProgram {
  rounds: RaceRound[];
  currentRound: number;
  status: 'idle' | 'generated' | 'racing' | 'paused' | 'completed';
}

export const COLORS = [
  '#FF0000', // Red
  '#0000FF', // Blue
  '#008000', // Green
  '#FFFF00', // Yellow
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#000000', // Black
  '#FFFFFF', // White
  '#808080', // Grey
  '#00FFFF', // Cyan
  '#FF00FF', // Magenta
  '#00FF00', // Lime
  '#008080', // Teal
  '#4B0082', // Indigo
  '#EE82EE', // Violet
  '#800000', // Maroon
  '#000080', // Navy
  '#808000'  // Olive
];

export const ROUND_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200]; 