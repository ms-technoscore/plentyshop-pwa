<template>
  <NuxtLink
    :to="localePath(content.link)"
    class="relative block w-full overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300"
    :style="{ height: content.height || '400px' }"
  >
    <NuxtImg
      v-if="isValidImage(content.image)"
      :src="content.image"
      :alt="content.alt"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div v-else class="absolute inset-0 flex items-center justify-start py-6 pointer-events-none">
      No Image
    </div>

    <div class="absolute inset-0 flex items-center justify-start py-6 pointer-events-none">
      
      <div class="bg-white/90 px-1 py-4 shadow-sm backdrop-blur-lg rounded-sm max-w-[85%] pointer-events-auto">
        <h3 class="text-lg md:text-lg font-extrabold text-black leading-tight tracking-wide">
            {{ content.title }}
        </h3>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PromoCardProps } from './types';
const localePath = useLocalePath();
defineProps<PromoCardProps>();

// Helper function to check if image is valid
const isValidImage = (url: string | null | undefined): boolean => {
  return !!url && typeof url === 'string' && url.trim() !== '';
};
</script>