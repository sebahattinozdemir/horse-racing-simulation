<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-center transform transition-all">
      <h2 class="text-2xl font-bold mb-4">Round {{ nextRound }} Starting</h2>
      <div class="text-5xl font-bold text-blue-600 mb-4">{{ countdown }}</div>
      <p class="mb-2">Distance: {{ formatDistance(nextRoundDistance) }}</p>
      <p class="text-sm text-gray-600">Preparing horses for the next race...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { formatDistance } from '../utils/raceUtils';

const props = defineProps<{
  isVisible: boolean;
  nextRound: number;
  nextRoundDistance: number;
  transitionDuration: number;
}>();

const countdown = ref(Math.ceil(props.transitionDuration / 1000));
let countdownInterval: number | null = null;

watch(() => props.isVisible, (visible) => {
  if (visible) {
    startCountdown();
  } else if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}, { immediate: true });

onMounted(() => {
  if (props.isVisible) {
    startCountdown();
  }
});

function startCountdown() {
  countdown.value = Math.ceil(props.transitionDuration / 1000);
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = window.setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0 && countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }, 1000);
}

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
.transform {
  animation: pulse 1s infinite alternate;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
}
</style> 