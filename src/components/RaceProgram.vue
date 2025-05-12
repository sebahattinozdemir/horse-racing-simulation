<template>
  <div class="bg-program-bg p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-2">Program</h2>
    <div class="overflow-auto max-h-80">
      <div v-if="rounds.length > 0">
        <div v-if="currentRound" 
          class="mb-4 p-2 rounded bg-orange-200 border-2 border-orange-400"
        >
          <div class="font-bold border-b pb-1 border-gray-300 flex justify-between items-center">
            <span>Round {{ currentRound.id }} - {{ formatDistance(currentRound.distance) }}</span>
            <span v-if="currentRound.status === 'in-progress'" class="text-white bg-blue-600 px-2 py-0.5 rounded text-sm font-bold">
              ACTIVE
            </span>
          </div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-center py-1 w-20">Position</th>
                <th class="text-left py-1">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(horse, i) in currentRound.horses" :key="horse.id">
                <td class="text-center py-1">{{ i + 1 }}</td>
                <td class="py-1">{{ horse.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div v-for="round in otherRounds" :key="round.id"
          :class="[
            'mb-2 p-2 rounded', 
            round.status === 'completed' ? 'bg-white opacity-70' : 'bg-white',
          ]"
        >
          <div class="font-bold border-b pb-1 border-gray-300">
            Round {{ round.id }} - {{ formatDistance(round.distance) }}
          </div>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-center py-1 w-20">Position</th>
                <th class="text-left py-1">Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(horse, i) in round.horses" :key="horse.id">
                <td class="text-center py-1">{{ i + 1 }}</td>
                <td class="py-1">{{ horse.name }}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="round.status === 'completed'" class="mt-1 text-center text-green-700 font-semibold">
            Completed
          </div>
        </div>
      </div>
      <div v-else class="text-center p-4 bg-white rounded">
        Click "Generate Program" to start
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHorseRacingStore } from '../store/horseRacing';
import { formatDistance } from '../utils/raceUtils';

const store = useHorseRacingStore();
const rounds = computed(() => store.raceProgram.rounds);
const currentRoundIndex = computed(() => store.raceProgram.currentRound);

const currentRound = computed(() => store.getCurrentRound);

const otherRounds = computed(() => {
  if (!currentRound.value) return rounds.value;
  return rounds.value.filter(round => round.id !== currentRound.value?.id);
});
</script> 