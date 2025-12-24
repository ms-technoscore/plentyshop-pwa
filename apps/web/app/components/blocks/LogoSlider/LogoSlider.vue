<template>
  <div class="w-full py-8 relative">
    <div v-if="content.title" class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-neutral-900">{{ content.title }}</h2>
    </div>

    <SfScrollable
      ref="sliderRef"
      class="items-center w-full"
      :wrapper-class="'gap-4'"
      buttons-placement="floating"
      drag
    >
      <template #previousButton="{ disabled }">
        <SfButton
          variant="secondary"
          size="lg"
          square
          class="!rounded-full bg-white border-neutral-200 shadow-md absolute left-4 z-10 hidden md:flex"
          :disabled="disabled"
          @click.stop="scrollPrev"
        >
          <SfIconChevronLeft />
        </SfButton>
      </template>

      <template #nextButton="{ disabled }">
        <SfButton
          variant="secondary"
          size="lg"
          square
          class="!rounded-full bg-white border-neutral-200 shadow-md absolute right-4 z-10 hidden md:flex"
          :disabled="disabled"
          @click.stop="scrollNext"
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
import type { ComponentPublicInstance } from 'vue';
import { SfScrollable, SfButton, SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/vue';
import type { LogoSliderProps } from './types';

interface SfScrollableInstance extends ComponentPublicInstance {
  containerRef?: HTMLElement;
}

const props = defineProps<LogoSliderProps>();
const localePath = useLocalePath();
const viewport = useViewport();

const sliderRef = ref<SfScrollableInstance | null>(null);

// Determine how many items are visible per row
const itemsCount = computed(() => {
  if (viewport.isGreaterOrEquals('lg')) {
    return props.content.itemsPerPageDesktop || 5;
  } else if (viewport.isGreaterOrEquals('md')) {
    return props.content.itemsPerPageTablet || 3;
  } else {
    return props.content.itemsPerPageMobile || 2;
  }
});

const itemStyle = computed(() => {
  return {
    flex: `0 0 calc(100% / ${itemsCount.value} - 16px)`, 
  };
});

const getContainer = (): HTMLElement | null => {
  const component = sliderRef.value;
  if (!component || !component.$el) {
    return null;
  }

  if (component.containerRef) return component.containerRef;

  const root = component.$el as HTMLElement;

  const byClass = root.querySelector('.sf-scrollable__container');
  if (byClass) return byClass as HTMLElement;

  const children = Array.from(root.children) as HTMLElement[];
  const scrollableChild = children.find((child) => {
    const style = window.getComputedStyle(child);
    return style.overflowX === 'auto' || style.overflowX === 'scroll';
  });

  if (scrollableChild) return scrollableChild;

  return root;
};

// Scroll Backward
const scrollPrev = () => {
  const container = getContainer();
  if (container) {
    const itemWidth = container.offsetWidth / itemsCount.value;
    container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  }
};

// Scroll Forward
const scrollNext = () => {
  const container = getContainer();
  if (container) {
    const itemWidth = container.offsetWidth / itemsCount.value;
    container.scrollBy({ left: itemWidth, behavior: 'smooth' });
  }
};
</script>