<template>
  <div class="bg-white min-h-screen">
    <div class="container mx-auto p-4">
      <AppHeader />
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <HorseList class="md:col-span-1" />
        <RaceTrack class="md:col-span-2" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <RaceProgram />
        <RaceResults />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useHorseRacingStore } from './store/horseRacing';
import AppHeader from './components/AppHeader.vue';
import HorseList from './components/HorseList.vue';
import RaceTrack from './components/RaceTrack.vue';
import RaceProgram from './components/RaceProgram.vue';
import RaceResults from './components/RaceResults.vue';

const store = useHorseRacingStore();

onMounted(() => {
  store.generateHorses();
});
</script> 