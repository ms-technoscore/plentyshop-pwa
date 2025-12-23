<template>
  <div class="w-full py-8 relative">
    <div v-if="content.title" class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-neutral-900">{{ content.title }}</h2>
    </div>

    <SfScrollable
      class="items-center w-full"
      :wrapper-class="'gap-4'"
      buttons-placement="floating"
      drag
    >
      <template #previousButton="{ disabled, onClick }">
        <SfButton
          variant="secondary"
          size="lg"
          square
          class="!rounded-full bg-white border-neutral-200 shadow-md absolute left-4 z-10 hidden md:flex"
          :disabled="disabled"
          @click="onClick"
        >
          <SfIconChevronLeft />
        </SfButton>
      </template>

      <template #nextButton="{ disabled, onClick }">
        <SfButton
          variant="secondary"
          size="lg"
          square
          class="!rounded-full bg-white border-neutral-200 shadow-md absolute right-4 z-10 hidden md:flex"
          :disabled="disabled"
          @click="onClick"
        >
          <SfIconChevronRight />
        </SfButton>
      </template>

      <div
        v-for="(item, index) in content.items"
        :key="index"
        class="flex-shrink-0 snap-start flex items-center justify-center p-4 border border-neutral-100 rounded-lg bg-white grayscale hover:grayscale-0 transition-all duration-300"
        :style="itemStyle"
      >
        <NuxtLink 
          :to="item.link ? localePath(item.link) : undefined" 
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
      </div>
    </SfScrollable>
  </div>
</template>

<script setup lang="ts">
import { SfScrollable, SfButton, SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import type { LogoSliderProps } from './types';

const props = defineProps<LogoSliderProps>();
const localePath = useLocalePath();
const viewport = useViewport();

// Calculate width dynamically based on viewport and settings
const itemStyle = computed(() => {
  let count = 2; // Default fallback

  if (viewport.isGreaterOrEquals('lg')) {
    count = props.content.itemsPerPageDesktop || 5;
  } else if (viewport.isGreaterOrEquals('md')) {
    count = props.content.itemsPerPageTablet || 3;
  } else {
    count = props.content.itemsPerPageMobile || 2;
  }

  // Calculate percentage width minus the gap approximation
  return {
    flex: `0 0 calc(100% / ${count} - 16px)`, // 16px roughly accounts for gap
  };
});
</script>