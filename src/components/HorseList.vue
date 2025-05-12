<template>
  <div class="bg-horse-list-bg p-4 rounded-lg">
    <h2 class="text-lg font-bold mb-2">Horse List (1-20)</h2>
    <div class="overflow-auto max-h-[500px]">
      <table class="w-full border-collapse">
        <thead class="bg-white sticky top-0">
          <tr>
            <th class="text-left p-2">Name</th>
            <th class="text-center p-2">Condition</th>
            <th class="text-center p-2">Color</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="horse in horses" :key="horse.id" class="border-b border-gray-300">
            <td class="p-2">{{ horse.name }}</td>
            <td class="text-center p-2">{{ horse.condition }}</td>
            <td class="p-2 flex justify-center">
              <div 
                class="w-6 h-6 rounded-full" 
                :style="{ backgroundColor: horse.color }"
                :title="horse.color"
              ></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHorseRacingStore } from '../store/horseRacing';

const store = useHorseRacingStore();
const horses = computed(() => store.allHorses);
</script> 