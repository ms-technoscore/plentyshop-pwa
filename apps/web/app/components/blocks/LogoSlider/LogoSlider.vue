<template>
  <div class="w-full py-8 overflow-hidden relative bg-white marquee-container">
    <div v-if="content.title" class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-neutral-900">{{ content.title }}</h2>
    </div>

    <div
      class="flex w-full"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <div
        class="marquee-track flex whitespace-nowrap"
        :class="{ 'paused': isPaused }"
      >
        <div
          v-for="(item, index) in loopedItems"
          :key="index"
          class="marquee-item flex-shrink-0 flex items-center justify-center p-4 border border-neutral-100 rounded-lg mx-2 bg-white"
        >
          <NuxtLink
            v-if="item.link"
            :to="localePath(item.link)"
            class="flex items-center justify-center w-full h-24"
          >
            <NuxtImg
              v-if="item.image && typeof item.image === 'string'"
              :src="item.image"
              :alt="item.alt || 'Brand Logo'"
              class="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </NuxtLink>
          
          <div v-else class="flex items-center justify-center w-full h-24">
            <NuxtImg
              v-if="item.image && typeof item.image === 'string'"
              :src="item.image"
              :alt="item.alt || 'Brand Logo'"
              class="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { LogoSliderProps } from './types';

const props = defineProps<LogoSliderProps>();
const localePath = useLocalePath();

const isPaused = ref(false);

// THE MAGIC TRICK: We render exactly 4 identical sets of your logos. 
// The CSS animation will shift exactly 1 set over, then instantly reset to 0.
// Because the sets are identical, the human eye cannot see the reset!
const loopedItems = computed(() => {
  const items = props.content.items || [];
  return [...items, ...items, ...items, ...items];
});
</script>

<style scoped>
/* Responsive CSS Variables for exactly how many items show on screen */
.marquee-container {
  --items-per-page: 2; /* Mobile Default */
}

@media (min-width: 768px) {
  .marquee-container {
    --items-per-page: 3; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .marquee-container {
    --items-per-page: 5; /* Desktop */
  }
}

.marquee-item {
  /* Dynamically calculate width based on screen size, minus margin space (mx-2) */
  width: calc(100vw / var(--items-per-page) - 2rem);
  max-width: 250px;
}

.marquee-track {
  display: flex;
  width: max-content;
  /* 40 seconds for a smooth, slow glide. Lower this number to make it slide faster! */
  animation: marquee-scroll 40s linear infinite;
}

/* Pauses the animation gracefully when the user hovers over a logo */
.marquee-track.paused {
  animation-play-state: paused;
}

/* Pause the animation gracefully when the user hovers anywhere over the track */
.marquee-track:hover {
  animation-play-state: paused !important;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    /* Translates exactly 25% (1 full original set out of the 4 we rendered) */
    transform: translateX(-25%);
  }
}
</style>