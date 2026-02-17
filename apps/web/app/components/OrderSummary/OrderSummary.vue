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
      
      <div 
  v-if="isRatepaySelected" 
  id="paypal_payuponinvoice_legal_notice" 
  class="text-xs text-neutral-600 mb-4 pb-4 border-b border-neutral-200 leading-relaxed"
>
  Mit Klick auf den Button akzeptieren Sie die 
  <a href="https://www.ratepay.com/legal-payment-terms" target="_blank" class="underline hover:text-black font-medium">Ratepay Zahlungsbedingungen</a> 
  und erklären sich mit der Durchführung einer 
  <a href="https://www.ratepay.com/legal-payment-dataprivacy" target="_blank" class="underline hover:text-black font-medium">Risikoprüfung durch Ratepay</a>, 
  unseren Partner, einverstanden. Sie akzeptieren auch PayPals 
  <a href="https://www.paypal.com/de/webapps/mpp/ua/rechnungskauf-mit-ratepay?locale.x=de_DE&_ga=1.51347872.826497444.1637075579" target="_blank" class="underline hover:text-black font-medium">Datenschutzerklärung</a>. 
  Falls Ihre Transaktion erfolgreich per Kauf auf Rechnung abgewickelt werden kann, wird der Kaufpreis an Ratepay abgetreten und Sie dürfen nur an Ratepay überweisen, nicht an den Händler.
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

const totals = computed(() => {
  const totalsData = cartGetters.getTotals(props.cart);
  return {
    total: totalsData.total,
    subTotal: totalsData.subtotal,
    vats: totalsData.totalVats,
  };
});

// Watch for the active payment method ID
const isRatepaySelected = computed(() => {
  // ⚠️ IMPORTANT: Replace '6000' with the actual Payment ID for "Invoice purchase" in your Plentymarkets backend
  const ratepayPaymentId = 6031; 
  
  return props.cart?.methodOfPaymentId === ratepayPaymentId;
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