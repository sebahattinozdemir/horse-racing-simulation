<template>
  <div class="relative h-[50px] w-full border-b border-gray-200 flex items-center bg-white">
    <div class="min-w-[30px] text-center font-bold text-gray-100 text-xs bg-[#4a6741] h-full flex items-center justify-center">
      {{ laneNumber }}
    </div>
    <div class="relative flex-grow h-full overflow-hidden m-0 p-0">
      <!-- Horse in Lane (if present) -->
      <div 
        v-if="horse"
        class="absolute flex items-center h-full left-0 top-1/2 transform -translate-y-1/2 z-10 will-change-left"
        :class="{ 
          'transition-none': isResetting,
          'transition-left duration-300 ease-linear': !isResetting
        }"
        :style="{ left: `${getHorsePosition(horse)}%` }"
      >
        <div class="flex flex-col items-center">
          <div 
            class="ml-1 text-xs px-1.5 py-0.5 rounded-md whitespace-nowrap font-medium min-w-16 text-center shadow-sm border-[1px] border-gray-300"
            :class="getTextColor(horse.color)"
            :style="{
              backgroundColor: getSafeColor(horse.color),
              fontWeight: 'bold'
            }"
          >
            {{ horse.name }}
          </div>
          <img 
            src="/horse.gif" 
            alt="Horse" 
            class="w-[50px] h-[30px] block object-contain"
            onerror="this.onerror=null; this.src='data:image/gif;base64,R0lGODlhyABkALMAAP///wAAADQ0NIODg729vcHBwdfX19ra2ufn5+np6fDw8PPz8/X19ff39/j4+P///yH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAUFAAEAIf4RT3B0aW1pemVkIHdpdGggZXpnaWYuY29tACwAAAAAyABkAAAE/zDISau9OOvNu/9gKI5kaZ5oqq5s675wLM90bd94ru/87//AoHBILBqPyKRyyWw6n9CodEqtWq/YrHbL7Xq/4LB4TC6bz+i0es1uu9/wuHxOr9vv+Lx+z+/7/4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAMKHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo0ePGQEBACH5BAUFAAAALAMAAwC/AEsAAAT/EMhJq7046827/2AojmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter/gsHhMLpvP6LR6zW673/C4fE6v2+/4vH7P7/v/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAwocSLCgwYMIEypcyLChw4cQI0qcSLGixYsYMyZMAAA7';" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Horse } from '../types';

const props = defineProps({
  laneNumber: { type: Number, required: true },
  horse: { type: Object as () => Horse | undefined, default: undefined },
  isResetting: { type: Boolean, default: false }
});

function getHorsePosition(horse: Horse): number {
  if (horse.progress === undefined || horse.progress === null) return 0;
  
  if (horse.progress >= 1) {
    return 95; 
  }
  
  return Math.min(horse.progress * 95, 95);
}

function getSafeColor(color: string): string {
  return color || '#CCCCCC';
}

function getTextColor(color: string): string {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return black for bright colors, white for dark
  return brightness > 125 ? 'text-gray-800' : 'text-white';
}
</script> 