import type { Default, Product } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';

export const getActiveProductPriceTier = (product: Product, quantity: number): Default | null => {
  if (productGetters.getSpecialOffer(product)) {
    return product.prices?.specialOffer ?? null;
  }

  const graduatedPrice = productGetters.getGraduatedPriceByQuantity(product, quantity);
  if (graduatedPrice) {
    return graduatedPrice;
  }

  return product.prices?.default ?? null;
};

const readTierUnitPrice = (tier: Default | null, field: 'unitPrice' | 'unitPriceNet'): number | null => {
  const value = tier?.data?.[field];

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }

  return value;
};

/** Gross unit price from Plenty item API (`prices.*.data.unitPrice`). */
export const getProductUnitPriceGross = (product: Product, quantity: number): number | null =>
  readTierUnitPrice(getActiveProductPriceTier(product, quantity), 'unitPrice');

/** Net unit price from Plenty item API (`prices.*.data.unitPriceNet`). */
export const getProductUnitPriceNet = (product: Product, quantity: number): number | null =>
  readTierUnitPrice(getActiveProductPriceTier(product, quantity), 'unitPriceNet');

/** Show net below gross when the item API exposes both values and they differ. */
export const shouldShowProductNetPrice = (product: Product, quantity: number): boolean => {
  const gross = getProductUnitPriceGross(product, quantity);
  const net = getProductUnitPriceNet(product, quantity);

  if (gross === null || net === null) {
    return false;
  }

  return Math.abs(gross - net) >= 0.01;
};

/**
 * Listing/card unit price: prefer VAT-inclusive (`data.unitPrice`) when available,
 * otherwise fall back to the storefront/net `unitPrice.value`.
 */
export const getProductListingUnitPrice = (product: Product): number => {
  const specialOfferGross = readTierUnitPrice(product.prices?.specialOffer ?? null, 'unitPrice');
  const specialOfferStorefront = productGetters.getSpecialOffer(product);
  const specialOffer = specialOfferGross ?? specialOfferStorefront;

  const graduatedPrices = productGetters.getGraduatedPrices(product);

  if (graduatedPrices.length) {
    const graduatedGross = graduatedPrices
      .map((tier) => readTierUnitPrice(tier, 'unitPrice'))
      .filter((value): value is number => value !== null);

    const cheapestGraduated =
      graduatedGross.length > 0
        ? Math.min(...graduatedGross)
        : productGetters.getCheapestGraduatedPrice(product);

    if (specialOffer && specialOffer < cheapestGraduated) {
      return specialOffer;
    }

    return cheapestGraduated;
  }

  const defaultGross = readTierUnitPrice(product.prices?.default ?? null, 'unitPrice');
  const priceValue = defaultGross ?? productGetters.getPrice(product) ?? 0;

  if (specialOffer && specialOffer < priceValue) {
    return specialOffer;
  }

  return priceValue;
};

/**
 * Listing/card crossed price: prefer VAT-inclusive RRP/default from API data,
 * otherwise fall back to storefront values.
 */
export const getProductListingCrossedPrice = (product: Product): number | null => {
  const specialOffer = productGetters.getSpecialOffer(product);

  if (specialOffer) {
    const defaultGross = readTierUnitPrice(product.prices?.default ?? null, 'unitPrice');
    return defaultGross ?? productGetters.getPrice(product);
  }

  const rrpGross = readTierUnitPrice(product.prices?.rrp ?? null, 'unitPrice');
  return rrpGross ?? productGetters.getCrossedPrice(product);
};

/** Whether the product exposes a VAT-inclusive unit price in API tier data. */
export const hasProductGrossUnitPrice = (product: Product): boolean => {
  const tiers = [
    product.prices?.specialOffer,
    product.prices?.default,
    ...(product.prices?.graduatedPrices ?? []),
  ];

  return tiers.some((tier) => readTierUnitPrice(tier ?? null, 'unitPrice') !== null);
};
