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

// THE ILLUSION: Triple the array so we have plenty of duplicate runway to snap back and forth
const loopedItems = computed(() => {
  const items = props.content.items || [];
  return [...items, ...items, ...items];
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

// Scroll Backward (Seamless)
const scrollPrev = () => {
  const container = getContainer();
  if (container && props.content.items) {
    const scrollW = container.scrollWidth;
    if (scrollW <= 0) return; // FIX: Prevent math by 0 if DOM is not ready

    const itemWidth = scrollW / loopedItems.value.length;
    const singleSetWidth = itemWidth * props.content.items.length;

    // If we are at the very left edge, instantly jump to the identical item in the middle set
    if (container.scrollLeft <= 10) {
      container.scrollBy({ left: singleSetWidth, behavior: 'auto' });
      setTimeout(() => {
        container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
      }, 20);
    } else {
      container.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    }
  }
};

// Scroll Forward (Seamless)
const scrollNext = () => {
  const container = getContainer();
  if (container && props.content.items) {
    const scrollW = container.scrollWidth;
    if (scrollW <= 0) return; // FIX: Prevent math by 0 if DOM is not ready

    const itemWidth = scrollW / loopedItems.value.length;
    const singleSetWidth = itemWidth * props.content.items.length;
    
    // If we have scrolled past the first full set of original items
    if (container.scrollLeft >= singleSetWidth - 10) {
      // Instantly jump backward to the identical item in the first set
      container.scrollBy({ left: -singleSetWidth, behavior: 'auto' });
      
      setTimeout(() => {
        container.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }, 20);
    } else {
      container.scrollBy({ left: itemWidth, behavior: 'smooth' });
    }
  }
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

// Start playing when the component loads
onMounted(() => {
  // FIX: Delay startup to let SSR hydration and CSS layout shifts finish completely
  setTimeout(() => {
    const container = getContainer();
    if (container) {
      // Force the scrollbar to the very beginning just in case the browser snapped it to the end
      container.scrollLeft = 0; 
    }
    // Now that the DOM is stable and math is safe, start the loop
    startAutoPlay();
  }, 250);
});

// Stop playing when the user navigates away from the page
onBeforeUnmount(() => {
  pauseAutoPlay();
});
</script>