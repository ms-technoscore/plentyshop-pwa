<template>
  <div class="mb-3">
    <Price :price="priceWithProperties" :crossed-price="crossedPrice" />
    
    <div 
      v-if="priceWithProperties >= 500"
      class="leasingo-rate-indicator mt-2"
      :data-object-price-netto="netPrice" 
      data-finance-product="1"
      data-maturity="36"
    />

    <div 
    v-if="parseFloat(netPrice) > 0"
      class="leasingo-calculator mt-4"
      data-ref="productCalculator" 
      :data-object-price-netto="netPrice"
      data-maturity="48"
      data-finance-product="1"
      data-object-condition="1"
    />

    <div v-if="(productBundleGetters?.getBundleDiscount(product) ?? 0) > 0" class="m-auto">
      <UiTag :size="'sm'" :variant="'secondary'">{{
        t('product.bundleSavings', { percent: productBundleGetters.getBundleDiscount(product) })
      }}</UiTag>
    </div>
  </div>
  <LowestPrice :product="product" />
  <BasePrice
    v-if="productGetters.showPricePerUnit(product)"
    :base-price="basePriceSingleValue"
    :unit-content="productGetters.getUnitContent(product)"
    :unit-name="productGetters.getUnitName(product)"
  />
</template>

<script setup lang="ts">
import { productBundleGetters, productGetters, cartGetters } from '@plentymarkets/shop-api';
import { computed, ref, onMounted, watch } from 'vue'; // Import Vue functions
import type { ProductPriceProps } from '~/components/ProductPrice/types';

const props = defineProps<ProductPriceProps>();

const { getPropertiesPrice } = useProductOrderProperties();
const { crossedPrice } = useProductPrice(props.product);
const { lastUpdatedCartItem } = useCart();

const priceWithProperties = computed(
  () =>
    (productGetters.getSpecialOffer(props.product) ||
      productGetters.getGraduatedPriceByQuantity(props.product, cartGetters.getItemQty(lastUpdatedCartItem.value))
        ?.unitPrice.value ||
      productGetters.getPrice(props.product) ||
      0) + getPropertiesPrice(props.product),
);

const basePriceSingleValue = computed(
  () =>
    productGetters.getGraduatedPriceByQuantity(props.product, cartGetters.getItemQty(lastUpdatedCartItem.value))
      ?.basePrice ?? productGetters.getDefaultBasePrice(props.product),
);

// --- LEASINGO INTEGRATION START ---

// 1. Calculate Net Price
const netPrice = computed(() => {
  const grossPrice = priceWithProperties.value;
  const vatRate = props.product?.prices?.default?.vat?.value || 19;
  const result = (grossPrice / (1 + vatRate / 100)).toFixed(2);
  
  // eslint-disable-next-line no-console
  console.log('[LeasinGo] Computed Net Price:', result);
  
  return result;
});

// 2. Connector Logic
const calculatorInstance = ref(null); 

onMounted(() => {
  // eslint-disable-next-line no-console
  console.log('[LeasinGo] Component Mounted. Initializing...');

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;

    win.lgoCalculatorCallbacks = win.lgoCalculatorCallbacks || [];
    
    // eslint-disable-next-line no-console
    console.log('[LeasinGo] Pushing callback to global array...');

    win.lgoCalculatorCallbacks.push(() => {
      // eslint-disable-next-line no-console
      console.log('[LeasinGo] Callback FIRED! Script loaded successfully.');
      
      // Capture the instance from the window object
      calculatorInstance.value = win.productCalculator;
      
      if (calculatorInstance.value) {
        // eslint-disable-next-line no-console
        console.log('[LeasinGo] Calculator instance captured successfully.');
      } else {
        // eslint-disable-next-line no-console
        console.error('[LeasinGo] Callback fired, but productCalculator is undefined!');
      }

      updateCalculator();
    });
  }
});

// 3. Watch for price changes
watch(netPrice, (newVal) => {
  // eslint-disable-next-line no-console
  console.log('[LeasinGo] Price changed to:', newVal);
  updateCalculator();
});

function updateCalculator() {
  if (calculatorInstance.value && Number(netPrice.value) > 0) {
    // eslint-disable-next-line no-console
    console.log('[LeasinGo] Updating calculator with:', netPrice.value);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (calculatorInstance.value as any).setPriceNetto(parseFloat(netPrice.value));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (calculatorInstance.value as any).calculate();
  } else {
    // eslint-disable-next-line no-console
    console.warn('[LeasinGo] Skipping update. Instance ready:', !!calculatorInstance.value, 'Price > 0:', Number(netPrice.value) > 0);
  }
}
// --- LEASINGO INTEGRATION END ---
</script>