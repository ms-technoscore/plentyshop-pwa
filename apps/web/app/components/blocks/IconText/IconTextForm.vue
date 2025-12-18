<template>
  <div class="p-4">
    <h2 class="font-bold mb-4 text-lg">Icon & Text Settings</h2>

    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Icon Image</label>
      
      <UiImagePicker
        :image="blockData.icon?.url || ''"
        label="Upload Icon"
        placeholder="Select an icon"
        dimensions="200x200"
        @add="handleIconAdd"
        @delete="handleIconDelete"
      />
      
      <div class="mt-2">
         <label class="text-xs text-gray-500">Icon Width</label>
         <SfInput v-model="blockData.layout.iconWidth" type="text" placeholder="w-16" />
         <span class="text-[10px] text-gray-400">Use Tailwind classes (w-12, w-16, w-20)</span>
      </div>
    </div>

    <hr class="my-4 border-gray-200" />

    <div class="mb-6">
      <label class="block text-sm font-medium mb-2">Text Content</label>
      <SfTextarea
        v-model="blockData.text.content"
        class="w-full min-h-[100px]"
        placeholder="Enter text here..."
      />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium mb-1">Font Size</label>
      <SfInput v-model="blockData.text.fontSize" type="text" placeholder="text-base" />
      <span class="text-[10px] text-gray-400">Examples: text-sm, text-base, text-lg, text-xl</span>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
            <label class="block text-sm font-medium mb-1">Text Color</label>
            <SfInput v-model="blockData.text.color" type="color" />
        </div>
        <div>
            <label class="block text-sm font-medium mb-1">Gap Size</label>
            <SfInput v-model="blockData.layout.gap" type="text" placeholder="gap-4" />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* eslint-disable */
import { SfInput, SfTextarea } from '@storefront-ui/vue';
import type { IconTextProps } from './types';

// Use standard composables
const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

// FIX: Define a "Safe" type where properties are required for v-model binding
type SafeIconTextProps = {
  icon: { url: string; alt?: string };
  text: { content: string; color: string; fontSize: string };
  layout: { gap: string; iconWidth: string };
};

// Computed property that safely casts the block to 'SafeIconTextProps'
// This prevents "Object is possibly undefined" errors in the template
const blockData = computed(() => {
  const rawBlock = findOrDeleteBlockByUuid(data.value, blockUuid.value);
  const b = (rawBlock || {}) as any;
  
  // Initialize defaults if properties are missing
  if (!b.icon) b.icon = { url: '', alt: '' };
  if (!b.text) b.text = { content: 'Reliable dealer and supplier...', color: '#ffffff', fontSize: 'text-base' };
  if (!b.layout) b.layout = { gap: 'gap-4', iconWidth: 'w-16' };
  
  return b as SafeIconTextProps;
});

// Image Handler Helpers
// The picker returns an object { image: "url..." } or sometimes just the string
const handleIconAdd = (payload: any) => {
  if (blockData.value.icon) {
    const url = typeof payload === 'string' ? payload : payload?.image;
    blockData.value.icon.url = url || ''; 
  }
};

const handleIconDelete = () => {
  if (blockData.value.icon) {
    blockData.value.icon.url = '';
  }
};
</script>