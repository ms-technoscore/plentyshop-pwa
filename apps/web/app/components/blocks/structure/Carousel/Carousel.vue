<template>
  <NuxtErrorBoundary>
    <div class="relative w-full group">

      <div class="absolute inset-0 z-[50] flex flex-col items-center justify-center pointer-events-none h-full w-full">
        <div 
          class="pointer-events-auto bg-[#eadd87] bg-opacity-90 p-6 rounded shadow-lg max-w-[90%] md:max-w-[600px] text-center border-2 border-white relative"
          :style="{ backgroundColor: overlayConfig.bgColor }"
        >
          
          <div class="flex items-center justify-center mb-3">
            <div class="bg-black text-white font-bold px-3 py-1 rounded-full mr-3 text-lg">
              {{ overlayConfig.badgeText }}
            </div>
            <span class="text-black font-medium text-lg md:text-xl text-left leading-tight" v-html="overlayConfig.description" />
          </div>

          <div class="relative w-full">
            <form class="flex w-full bg-white border border-gray-400 rounded relative z-[60]" @submit.prevent="handleSearch">
              <input 
                v-model="searchQuery" 
                @input="onSearchInput"
                type="text" 
                :placeholder="overlayConfig.placeholder" 
                class="flex-1 px-4 py-3 outline-none text-black rounded-l"
                autocomplete="off"
              />
              <button 
                type="submit" 
                class="px-6 py-2 font-bold text-black border-l border-gray-300 hover:bg-gray-50 transition-colors"
              >
                {{ overlayConfig.searchBtnText }}
              </button>
            </form>

            <div 
              v-if="searchResults.length > 0 && searchQuery.length > 2" 
              class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-b-lg shadow-xl z-[50] overflow-hidden text-left"
            >
              <ul>
                <li 
                  v-for="product in searchResults" 
                  :key="product.id"
                  class="flex items-center p-3 border-b border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors"
                  @click="goToProduct(product)"
                >
                  <div class="w-12 h-12 flex-shrink-0 mr-4 border border-gray-200 rounded overflow-hidden bg-white">
                    <img 
                      :src="product.image || 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png'" 
                      :alt="product.name" 
                      class="w-full h-full object-contain"
                    />
                  </div>
                  <div class="flex-1">
                    <p class="text-black text-sm font-medium leading-tight line-clamp-2">
                      {{ product.name }}
                    </p>
                  </div>
                  <div class="ml-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-4" v-if="overlayConfig.showBottomBtn">
             <a :href="overlayConfig.bottomBtnLink" class="inline-block bg-[#f3d03e] text-black font-bold py-2 px-6 rounded uppercase text-sm hover:bg-[#eac426]">
               {{ overlayConfig.bottomBtnText }}
             </a>
          </div>

        </div>
      </div>

      <Swiper
        :id="`carousel-${index}`"
        :key="content.length"
        :modules="enableModules ? [Pagination, Navigation] : []"
        :slides-per-view="1"
        v-bind="carouselProps"
        :aria-roledescription="t('homepage.banner.ariaRoleDescriptionCarousel')"
        :aria-label="t('homepage.banner.ariaRoleDescriptionCarousel')"
        :loop="true"
        :pagination="paginationConfig"
        :navigation="navigationConfig"
        class="!z-0 !w-full !max-h-[85vh]"
        @swiper="onSwiperInit"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="(banner, slideIndex) in content"
          :key="slideIndex"
          :aria-labelledby="content.length > 1 ? `carousel_item-${slideIndex}_heading` : null"
          :aria-label="
            content.length > 1
              ? t('homepage.banner.ariaLabelSlidePosition', { current: slideIndex + 1, total: content.length })
              : null
          "
          v-bind="carouselProps"
          :aria-roledescription="t('homepage.banner.ariaRoleDescriptionSlide')"
        >
          <slot
            name="content"
            :content-block="banner"
            :index="getSlideAdjustedIndex(slideIndex)"
            :slide-index="slideIndex"
            :lazy-loading="slideIndex > 0 ? 'lazy' : 'eager'"
          />
        </SwiperSlide>
        <div
          v-if="enableModules"
          :class="`swiper-pagination swiper-pagination-${index} swiper-pagination-bullets swiper-pagination-horizontal`"
        />
      </Swiper>

      <button
        v-if="enableModules && handleArrows()"
        :key="`prev-${index}`"
        type="button"
        :class="`swiper-button-prev swiper-button-prev-${index}`"
        :aria-controls="`carousel-${index}`"
        :aria-label="t('homepage.banner.ariaLabelPreviousSlide')"
        :style="{ color: configuration.controls.color + ' !important' }"
      />
      <button
        v-if="enableModules && handleArrows()"
        :key="`next-${index}`"
        type="button"
        :class="`swiper-button-next swiper-button-next-${index}`"
        :aria-controls="`carousel-${index}`"
        :aria-label="t('homepage.banner.ariaLabelNextSlide')"
        :style="{ color: configuration.controls.color + ' !important' }"
      />
    </div>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import type { CarouselStructureProps } from './types';
import type { Swiper as SwiperType } from 'swiper';
import { ref, computed, watch, nextTick } from 'vue';

const { activeSlideIndex, setIndex } = useCarousel();
const { content, index, configuration, meta } = defineProps<CarouselStructureProps>();
const isInternalChange = ref(false);

// --- DYNAMIC SEARCH CONFIGURATION ---
const overlayConfig = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const custom = (configuration as any).overlay || {};
  return {
    badgeText: custom.badgeText || 'Finden',
    description: custom.description || 'was Du suchst! Einfach Typnummer,<br />Modell, oder Hersteller eingeben',
    placeholder: custom.placeholder || 'Suchbegriff...',
    searchBtnText: custom.searchBtnText || 'und los!',
    bgColor: custom.bgColor || '#eadd87',
    showBottomBtn: custom.showBottomBtn !== false,
    bottomBtnText: custom.bottomBtnText || 'LAGERTECHNIK >',
    bottomBtnLink: custom.bottomBtnLink || '/lagertechnik'
  };
});

// ------------------------------------
// --- LIVE AJAX SEARCH LOGIC ---
// ------------------------------------
const router = useRouter();
const localePath = useLocalePath();
const searchQuery = ref('');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchResults = ref<any[]>([]); 
let debounceTimeout: NodeJS.Timeout | null = null;

// 1. Input Handler with Debounce
const onSearchInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  // Wait 300ms before hitting the API to save resources
  debounceTimeout = setTimeout(() => {
    fetchSuggestions();
  }, 300);
};

// 2. The Real API Call
const fetchSuggestions = async () => {
  const term = searchQuery.value.trim();
  
  if (term.length < 3) {
    searchResults.value = [];
    return;
  }

  try {
    const response = await fetch('http://localhost:8181/plentysystems/getSearch', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ term: term }) 
    });

    const rawData = await response.json();
    const products = rawData?.data?.products || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    searchResults.value = products.slice(0, 6).map((item: any) => ({
      id: item.id,
      name: item.texts?.name1 || item.name || 'Product',
      image: item.images?.all?.[0]?.url || '',
      url: item.urlPath || `/product/${item.id}` 
    }));

  } catch {
    // Error ignored to satisfy linting rules
    searchResults.value = [];
  }
};

// 3. Navigate on Click
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const goToProduct = (product: any) => {
  searchResults.value = []; // Close dropdown
  // Check if it's a full URL or relative path
  if (product.url.startsWith('http')) {
    window.location.href = product.url;
  } else {
    router.push(localePath(product.url));
  }
};

// 4. Handle "Enter" Key (Full Search Page)
const handleSearch = () => {
  if (searchQuery.value.trim().length > 0) {
    searchResults.value = [];
    // Redirect to the search page you showed in the first screenshot
    window.location.href = `http://localhost:3000/search?term=${searchQuery.value}`;
  }
};
// ------------------------------------

const handleArrows = () => {
  const viewport = useViewport();
  return !viewport.isLessThan('md');
};

const enableModules = computed(() => content.length > 1);
let slider: SwiperType | null = null;

const paginationConfig = computed(() => {
  return enableModules.value && configuration.controls.color
    ? {
        el: `.swiper-pagination-${index}`,
        clickable: true,
        bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary-500',
        renderBullet(index: number, className: string) {
          return `<span key="dot-${index}" class="${className}" style="background-color: ${configuration.controls.color}!important;"></span>`;
        },
      }
    : false;
});

const navigationConfig = computed(() => {
  return enableModules.value
    ? {
        nextEl: `.swiper-button-next-${index}`,
        prevEl: `.swiper-button-prev-${index}`,
      }
    : false;
});

const carouselProps = computed(() => {
  return content.length > 1 ? { role: 'group' } : {};
});

const onSwiperInit = async (swiper: SwiperType) => {
  slider = swiper;
  if (activeSlideIndex.value[meta.uuid] === null) {
    setIndex(meta.uuid, swiper.realIndex);
  }
};

const reinitializeSwiper = async () => {
  if (!slider || slider.destroyed) return;
  await nextTick();
  slider.update();
  if (slider.params.navigation && slider.navigation) {
    slider.navigation.destroy();
    slider.navigation.init();
    slider.navigation.update();
  }
  if (slider.params.pagination && slider.pagination) {
    slider.pagination.destroy();
    slider.pagination.init();
    slider.pagination.update();
  }
};

const onSlideChange = async (swiper: SwiperType) => {
  const realIndex = swiper.realIndex;
  if (isInternalChange.value) {
    isInternalChange.value = false;
    return;
  }
  if (realIndex !== activeSlideIndex.value[meta.uuid]) {
    setIndex(meta.uuid, realIndex);
  }
};

const getSlideAdjustedIndex = (slideIndex: number) => {
  return activeSlideIndex.value[meta.uuid] === slideIndex ? index : index + slideIndex;
};

watch(
  () => activeSlideIndex.value[meta.uuid],
  (newIndex) => {
    if (!slider || slider.destroyed) return;
    if (slider.realIndex !== newIndex) {
      isInternalChange.value = true;
      if (slider.params.loop) {
        slider.slideToLoop(newIndex ?? 0);
      } else {
        slider.slideTo(newIndex ?? 0);
      }
    }
  },
  { flush: 'post' },
);

watch(
  () => content.length,
  async (newLength, oldLength) => {
    if (oldLength <= 1 && newLength > 1) {
      await reinitializeSwiper();
    }
  },
);

watch(
  () => configuration.controls.color,
  (newColor, oldColor) => {
    if (slider && !slider.destroyed && newColor !== oldColor) {
      slider.pagination.render();
      slider.pagination.update();
    }
  },
);
</script>

<style src="./styles/navigation.min.css"></style>
<style src="./styles/pagination.min.css"></style>
<style src="./styles/swiper.min.css"></style>