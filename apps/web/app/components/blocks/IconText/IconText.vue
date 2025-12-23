<template>
  <div class="flex items-center" :class="content.layout?.gap || 'gap-4'">
    
    <div 
      class="shrink-0 relative"
      :class="content.layout?.iconWidth || 'w-16'"
    >
      <NuxtImg
        v-if="content.icon?.url && typeof content.icon.url === 'string'" 
  :src="content.icon.url"
        :alt="content.icon.alt || ''"
        class="w-full h-auto object-contain"
        loading="lazy"
      />
      <div 
        v-else 
        class="w-full aspect-square bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-400"
      >
        Icon
      </div>
    </div>

    <div 
      class="flex-1"
      :style="{ color: content.text?.color || '#ffffff' }"
    >
      <div 
        class="leading-tight"
        :class="content.text?.fontSize || 'text-base'"
        v-html="content.text?.content || 'Your text here...'"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import type { IconTextProps } from './types';
import type { Block } from '@plentymarkets/shop-api';

defineProps<{
  content: IconTextProps;
  block?: Block; 
}>();
</script>