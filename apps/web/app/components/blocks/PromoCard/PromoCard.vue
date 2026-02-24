<template>
  <NuxtLink
    :to="localePath(content.link)"
    class="flex flex-col w-full group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-neutral-100"
    :style="{ height: content.height || '250px' }"
  >
    <div class="relative w-full flex-1 overflow-hidden bg-neutral-50">
      <NuxtImg
        v-if="isValidImage(content.image)"
        :src="content.image"
        :alt="content.alt"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
        Kein Bild
      </div>
    </div>

    <div class="w-full p-4 flex items-center justify-center bg-white border-t border-neutral-100 z-10 transition-colors duration-300 group-hover:bg-neutral-50">
      <h3 class="text-sm md:text-base font-bold text-neutral-900 leading-tight text-center line-clamp-2">
        {{ content.title }}
      </h3>
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