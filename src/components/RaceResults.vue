<template>
  <div class="bg-results-bg p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-2">Results</h2>
    <div class="overflow-auto max-h-80">
      <div v-if="hasCurrentRoundResults || hasCompletedRoundResults">
        <div v-if="hasCurrentRoundResults" class="mb-2 p-2 rounded bg-white border-2 border-yellow-400">
          <div class="font-bold border-b pb-1 border-gray-300 flex justify-between items-center">
            <span>Round {{ currentRound?.id }} - {{ currentRound ? formatDistance(currentRound.distance) : '' }}</span>
            <span class="text-white bg-red-600 px-2 py-0.5 rounded animate-pulse text-sm font-bold">LIVE</span>
          </div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-center py-1 w-16">Lane</th>
                <th class="text-left py-1">Name</th>
                <th class="text-center py-1 w-16">Position</th>
                <th class="text-center py-1 w-24">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="horse in sortedCurrentResults" :key="horse.horseId" class="relative">
                <td class="text-center py-1">{{ getLaneForHorse(horse.horseId) }}</td>
                <td class="py-1">{{ horse.horseName }}</td>
                <td class="text-center py-1 font-bold">
                  <span 
                    :class="{ 
                      'text-green-600': hasPositionChanged(horse.horseId),
                      'animate-flash': hasPositionChanged(horse.horseId)
                    }"
                  >
                    {{ horse.position }}
                  </span>
                </td>
                <td class="text-center py-1 text-sm">
                  {{ 'finishTime' in horse ? horse.finishTime || '-' : '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-for="round in completedRounds" :key="round.id"
          class="mb-2 p-2 rounded bg-white"
        >
          <div class="font-bold border-b pb-1 border-gray-300">
            Round {{ round.id }} - {{ formatDistance(round.distance) }}
          </div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-center py-1 w-16">Position</th>
                <th class="text-left py-1">Name</th>
                <th class="text-center py-1 w-24">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in sortedResults(round)" :key="result.horseId">
                <td class="text-center py-1">{{ result.position }}</td>
                <td class="py-1">{{ result.horseName }}</td>
                <td class="text-center py-1 text-sm">{{ result.finishTime || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="text-center p-4 bg-white rounded">
        No results yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useHorseRacingStore } from '../store/horseRacing';
import { formatDistance } from '../utils/raceUtils';
import type { RaceRound, RaceResult } from '../types';

const store = useHorseRacingStore();

const currentRound = computed(() => store.getCurrentRound);
const isRacing = computed(() => store.isRacing);

const recentlyChangedPositions = ref(new Set<number>());

const completedRounds = computed<RaceRound[]>(() => {
  const rounds = store.raceProgram.rounds
    .filter(round => round.status === 'completed' && round.results.length > 0 && round.id !== currentRound.value?.id)
    .sort((a, b) => a.id - b.id);
  
  return rounds;
});

const hasCurrentRoundResults = computed(() => {
  return currentRound.value && 
         (currentRound.value.status === 'in-progress' || isRacing.value); 
});

const hasCompletedRoundResults = computed(() => completedRounds.value.length > 0);

const sortedCurrentResults = computed(() => {
  if (!currentRound.value) return [];
  
  if (currentRound.value.results.length === 0 && isRacing.value) {
    return currentRound.value.horses.map((horse, index) => ({
      position: '-',
      horseId: horse.id,
      horseName: horse.name
    }));
  }
  
  return [...currentRound.value.results].sort((a, b) => a.position - b.position);
});

function sortedResults(round: RaceRound): RaceResult[] {
  if (!round || !round.results) return [];
  return [...round.results].sort((a, b) => a.position - b.position);
}

function getLaneForHorse(horseId: number): number {
  if (!currentRound.value) return 0;
  const index = currentRound.value.horses.findIndex(h => h.id === horseId);
  return index >= 0 ? index + 1 : 0;
}

function hasPositionChanged(horseId: number): boolean {
  return recentlyChangedPositions.value.has(horseId);
}

watch(() => currentRound.value?.results, (newResults, oldResults) => {
  if (!newResults || !oldResults) return;
  
  for (const result of newResults) {
    const oldResult = oldResults.find(r => r.horseId === result.horseId);
    if (!oldResult || oldResult.position !== result.position) {
      recentlyChangedPositions.value.add(result.horseId);
      
      setTimeout(() => {
        recentlyChangedPositions.value.delete(result.horseId);
      }, 2000);
    }
  }
}, { deep: true });
</script>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes flash {
  0%, 100% { background-color: transparent; }
  50% { background-color: rgba(16, 185, 129, 0.1); }
}

.animate-flash {
  animation: flash 1s ease-in-out;
}
</style> 