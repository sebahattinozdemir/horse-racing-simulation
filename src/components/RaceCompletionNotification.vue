<template>
  <div v-if="isVisible" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white px-5 py-2.5 rounded z-10">
    <div class="flex items-center gap-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd" />
      </svg>
      <div class="flex flex-col gap-1">
        <div>Last horse finished the race!</div>
        <div v-if="finishTime" class="text-sm opacity-90 font-bold text-yellow-400">
          Finish time: {{ finishTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps({
  isVisible: { type: Boolean, default: false },
  finishTime: { type: String, default: '' }
});
</script> 