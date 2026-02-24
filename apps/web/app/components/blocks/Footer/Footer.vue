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

          <ul v-if="col.title !== 'Im Shop' && col.links && col.links.length > 0" class="flex flex-col gap-2">
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

          <div v-else-if="col.title === 'Im Shop'" class="flex flex-col gap-3">
            <div v-for="node in footerCategories" :key="node.id" class="w-full">
              
              <details 
                v-if="node.childCount > 0" 
                class="group"
                @mouseenter="openAccordion"
                @mouseleave="closeAccordion"
              >
                <summary class="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <NuxtLink :to="localePath(generateCategoryLink(node))" class="hover:underline opacity-90 hover:opacity-100 flex items-center gap-2">
                    <span class="text-xs opacity-50">▶</span> {{ categoryTreeGetters.getName(node) }}
                  </NuxtLink>
                  <span class="transition-transform duration-300 group-open:rotate-180 opacity-50">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                
                <ul class="pl-4 mt-2 flex flex-col gap-2 border-l border-white/20 ml-[7px]">
                  <li v-for="child in node.children" :key="child.id">
                    <NuxtLink :to="localePath(generateCategoryLink(child))" class="hover:underline opacity-60 hover:opacity-100 text-sm block py-0.5">
                      {{ categoryTreeGetters.getName(child) }}
                    </NuxtLink>
                  </li>
                </ul>
              </details>

              <NuxtLink v-else :to="localePath(generateCategoryLink(node))" class="hover:underline opacity-90 hover:opacity-100 flex items-center gap-2">
                <span class="text-xs opacity-50">▶</span> {{ categoryTreeGetters.getName(node) }}
              </NuxtLink>

            </div>
          </div>

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
import { categoryTreeGetters } from '@plentymarkets/shop-api';
import type { FooterProps, FooterContent } from './types';

const props = defineProps<FooterProps>();
const localePath = useLocalePath();
const { buildCategoryMenuLink } = useLocalization();

// --- LOAD DYNAMIC CATEGORIES ---
const { data: categoryTree } = useCategoryTree();

// 🚨 IMPORTANT: Replace these IDs with the exact same ones from your header.vue!
// I've added the IDs you had earlier, plus made room for your new 'Autom' category.
const allowedCategoryIds = [895, 490, 1505, 208, 81, 217, 97 ]; 

// Alphabetical sorting
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortTreeAlphabetically = (nodes: any[], isRoot: boolean = false): any[] => {
  if (!nodes || nodes.length === 0) return [];
  const processedNodes = [...nodes];
  if (!isRoot) {
    processedNodes.sort((a, b) => {
      const nameA = categoryTreeGetters.getName(a) || '';
      const nameB = categoryTreeGetters.getName(b) || '';
      return nameA.localeCompare(nameB, 'de');
    });
  }
  return processedNodes.map((node) => ({
    ...node,
    children: sortTreeAlphabetically(node.children || [], false)
  }));
};

// Calculate and process categories
const footerCategories = computed(() => {
  if (!categoryTree.value) return [];
  
  // 1. Filter out the junk/hidden categories to perfectly match your header
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredTree = categoryTree.value.filter((category: any) => {
    return allowedCategoryIds.includes(category.id);
  });

  // 2. Apply alphabetical sorting to the clean list
  const sortedTree = sortTreeAlphabetically(filteredTree, true);
  
  return sortedTree;
});

// URL Helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateCategoryLink = (category: any) => {
  return buildCategoryMenuLink(category, categoryTree.value);
};
// ---------------------------------

const footerData = computed((): FooterContent => {
  const content = (props.content as unknown) as FooterContent;
  return content || { columns: [] };
});

// Helper functions to handle accordion hover states safely for TypeScript
const openAccordion = (event: Event) => {
  const target = event.currentTarget as HTMLDetailsElement | null;
  if (target) target.open = true;
};

const closeAccordion = (event: Event) => {
  const target = event.currentTarget as HTMLDetailsElement | null;
  if (target) target.open = false;
};
</script>