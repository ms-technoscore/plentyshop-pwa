<template>
  <div>
    <UiAccordionItem
      v-model="isOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Promo Card Settings</h2>
      </template>

      <div class="py-4">
        <UiImagePicker
          label="Background Image"
          :image="promoCardContent.image"
          placeholder="https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png"
          dimensions="Recommended: 800x600px"
          @add="(payload) => promoCardContent.image = payload.image"
          @delete="promoCardContent.image = ''"
        />
      </div>

      <div class="py-2">
        <UiFormLabel>Card Title</UiFormLabel>
        <SfInput v-model="promoCardContent.title" type="text" />
      </div>

      <div class="py-2">
        <UiFormLabel>Link URL</UiFormLabel>
        <SfInput v-model="promoCardContent.link" type="text" placeholder="/category/..." />
      </div>

      <div class="py-2">
        <UiFormLabel>Card Height</UiFormLabel>
        <SfInput v-model="promoCardContent.height" type="text" placeholder="e.g. 400px" />
        <span class="text-xs text-gray-500">e.g. 400px, 500px, etc.</span>
      </div>

      <div class="py-2">
        <UiFormLabel>Image Alt Text</UiFormLabel>
        <SfInput v-model="promoCardContent.alt" type="text" />
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import type { PromoCardContent } from './types';

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const isOpen = ref(true);

// Bind to the block content
const promoCardContent = computed(() => {
  const block = findOrDeleteBlockByUuid(data.value, blockUuid.value);
  
  if (!block) {
    return {
      title: '',
      link: '',
      image: '',
      alt: '',
      height: '400px'
    } as PromoCardContent;
  }

  if (!block.content) {
    block.content = {
      title: 'New Offer',
      link: '/',
      image: '',
      alt: '',
      height: '400px'
    };
  }
  return block.content as PromoCardContent;
});
</script>