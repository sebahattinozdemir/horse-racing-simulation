<template lang="html">
  <div class="border border-gray-300 rounded-lg overflow-hidden">
    <div class="relative w-full h-auto bg-gray-100 overflow-hidden">
      <!-- Round Header -->
      <RaceTrackHeader 
        :current-round-number="currentRoundNumber"
        :current-race-distance="currentRaceDistance"
        :is-racing="isRacing"
        :can-toggle="canToggle"
        :show-timer="showTimer"
        :race-time="raceTime"
        @toggle-race="toggleRace"
      />
      
      <!-- Race Track Area -->
      <div class="relative w-full h-[500px] overflow-hidden bg-white">
        <!-- Race Track Lanes -->
        <RaceTrackLane 
          v-for="i in 10" 
          :key="i" 
          :lane-number="i"
          :horse="currentRaceHorses[i-1]"
          :is-resetting="isResetting"
        />
      </div>
      
      <!-- Auto-complete Notification -->
      <RaceCompletionNotification
        :is-visible="showLastHorseCompletion"
        :finish-time="lastHorseFinishTime"
      />
    </div>
    
    <RoundTransitionModal
      :is-visible="isTransitioning"
      :next-round="nextRoundNumber"
      :next-round-distance="nextRoundDistance"
      :transition-duration="transitionDuration"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useHorseRacingStore } from '../store/horseRacing';
import { simulateRaceStep, formatDistance, resetHorseProgress } from '../utils/raceUtils';
import RoundTransitionModal from './RoundTransitionModal.vue';
import RaceTrackHeader from './RaceTrackHeader.vue';
import RaceTrackLane from './RaceTrackLane.vue';
import RaceCompletionNotification from './RaceCompletionNotification.vue';
import { UI, RACE_CONFIG } from '../utils/constants';
import type { Horse, RaceResult } from '../types';

const store = useHorseRacingStore();
const currentRound = computed(() => store.getCurrentRound);
const nextRound = computed(() => store.getNextRound);
const isRacing = computed(() => store.isRacing);
const isPaused = computed(() => store.isPaused);
const currentRoundNumber = computed(() => store.raceProgram.currentRound + 1);
const isTransitioning = computed(() => store.isTransitioning);
const transitionDuration = computed(() => store.roundTransitionDelay);
const nextRoundNumber = computed(() => (nextRound.value?.id) || currentRoundNumber.value + 1);
const nextRoundDistance = computed(() => (nextRound.value?.distance) || 0);
const canToggle = computed(() => store.canStart || isRacing.value);

const currentRaceHorses = computed<Horse[]>(() => {
  if (!currentRound.value) return [];
  return currentRound.value.horses;
});

const currentRaceDistance = computed(() => {
  if (!currentRound.value) return '';
  return formatDistance(currentRound.value.distance);
});

const finishedHorses = ref(new Set<number>());
const finishedPositions = ref<Record<number, number>>({});
let animationFrameId: number | null = null;

const isResetting = ref(false);

const raceStartTime = ref(0);
const raceTime = ref(0);
const showTimer = ref(false);
const finishTimes = ref<Record<number, number>>({});

// Variables for tracking the last horse finishing
const showLastHorseCompletion = ref(false);
const lastHorseFinishTime = ref('');

function forceHorsesToStartPosition() {
  if (!currentRound.value) return;
  
  isResetting.value = true;
  
  resetHorseProgress(currentRound.value.horses);
  
  currentRound.value.horses.forEach(horse => {
    horse.progress = 0;
    horse.position = undefined;
  });
  
  nextTick(() => {
    setTimeout(() => {
      isResetting.value = false;
    }, UI.RESET_DELAY);
  });
}

function raceLoop() {
  try {
    if (!isRacing.value || isPaused.value || isTransitioning.value || !currentRound.value) {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      return;
    }
    
    if (!showTimer.value) {
      showTimer.value = true;
    }
    
    if (raceStartTime.value === 0) {
      raceStartTime.value = performance.now();
    }
    
    const currentTime = performance.now();
    raceTime.value = currentTime - raceStartTime.value;
    
    // Simulate race step
    const results = simulateRaceStep(
      currentRound.value.horses, 
      currentRound.value.distance, 
      finishedHorses.value
    );
    
    // Process results
    results.forEach(result => {
      // Record finish time
      if (!finishTimes.value[result.horseId]) {
        finishTimes.value[result.horseId] = raceTime.value;
        result.finishTime = formatTime(raceTime.value);
      }
      
      // Update live results in store
      store.updateLiveResults(result);
    });
    
    // Check if all horses have finished
    if (finishedHorses.value.size === currentRound.value.horses.length) {
      // All horses finished
      const finalResults = currentRound.value.horses.map(horse => {
        const position = currentRound.value!.results.find(r => r.horseId === horse.id)?.position || 0;
        return {
          position,
          horseId: horse.id,
          horseName: horse.name,
          finishTime: formatTime(finishTimes.value[horse.id] || raceTime.value)
        };
      });
      
      // Show last horse completion notification
      showLastHorseCompletion.value = true;
      const lastFinishedHorse = finalResults.sort((a, b) => b.position - a.position)[0];
      lastHorseFinishTime.value = lastFinishedHorse.finishTime || '';
      
      setTimeout(() => {
        showLastHorseCompletion.value = false;
        store.finishCurrentRound(finalResults);
      }, 2000);
      
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      
      return;
    }
    
    // Continue animation loop
    animationFrameId = requestAnimationFrame(raceLoop);
  } catch (error) {
    console.error('Error in race loop:', error);
    store.pauseRace();
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
}

function startRaceLoop() {
  finishedHorses.value = new Set<number>();
  finishedPositions.value = {};
  finishTimes.value = {};
  raceStartTime.value = 0;
  raceTime.value = 0;
  
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  
  animationFrameId = requestAnimationFrame(raceLoop);
}

function stopRaceLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function toggleRace() {
  store.toggleRace();
}

function formatTime(timeInMs: number): string {
  const seconds = timeInMs / 1000;
  return seconds.toFixed(2) + 's';
}

// Watch for race status changes
watch(() => store.raceProgram.status, (newStatus, oldStatus) => {
  if (newStatus === 'racing' && oldStatus !== 'racing') {
    startRaceLoop();
  } else if (newStatus !== 'racing' && oldStatus === 'racing') {
    stopRaceLoop();
  }
});

// Watch for round changes
watch(() => store.raceProgram.currentRound, () => {
  forceHorsesToStartPosition();
  finishedHorses.value = new Set<number>();
  finishedPositions.value = {};
  finishTimes.value = {};
  showTimer.value = false;
  raceStartTime.value = 0;
  raceTime.value = 0;
});

// Clean up on unmount
onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
});
</script> 