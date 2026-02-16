<template>
  <div class="shadow-lg md:rounded-md md:border md:border-neutral-100" data-testid="order-summary">
    <div class="flex justify-between items-end py-2 px-4 md:px-6 md:pt-6 md:pb-4">
      <h2 class="typography-headline-4 font-bold md:typography-headline-3">{{ t('common.labels.orderSummary') }}</h2>
      <p class="typography-text-base font-medium" data-testid="total-in-cart">
        {{ t('cart.itemCount', { count: cartItemsCount }) }}
      </p>
    </div>

    <div class="px-4 pb-4 mt-3 md:px-6 md:pb-6 md:mt-0">
      
      <div v-if="orderPropertiesWithVatAdditionalCosts.length > 0" class="mb-4">
        <div
          v-for="property in orderPropertiesWithVatAdditionalCosts"
          :key="cartGetters.getBasketItemOrderParamPropertyId(property)"
          class="flex justify-between typography-text-base w-full"
        >
          <p class="flex flex-col gap-2 grow pr-2">{{ cartGetters.getBasketItemOrderParamName(property) }}</p>
          <p class="flex flex-col gap-2 text-right">
            {{ format(cartGetters.getBasketItemOrderParamPrice(property)) }}
          </p>
        </div>
        <UiDivider class="mt-4 w-auto" />
      </div>

      <div class="flex flex-col w-full">
        
        <div class="flex justify-between typography-text-base mb-1">
          <p>Warenwert ({{ t('common.labels.netPrice') }})</p>
          <p>{{ format(cartGetters.getItemSumNet(props.cart)) }}</p>
        </div>
        <div class="flex justify-between typography-text-base mb-1">
          <p>Warenwert ({{ t('common.labels.grossPrice') }})</p>
          <p>{{ format(totals.subTotal) }}</p>
        </div>

        <div class="flex justify-between typography-text-base mb-1 mt-3">
          <p>{{ t('common.labels.delivery') }} ({{ t('common.labels.netPrice') }})</p>
          <p>{{ getShippingAmount(cartGetters.getShippingAmountNet(props.cart)) }}</p>
        </div>
        <div class="flex justify-between typography-text-base mb-4">
          <p>{{ t('common.labels.delivery') }} ({{ t('common.labels.grossPrice') }})</p>
          <p>{{ getShippingAmount(cartGetters.getShippingPrice(props.cart)) }}</p>
        </div>

        <div v-if="cartGetters.getCouponDiscount(props.cart)" class="flex justify-between typography-text-base mb-4 font-medium text-green-600">
          <p>{{ t('coupon.name') }}</p>
          <p>{{ format(cartGetters.getCouponDiscount(props.cart)) }}</p>
        </div>

        <UiDivider class="w-auto mb-4" />

        <div class="flex justify-between typography-text-base mb-1">
          <p>{{ t('common.labels.itemsSubtotal') }} ({{ t('common.labels.netPrice') }})</p>
          <p>{{ format(cartGetters.getBasketAmountNet(props.cart)) }}</p>
        </div>

        <div v-for="(vat, index) in totals.vats" :key="index" class="flex justify-between typography-text-base mb-4">
          <p>{{ t('common.labels.includedTax') }} ({{ cartGetters.getTotalVatValue(vat) }}%)</p>
          <p>{{ format(cartGetters.getTotalVatAmount(vat)) }}</p>
        </div>

        <UiDivider class="w-auto mb-4" />
      </div>
      <div v-if="orderPropertiesWithoutVat.length > 0" class="mb-4">
        <div
          v-for="property in orderPropertiesWithoutVat"
          :key="cartGetters.getBasketItemOrderParamPropertyId(property)"
          class="flex justify-between typography-text-base w-full"
        >
          <p class="flex flex-col gap-2 grow pr-2">{{ cartGetters.getBasketItemOrderParamName(property) }}</p>
          <p class="flex flex-col gap-2 text-right">
            {{ format(cartGetters.getBasketItemOrderParamPrice(property)) }}
          </p>
        </div>
        <UiDivider class="mt-4 w-auto" />
      </div>

      <div class="flex justify-between typography-text-base mb-1">
        <p>{{ t('common.labels.total') }} ({{ t('common.labels.netPrice') }})</p>
        <p>{{ format(cartGetters.getBasketAmountNet(props.cart)) }}</p>
      </div>
      <div class="flex justify-between typography-text-base font-bold pb-4 mb-4">
        <p>{{ t('common.labels.total') }} ({{ t('common.labels.grossPrice') }})</p>
        <p class="text-lg">{{ format(totals.total) }}</p>
      </div>
      
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { cartGetters } from '@plentymarkets/shop-api';
import type { OrderSummaryPropsType } from '~/components/OrderSummary/types';

const props = defineProps<OrderSummaryPropsType>();
const { format } = usePriceFormatter();

// We removed 'showNetPrices' from useCart() here since we are hardcoding the view to show both!

const totals = computed(() => {
  const totalsData = cartGetters.getTotals(props.cart);
  return {
    total: totalsData.total,
    subTotal: totalsData.subtotal,
    vats: totalsData.totalVats,
  };
});

const getShippingAmount = (amount: number) => {
  return amount === 0 ? t('shipping.method.free') : format(Number(amount));
};

const cartItemsCount = computed(() => props.cart?.items?.reduce((price, { quantity }) => price + quantity, 0) ?? 0);
const orderPropertiesWithoutVat = computed(() => cartGetters.getOrderPropertiesWithoutVat(props.cart));
const orderPropertiesWithVatAdditionalCosts = computed(() =>
  cartGetters.getOrderPropertiesAdditionalCostsWithVat(props.cart),
);
</script>