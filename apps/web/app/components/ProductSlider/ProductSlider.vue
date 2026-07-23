<template>
  <SfScrollable
    buttons-placement="floating"
    class="pb-4 scrollbar-hidden"
    :wrapper-class="wrapperClass"
    data-testid="product-slider"
  >
    <UiProductCard
      v-for="product in items"
      :key="productGetters.getId(product)"
      :product="product"
      is-from-slider
      class="max-w-48 shrink-0 flex-none"
    />
  </SfScrollable>
  <div class="mt-4 typography-text-xs flex gap-1">
    <span>{{ t('common.labels.asterisk') }}</span>
    <span>{{ vatFootnoteLabel }}</span>
    <i18n-t keypath="shipping.excludedLabel" scope="global">
      <template #shipping>
        <SfLink
          :href="localePath(paths.shipping)"
          target="_blank"
          class="focus:outline focus:outline-offset-2 focus:outline-2 outline-secondary-600 rounded"
        >
          {{ t('common.labels.delivery') }}
        </SfLink>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
import { productGetters } from '@plentymarkets/shop-api';
import { SfScrollable, SfLink } from '@storefront-ui/vue';
import type { ProductSliderProps } from '~/components/ProductSlider/types';
import { hasProductGrossUnitPrice } from '~/utils/product/getProductNetPrice';
import { paths } from '~/utils/paths';

const { showNetPrices } = useCart();
const localePath = useLocalePath();
const { t } = useI18n();

const props = defineProps<ProductSliderProps>();

const vatFootnoteLabel = computed(() => {
  const listingShowsGross = (props.items ?? []).some((product) => hasProductGrossUnitPrice(product));
  if (listingShowsGross || !showNetPrices.value) {
    return t('product.priceInclVAT');
  }

  return t('product.priceExclVAT');
});
</script>
