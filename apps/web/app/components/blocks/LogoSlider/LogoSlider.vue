<template>
  <div 
    class="w-full py-8 relative"
    @mouseenter="pauseAutoPlay" 
    @mouseleave="startAutoPlay"
  >
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
          @click.stop="scrollNext"
        >
          <SfIconChevronRight />
        </SfButton>
      </template>

      <div
        v-for="(item, index) in loopedItems"
        :key="index"
        class="flex-shrink-0 snap-start flex items-center justify-center p-4 border border-neutral-100 rounded-lg bg-white"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
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
let autoPlayInterval: ReturnType<typeof setInterval> | null = null;

// THE ILLUSION: 7 identical sets guarantees we never run out of runway 
// even if the user aggressively drags the slider manually.
const SETS = 7;
const MIDDLE_SET = 3;

const loopedItems = computed(() => {
  const items = props.content.items || [];
  let result: typeof items = [];
  for (let i = 0; i < SETS; i++) {
    result.push(...items);
  }
  return result;
});

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
  if (!component || !component.$el) return null;
  if (component.containerRef) return component.containerRef;

  const root = component.$el as HTMLElement;
  const byClass = root.querySelector('.sf-scrollable__container');
  if (byClass) return byClass as HTMLElement;

  const children = Array.from(root.children) as HTMLElement[];
  const scrollableChild = children.find((child) => {
    const style = window.getComputedStyle(child);
    return style.overflowX === 'auto' || style.overflowX === 'scroll';
  });

  return scrollableChild || root;
};

// THE MAGIC TRICK: Instantly moves the scrollbar without triggering CSS smooth scrolling
const teleport = (container: HTMLElement, distance: number) => {
  const originalBehavior = container.style.scrollBehavior;
  container.style.scrollBehavior = 'auto'; // Disable smooth scroll
  container.scrollLeft += distance;
  void container.offsetHeight; // Force the browser to register the jump instantly
  container.style.scrollBehavior = originalBehavior; // Restore smooth scroll
};

const scrollPrev = () => {
  const container = getContainer();
  if (!container || !props.content.items?.length) return;

  const singleSetWidth = container.scrollWidth / SETS;
  const itemWidth = singleSetWidth / props.content.items.length;

  // If we are scrolling too far left (leaving Set 2), teleport forward into Set 3
  if (container.scrollLeft <= singleSetWidth * 2) {
    teleport(container, singleSetWidth);
  }

  // Wait 1 frame to ensure the teleport finishes before starting the smooth slide
  requestAnimationFrame(() => {
    container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
  });
};

const scrollNext = () => {
  const container = getContainer();
  if (!container || !props.content.items?.length) return;

  const singleSetWidth = container.scrollWidth / SETS;
  const itemWidth = singleSetWidth / props.content.items.length;
  
  // If we are scrolling too far right (entering Set 4), teleport backward into Set 3
  if (container.scrollLeft >= singleSetWidth * 4) {
    teleport(container, -singleSetWidth);
  }

  requestAnimationFrame(() => {
    container.scrollBy({ left: itemWidth, behavior: 'smooth' });
  });
};

// --- AUTO-PLAY LOGIC ---
const startAutoPlay = () => {
  if (!autoPlayInterval) {
    autoPlayInterval = setInterval(() => {
      scrollNext();
    }, 1500); 
  }
};

const pauseAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
};

onMounted(() => {
  // Delay startup to let SSR hydration and CSS layout shifts finish completely
  setTimeout(() => {
    const container = getContainer();
    if (container && props.content.items?.length) {
      const singleSetWidth = container.scrollWidth / SETS;
      // Start the user exactly at the beginning of Set 3
      teleport(container, singleSetWidth * MIDDLE_SET);
    }
    startAutoPlay();
  }, 250);
});

onBeforeUnmount(() => {
  pauseAutoPlay();
});
</script>