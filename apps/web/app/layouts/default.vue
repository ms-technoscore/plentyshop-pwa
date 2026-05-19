<template>
  <div>
    <UiHeader />
    <NarrowContainer v-if="breadcrumbs?.length" class="p-4 md:px-0">
      <LazyUiBreadcrumbs :breadcrumbs="breadcrumbs" />
    </NarrowContainer>
    <main>
      <slot />
    </main>
    <UiNavbarBottom v-if="viewport.isLessThan('lg')" />
    <Cookiebar />
    <PreviewMode />
    
    <ClientOnly>
      <FooterBlock v-if="!route.meta.isBlockified" :content="globalFooterData" />
    </ClientOnly>
    
    <QuickCheckout v-if="isOpen" :product="product" />

    <StickyContact />
    
  </div>
</template>

<script setup lang="ts">
import type { DefaultLayoutProps } from '~/layouts/types';
// Import your exact CMS footer component
import FooterBlock from '../components/blocks/Footer/Footer.vue';
import { getFooterContent } from '~/configuration/footerContent';

defineProps<DefaultLayoutProps>();

const { setLogoMeta } = useStructuredData();
const { isOpen, product } = useQuickCheckout();
const viewport = useViewport();
const route = useRoute();
const { locale } = useI18n();

setLogoMeta();

const globalFooterData = computed(() => getFooterContent(locale.value));
</script>