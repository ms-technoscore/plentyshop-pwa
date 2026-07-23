import type { Product } from '@plentymarkets/shop-api';
import {
  getProductListingCrossedPrice,
  getProductListingUnitPrice,
} from '~/utils/product/getProductNetPrice';

/**
 * @description Composable for managing product prices.
 * Prefers VAT-inclusive (gross) API prices when available, otherwise falls back to storefront/net.
 * @example
 * ``` ts
 * const { price, crossedPrice } = useProductPrice();
 * useProductPrice({} as Product);
 * ```
 */

export const useProductPrice = (product: Product) => {
  const price = computed(() => getProductListingUnitPrice(product));

  const crossedPrice = computed(() => getProductListingCrossedPrice(product));

  return {
    price,
    crossedPrice,
  };
};
