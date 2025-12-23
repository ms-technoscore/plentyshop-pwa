<template>
  <div>
    <UiAccordionItem
      v-model="settingsOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Settings</h2>
      </template>
      
      <div v-if="sliderContent" class="py-2">
        <UiFormLabel>Section Title</UiFormLabel>
        <SfInput v-model="sliderContent.title" type="text" placeholder="e.g. Our Partners" />
      </div>

      <div v-if="sliderContent" class="py-2">
        <UiFormLabel>Logos per row (Desktop)</UiFormLabel>
        <SfInput v-model.number="sliderContent.itemsPerPageDesktop" type="number" min="1" max="10" />
      </div>
      <div v-if="sliderContent" class="py-2">
        <UiFormLabel>Logos per row (Tablet)</UiFormLabel>
        <SfInput v-model.number="sliderContent.itemsPerPageTablet" type="number" min="1" max="6" />
      </div>
      <div v-if="sliderContent" class="py-2">
        <UiFormLabel>Logos per row (Mobile)</UiFormLabel>
        <SfInput v-model.number="sliderContent.itemsPerPageMobile" type="number" min="1" max="3" />
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="logosOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Logos ({{ sliderContent?.items?.length || 0 }})</h2>
      </template>

      <div class="flex flex-col gap-4 py-4" v-if="sliderContent">
        <SfButton variant="secondary" class="w-full border-dashed border-2" @click="addLogo">
          + Add Logo
        </SfButton>

        <div 
          v-for="(item, index) in sliderContent.items" 
          :key="index" 
          class="border rounded-md p-3 bg-neutral-50 relative"
        >
          <div class="absolute top-2 right-2">
            <SfButton 
              variant="tertiary" 
              size="sm" 
              class="!p-1 text-red-600 hover:bg-red-50" 
              @click="removeLogo(index)"
            >
              <SfIconDelete />
            </SfButton>
          </div>

          <div class="pr-8">
            <UiImagePicker
              label="Logo Image"
              :image="item.image"
              placeholder="https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png"
              dimensions="Recommended: 200x100px"
              @add="(payload) => item.image = payload.image"
              @delete="item.image = ''"
            />
            
            <div class="mt-2">
              <label class="text-xs font-medium text-gray-500">Link URL</label>
              <SfInput v-model="item.link" size="sm" placeholder="/" />
            </div>
            <div class="mt-2">
              <label class="text-xs font-medium text-gray-500">Alt Text</label>
              <SfInput v-model="item.alt" size="sm" placeholder="Brand Name" />
            </div>
          </div>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfButton, SfIconDelete } from '@storefront-ui/vue';
import type { LogoSliderContent, LogoItem } from './types';

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const settingsOpen = ref(true);
const logosOpen = ref(true);

const sliderContent = computed(() => {
  const block = findOrDeleteBlockByUuid(data.value, blockUuid.value);
  
  if (!block) {
    return {
      title: '',
      itemsPerPageDesktop: 5,
      itemsPerPageTablet: 3,
      itemsPerPageMobile: 2,
      items: []
    } as LogoSliderContent;
  }

  if (!block.content) {
    block.content = {
      title: '',
      itemsPerPageDesktop: 5,
      itemsPerPageTablet: 3,
      itemsPerPageMobile: 2,
      items: []
    };
  }
  
  return block.content as LogoSliderContent;
});

const addLogo = () => {
  if (!sliderContent.value.items) sliderContent.value.items = [];
  
  const newItem: LogoItem = {
    image: '',
    link: '',
    alt: ''
  };
  
  sliderContent.value.items.push(newItem);
};

const removeLogo = (index: number) => {
  if (sliderContent.value.items) {
    sliderContent.value.items.splice(index, 1);
  }
};
</script>