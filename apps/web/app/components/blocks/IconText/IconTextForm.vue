<template>
  <div v-if="block && block.content" class="p-4">
    <h2 class="font-bold mb-4 text-lg">Icon & Text Settings</h2>

    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Icon Image</label>
      
      <UiImagePicker
        :image="block.content.icon?.url || ''"
        label="Upload Icon"
        placeholder="Select an icon..."
        dimensions="64x64"
        @add="handleIconAdd"
        @delete="handleIconDelete"
      />
      
      <div class="mt-2">
         <label class="text-xs text-gray-500">Icon Width</label>
         <SfInput v-model="block.content.layout.iconWidth" type="text" placeholder="w-16" />
         <span class="text-[10px] text-gray-400">Use Tailwind classes (w-12, w-16, w-20)</span>
      </div>
    </div>

    <hr class="my-4 border-gray-200" />

    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Text Content</label>
      <SfTextarea
        v-model="block.content.text.content"
        class="w-full min-h-[100px]"
        placeholder="Enter text here..."
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Font Size</label>
      <SfInput v-model="block.content.text.fontSize" type="text" placeholder="text-base" />
      <span class="text-[10px] text-gray-400">Examples: text-sm, text-base, text-lg, text-xl</span>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
            <label class="block text-sm font-medium mb-1">Text Color</label>
            <SfInput v-model="block.content.text.color" type="color" />
        </div>
        <div>
            <label class="block text-sm font-medium mb-1">Gap Size</label>
            <SfInput v-model="block.content.layout.gap" type="text" placeholder="gap-4" />
        </div>
    </div>
  </div>

  <div v-else class="p-4 text-red-600 bg-red-50">
    <p class="font-bold">Error: Loading Block...</p>
    <p class="text-xs">If this persists, delete the block and add it again.</p>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable */
import { SfInput, SfTextarea } from '@storefront-ui/vue';
import type { IconTextProps } from './types';

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const block = computed(() => {
  if (!data.value || !blockUuid.value) return null;
  
  const foundBlock = findOrDeleteBlockByUuid(data.value, blockUuid.value);
  
  if (!foundBlock) return null;

  const b = foundBlock as any;

  // IMPORTANT: We must initialize the 'content' object structure
  // This ensures v-model has a valid path to write to
  if (!b.content) b.content = {};
  if (!b.content.icon) b.content.icon = { url: '', alt: '' };
  if (!b.content.text) b.content.text = { content: 'Default Text', color: '#000000', fontSize: 'text-base' };
  if (!b.content.layout) b.content.layout = { gap: 'gap-4', iconWidth: 'w-16' };

  return b; 
});

const handleIconAdd = (payload: any) => {
  if (block.value && block.value.content) {
    const url = typeof payload === 'string' ? payload : payload?.image;
    block.value.content.icon.url = url || '';
  }
};

const handleIconDelete = () => {
  if (block.value && block.value.content) {
    block.value.content.icon.url = '';
  }
};
</script>