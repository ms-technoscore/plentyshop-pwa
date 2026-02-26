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

          <div v-if="col.socials && col.socials.length > 0" class="flex gap-4 mt-4 flex-wrap">
            <a 
              v-for="(social, s) in col.socials" 
              :key="s" 
              :href="social.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="transition-all duration-300 hover:scale-110 hover:-translate-y-1 drop-shadow-sm hover:drop-shadow-md"
              :aria-label="social.icon"
            >
              <svg v-if="social.icon === 'facebook'" class="w-8 h-8" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>

              <svg v-else-if="social.icon === 'instagram'" class="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ig_gradient" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#f09433"/>
                    <stop offset="0.25" stop-color="#e6683c"/>
                    <stop offset="0.5" stop-color="#dc2743"/>
                    <stop offset="0.75" stop-color="#cc2366"/>
                    <stop offset="1" stop-color="#bc1888"/>
                  </linearGradient>
                </defs>
                <rect width="24" height="24" rx="5" fill="url(#ig_gradient)"/>
                <path fill="white" d="M12 6.865c1.674 0 1.874.006 2.535.037 2.05.093 3.12 1.183 3.213 3.214.031.661.037.861.037 2.534s-.006 1.874-.037 2.535c-.093 2.03-1.163 3.12-3.213 3.213-.661.031-.861.037-2.535.037s-1.874-.006-2.535-.037c-2.05-.093-3.12-1.183-3.213-3.213-.031-.661-.037-.861-.037-2.535s.006-1.874.037-2.535c.093-2.03 1.163-3.12 3.213-3.214.661-.031.861-.037 2.535-.037zm0-1.46c-1.704 0-1.916.007-2.585.038-2.65.12-4.135 1.62-4.255 4.254-.031.67-.038.882-.038 2.586s.007 1.916.038 2.585c.12 2.635 1.605 4.135 4.255 4.255.669.031.881.038 2.585.038s1.916-.007 2.585-.038c2.65-.12 4.135-1.62 4.255-4.255.031-.669.038-.881.038-2.585s-.007-1.916-.038-2.585c-.12-2.634-1.605-4.134-4.255-4.254-.669-.031-.881-.038-2.585-.038zM12 8.74a3.26 3.26 0 1 0 0 6.52 3.26 3.26 0 0 0 0-6.52zm0 5.06a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zm3.43-5.22a.97.97 0 1 1-1.94 0 .97.97 0 0 1 1.94 0z"/>
              </svg>

              <svg v-else-if="social.icon === 'twitter'" class="w-8 h-8" viewBox="0 0 24 24" fill="#1DA1F2">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>

              <svg v-else-if="social.icon === 'youtube'" class="w-8 h-8" viewBox="0 0 24 24" fill="#FF0000">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>

              <svg v-else-if="social.icon === 'pinterest'" class="w-8 h-8" viewBox="0 0 24 24" fill="#E60023">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.182 0 7.428 2.979 7.428 6.945 0 4.152-2.617 7.494-6.257 7.494-1.22 0-2.368-.634-2.763-1.383l-.752 2.865c-.272 1.038-.979 2.339-1.465 3.136 1.159.356 2.391.547 3.655.547 6.621 0 11.988-5.368 11.988-11.988C24.006 5.367 18.638 0 12.017 0z"/>
              </svg>

              <svg v-else-if="social.icon === 'linkedin'" class="w-8 h-8" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>

              <span v-else class="capitalize text-xs p-2 bg-white/10 rounded">{{ social.icon }}</span>
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
// import { 
//   SfIconFacebook, 
//   SfIconInstagram, 
//   SfIconTwitter, 
//   SfIconYoutube, 
//   SfIconPinterest 
// } from '@storefront-ui/vue';
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