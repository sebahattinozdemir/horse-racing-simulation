<template>
  <header class="bg-header-bg p-4 rounded-lg flex items-center justify-between">
    <h1 class="text-2xl font-bold">Horse Racing Simulator</h1>
    <div class="flex gap-2">
      <button 
        @click="generateRace" 
        class="bg-white hover:bg-gray-100 py-2 px-4 rounded"
        :disabled="isRacing || isPaused"
      >
        GENERATE PROGRAM
      </button>

      <div v-if="isCompleted" class="bg-green-100 py-2 px-4 rounded text-green-800 font-bold">
        All Races Completed
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHorseRacingStore } from '../store/horseRacing';

const store = useHorseRacingStore();

const isRacing = computed(() => store.isRacing);
const isPaused = computed(() => store.isPaused);
const isCompleted = computed(() => store.isCompleted);

function generateRace() {
  store.generateRaceProgram();
}

</script> 