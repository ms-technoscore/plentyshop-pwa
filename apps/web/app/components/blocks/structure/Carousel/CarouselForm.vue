<template>
  <div data-testid="banner-carousel-form" class="block-slider-edit sticky top-[52px] h-[80vh] overflow-y-auto">
    <div class="mb-6">
      <div class="flex item-center justify-between mb-4 p-4 pr-2">
        <h2>{{ getEditorTranslation('slides-group-label') }}</h2>
        <div class="flex item-center">
          <button
            data-testid="quick-add-slide-button"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
            @click="addSlide"
          >
            <SfIconAdd class="text-neutral-500" />
          </button>
          <div class="relative">
            <button
              v-if="slides.length >= 2"
              data-testid="open-slide-actions"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              @click="open"
            >
              <SfIconMoreHoriz class="text-neutral-500" />
            </button>

            <div
              v-if="isOpen && slides.length >= 2"
              class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50"
            >
              <div class="flex justify-end p-2">
                <SfIconClose class="cursor-pointer" @click="close" />
              </div>
              <hr />
              <div class="p-2">
                <draggable
                  v-if="slides.length"
                  v-model="slides"
                  item-key="meta.uuid"
                  handle=".drag-slides-handle"
                  class="p-2 rounded"
                  :filter="'.no-drag'"
                >
                  <template #item="{ element: slide, index }">
                    <div
                      :key="slide.meta.uuid"
                      class="flex items-center justify-between drag-slides-handle cursor-move"
                    >
                      <div class="flex items-center">
                        <button
                          class="drag-slides-handle top-2 left-2 z-50 cursor-grab p-2 hover:bg-gray-100 rounded-full"
                          :aria-label="getEditorTranslation('drag-reorder-aria')"
                          :data-testid="`actions-drag-slide-handle-${index}`"
                        >
                          <NuxtImg width="18" height="18" :src="dragIcon" />
                        </button>
                        <span>{{ getEditorTranslation('slide-label') }} {{ index + 1 }}</span>
                      </div>

                      <button
                        :data-testid="`actions-delete-slide-${index}`"
                        class="text-red-500 hover:text-red-700"
                        :disabled="slides.length === 1"
                        @click="deleteSlide(index)"
                      >
                        <SfIconDelete class="text-neutral-500" />
                      </button>
                    </div>
                  </template>
                </draggable>
                <hr />
                <div class="pl-2 pr-2 pt-2 flex justify-between items-center">
                  <p>{{ getEditorTranslation('add-slide-label') }}</p>
                  <button
                    data-testid="actions-add-slide-button"
                    class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0"
                    @click="addSlide"
                  >
                    <SfIconAdd class="text-neutral-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SfScrollable
        :key="slides.length"
        class="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <template #previousButton="defaultProps">
          <button
            v-bind="defaultProps"
            class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SfIconChevronLeft class="text-neutral-500" />
          </button>
        </template>
        <template #nextButton="defaultProps">
          <button
            v-bind="defaultProps"
            class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SfIconChevronRight class="text-neutral-500" />
          </button>
        </template>
        <div class="flex items-center gap-2 flex-nowrap">
          <button
            v-for="(slide, index) in slides"
            :key="slide.meta.uuid"
            :data-testid="`slide-settings-${index}`"
            class="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 shrink-0"
            :class="activeSlide === index ? 'bg-editor-button text-white' : ''"
            @click="slideClick(index)"
          >
            {{ getEditorTranslation('slide-label') }} {{ index + 1 }}
          </button>
        </div>
      </SfScrollable>
    </div>

    <div v-if="activeSlide !== undefined && slides[activeSlide]" :data-testid="`slide-settings-${activeSlide}`">
      <BlocksBannerCarouselBannerForm :uuid="slides[activeSlide]!.meta.uuid" />
      
      <UiAccordionItem
        v-model="controlsOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>{{ getEditorTranslation('controls-group-label') }}</h2>
        </template>
        <div class="controls">
          <div class="mb-6 mt-4">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('controls-color-label') }}</UiFormLabel>
            <SfInput v-model="controls.color" type="text">
              <template #suffix>
                <label
                  for="controls-color"
                  :style="{ backgroundColor: controls.color }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="controls-color" v-model="controls.color" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="overlayOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>{{ getEditorTranslation('overlay-group-label') }}</h2>
        </template>
        <div class="controls p-2">
          
          <div class="mb-4">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('overlay-badge-label') }}</UiFormLabel>
            <SfInput v-model="overlay.badgeText" type="text" placeholder="Finden" />
          </div>

          <div class="mb-4">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('overlay-desc-label') }}</UiFormLabel>
            <SfInput v-model="overlay.description" type="text" placeholder="Description text..." />
          </div>

          <div class="mb-4">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('overlay-bgcolor-label') }}</UiFormLabel>
            <SfInput v-model="overlay.bgColor" type="text">
              <template #suffix>
                <label
                  for="overlay-bg-color"
                  :style="{ backgroundColor: overlay.bgColor }"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer"
                >
                  <input id="overlay-bg-color" v-model="overlay.bgColor" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>

          <div class="mb-4">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('overlay-placeholder-label') }}</UiFormLabel>
            <SfInput v-model="overlay.placeholder" type="text" placeholder="Suchbegriff..." />
          </div>

          <div class="mb-4">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('overlay-btn-label') }}</UiFormLabel>
            <SfInput v-model="overlay.searchBtnText" type="text" placeholder="und los!" />
          </div>

          <hr class="my-4" />

          <div class="mb-4">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('overlay-btm-btn-label') }}</UiFormLabel>
            <SfInput v-model="overlay.bottomBtnText" type="text" placeholder="LAGERTECHNIK >" />
          </div>

          <div class="mb-4">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('overlay-btm-link-label') }}</UiFormLabel>
            <SfInput v-model="overlay.bottomBtnLink" type="text" placeholder="/lagertechnik" />
          </div>
          
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="layoutOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2 data-testid="slider-button-group-title">{{ getEditorTranslation('layout-label') }}</h2>
        </template>
        <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SfScrollable,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfIconDelete,
  SfInput,
  SfIconMoreHoriz,
  SfIconAdd,
  useDisclosure,
  SfIconClose,
  SfIconExpandMore,
  SfIconExpandLess,
} from '@storefront-ui/vue';
import type { CarouselStructureProps } from './types';
import { v4 as uuid } from 'uuid';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import draggable from 'vuedraggable/src/vuedraggable';
import dragIcon from '~/assets/icons/paths/drag.svg';

const { isOpen, open, close } = useDisclosure();
const { blockUuid } = useSiteConfiguration();
const { updateBannerItems, setIndex, activeSlideIndex } = useCarousel();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();
setIndex(blockUuid.value, 0);

const layoutOpen = ref(true);
const controlsOpen = ref(true);
const overlayOpen = ref(true); // Default open for new section

const activeSlide = computed(() => activeSlideIndex.value[blockUuid.value]);
const carouselStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as CarouselStructureProps,
);
const { isFullWidth } = useFullWidthToggleForConfig(
  computed(() => carouselStructure.value.configuration),
  { fullWidth: true },
);
const controls = computed(() => carouselStructure.value.configuration.controls);

// New Overlay Config Computed Property
// This ensures the object exists so we can bind v-models to it
const overlay = computed(() => {
  if (!carouselStructure.value.configuration.overlay) {
    // Initialize if missing
    carouselStructure.value.configuration.overlay = {
        badgeText: 'Finden',
        description: 'was Du suchst! Einfach Typnummer,<br />Modell, oder Hersteller eingeben',
        placeholder: 'Suchbegriff...',
        searchBtnText: 'und los!',
        bgColor: '#eadd87',
        showBottomBtn: true,
        bottomBtnText: 'LAGERTECHNIK >',
        bottomBtnLink: '/lagertechnik'
    };
  }
  return carouselStructure.value.configuration.overlay;
});


const slides = computed({
  get: () => {
    return (carouselStructure.value?.content || []) as BannerProps[];
  },
  set: (value: BannerProps[]) => updateBannerItems(value, blockUuid.value),
});


const slideClick = (index: number) => {
  setIndex(blockUuid.value, index);
};

const addSlide = async () => {
  const newSlide: BannerProps = {
    name: 'Banner',
    type: 'content',
    content: {
      image: {
        wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
        brightness: 0.5,
        alt: '',
      },
      text: {
        pretitle: 'PreTitle',
        title: 'Title',
        subtitle: 'SubTitle',
        htmlDescription: 'Text that supports HTML formatting',
        color: '#000',
        bgcolor: '#fff',
        bgopacity: 1,
        textAlignment: 'left',
        justify: 'center',
        align: 'left',
        background: false,
      },
      button: {
        label: 'Button',
        link: '/',
        variant: 'primary',
      },
    },
    meta: {
      uuid: uuid(),
    },
    lazyLoading: 'eager',
    index: slides.value.length,
  };

  slides.value = [...slides.value, newSlide] as BannerProps[];

  await nextTick();

  setIndex(blockUuid.value, slides.value.length - 1);
  close();
};

const deleteSlide = async (index: number) => {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((_: BannerProps, i: number) => i !== index);
  setIndex(blockUuid.value, 0);
  await nextTick();
  close();
};

// ... (Rest of your drag/drop functions remain the same, I omitted them for brevity but keep them in your file) ...
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>

<i18n lang="json">
{
  "en": {
    "slides-group-label": "Slides",
    "slide-label": "Slide",
    "add-slide-label": "Add Slide",
    "drag-reorder-aria": "Drag to reorder slide",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "overlay-group-label": "Search Overlay",
    "overlay-badge-label": "Badge Text (e.g. Finden)",
    "overlay-desc-label": "Description HTML",
    "overlay-bgcolor-label": "Overlay Background",
    "overlay-placeholder-label": "Search Placeholder",
    "overlay-btn-label": "Search Button Text",
    "overlay-btm-btn-label": "Bottom Button Text",
    "overlay-btm-link-label": "Bottom Button Link"
  },
  "de": {
    "slides-group-label": "Slides",
    "slide-label": "Slide",
    "add-slide-label": "Add Slide",
    "drag-reorder-aria": "Drag to reorder slide",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "overlay-group-label": "Suchfeld Overlay",
    "overlay-badge-label": "Badge Text (z.B. Finden)",
    "overlay-desc-label": "Beschreibung HTML",
    "overlay-bgcolor-label": "Hintergrundfarbe",
    "overlay-placeholder-label": "Suchfeld Platzhalter",
    "overlay-btn-label": "Suchbutton Text",
    "overlay-btm-btn-label": "Unterer Button Text",
    "overlay-btm-link-label": "Unterer Button Link"
  }
}
</i18n>