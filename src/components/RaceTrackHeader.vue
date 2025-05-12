<template>
  <div class="flex justify-between items-center bg-gray-800 text-white px-3 py-2 font-bold border-b border-gray-300">
    <div class="text-sm">
      Round {{ currentRoundNumber }} of 6 - {{ currentRaceDistance }}
    </div>
    <div class="mr-10">
      <button 
        @click="toggleRace" 
        class="bg-yellow-400 text-gray-800 border-none py-1 px-3 rounded cursor-pointer"
        :disabled="!canToggle"
      >
        {{ isRacing ? 'PAUSE' : 'PLAY' }}
      </button>
    </div>
    <div class="text-yellow-400 text-lg font-bold mr-10 flex flex-col items-center shadow-sm">
      FINISH
      <div class="text-white text-lg mt-1 bg-black bg-opacity-70 py-1 px-3 rounded-md min-w-20 text-center shadow-md">
        {{ (showTimer || isRacing) ? formatTime(raceTime) : '00.00s' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  currentRoundNumber: { type: Number, required: true },
  currentRaceDistance: { type: String, required: true },
  isRacing: { type: Boolean, default: false },
  canToggle: { type: Boolean, default: true },
  showTimer: { type: Boolean, default: false },
  raceTime: { type: Number, default: 0 }
});

const emit = defineEmits(['toggle-race']);

function toggleRace() {
  emit('toggle-race');
}

function formatTime(timeInMs: number): string {
  const seconds = timeInMs / 1000;
  return seconds.toFixed(2) + 's';
}
</script> 