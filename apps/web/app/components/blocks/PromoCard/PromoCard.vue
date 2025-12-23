<template>
  <NuxtLink
    :to="localePath(content.link)"
    class="relative block w-full overflow-hidden group cursor-pointer rounded-xl"
    :style="{ height: content.height || '400px' }"
  >
    <NuxtImg
      v-if="isValidImage(content.image)"
      :src="content.image"
      :alt="content.alt"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div v-else class="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
      No Image
    </div>

    <div class="absolute inset-0 flex items-start justify-start px-4 pt-16 pb-4 pointer-events-none">
      <div class="bg-white/85 px-6 py-5 shadow-sm backdrop-blur-md rounded-lg max-w-[90%] md:max-w-[70%] mr-4 pointer-events-auto">
        <h3 class="text-xl md:text-2xl font-bold text-gray-900 leading-snug">
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