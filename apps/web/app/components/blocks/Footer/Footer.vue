<template>
  <footer
    class="w-full py-10 transition-colors duration-300"
    :style="{ backgroundColor: footerData.backgroundColor || '#333333', color: footerData.textColor || '#ffffff' }"
    data-testid="footer"
  >
    <div class="max-w-screen-3xl mx-auto px-4 md:px-8">
      
      <div 
        class="grid grid-cols-1 md:grid-cols-3 gap-8"
        :class="{'lg:grid-cols-4': footerData.columns?.length > 3}" 
      >
        <div 
          v-for="col in footerData.columns" 
          :key="col.id" 
          class="flex flex-col gap-4"
        >
          <div v-if="col.image">
            <NuxtImg
              :src="col.image"
              :alt="col.title || 'Footer Image'"
              :style="{ width: col.imageWidth || 'auto', maxWidth: '100%' }"
              class="object-contain"
              loading="lazy"
            />
          </div>

          <h3 v-if="col.title" class="text-lg font-bold uppercase tracking-wide">
            {{ col.title }}
          </h3>

          <ul v-if="col.links && col.links.length > 0" class="flex flex-col gap-2">
            <li v-for="(link, i) in col.links" :key="i">
              <NuxtLink 
                :to="localePath(link.url)" 
                class="hover:underline opacity-90 hover:opacity-100 flex items-center gap-2"
              >
                <span v-if="i > -1" class="text-xs opacity-50">▶</span>
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>

          <div v-if="col.socials && col.socials.length > 0" class="flex gap-4 mt-2 flex-wrap">
            <a 
              v-for="(social, s) in col.socials" 
              :key="s" 
              :href="social.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="hover:opacity-80 transition-opacity p-1 bg-white/10 rounded"
              :aria-label="social.icon"
            >
              <SfIconFacebook v-if="social.icon === 'facebook'" class="w-6 h-6" />
              <SfIconInstagram v-else-if="social.icon === 'instagram'" class="w-6 h-6" />
              <SfIconTwitter v-else-if="social.icon === 'twitter'" class="w-6 h-6" />
              <SfIconYoutube v-else-if="social.icon === 'youtube'" class="w-6 h-6" />
              <SfIconPinterest v-else-if="social.icon === 'pinterest'" class="w-6 h-6" />
              <span v-else class="capitalize text-xs">{{ social.icon }}</span>
            </a>
          </div>

          <div 
            v-if="col.content" 
            class="text-sm opacity-90"
            v-html="col.content"
          />
        </div>
      </div>

      <div 
        v-if="footerData.footnote" 
        class="mt-12 pt-6 border-t border-white/20 text-center text-sm opacity-60"
        v-html="footerData.footnote"
      />
    </div>
  </footer>
</template>

<script setup lang="ts">
import { 
  SfIconFacebook, 
  SfIconInstagram, 
  SfIconTwitter, 
  SfIconYoutube, 
  SfIconPinterest 
} from '@storefront-ui/vue';
import type { FooterProps, FooterContent } from './types';

const props = defineProps<FooterProps>();
const localePath = useLocalePath();

// Safely computed data with defaults
const footerData = computed((): FooterContent => {
  const content = (props.content as unknown) as FooterContent;
  return content || { columns: [] };
});
</script>