<template>
  <NuxtLink
    :to="localePath(content.link)"
    class="relative block w-full overflow-hidden group cursor-pointer"
    :style="{ height: content.height || '400px' }"
  >
    <NuxtImg
      v-if="content.image && typeof content.image === 'string'"
      :src="content.image"
      :alt="content.alt"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div v-else class="absolute inset-0 bg-neutral-200 flex items-center justify-center text-neutral-400">
      No Image
    </div>

    <div class="absolute inset-0 flex items-center p-8">
      <div class="bg-white/90 px-6 py-4 shadow-sm max-w-[85%] backdrop-blur-sm">
        <h3 class="text-3xl font-extrabold text-black italic uppercase leading-tight transform -skew-x-6">
          <span class="not-italic inline-block transform skew-x-6">
            {{ content.title }}
          </span>
        </h3>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PromoCardProps } from './types';
const localePath = useLocalePath();
defineProps<PromoCardProps>();
</script>