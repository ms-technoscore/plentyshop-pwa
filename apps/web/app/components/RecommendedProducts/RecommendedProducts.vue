<template>
  <ProductSlider v-if="recommendedProducts?.length" :items="recommendedProducts" />
</template>

<script setup lang="ts">
import type { RecommendedProductsProps } from './types';

const props = withDefaults(defineProps<RecommendedProductsProps>(), { cacheKey: '' });
const { locale } = useI18n();
const { data: recommendedProducts, fetchProductRecommended } = useProductRecommended(props.categoryId + props.cacheKey);

const loadRecommended = () => {
  if (props.categoryId) {
    fetchProductRecommended({ type: 'category', categoryId: String(props.categoryId) });
  }
};

loadRecommended();

watch(locale, loadRecommended);
</script>
