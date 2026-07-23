import type { Product } from '@plentymarkets/shop-api';
import { describe, expect, it } from 'vitest';
import { ProductMock } from '../../../../__tests__/__mocks__/product.mock';
import {
  getActiveProductPriceTier,
  getProductListingCrossedPrice,
  getProductListingUnitPrice,
  getProductUnitPriceGross,
  getProductUnitPriceNet,
  hasProductGrossUnitPrice,
  shouldShowProductNetPrice,
} from '../getProductNetPrice';

const graduatedTier = ProductMock.prices.graduatedPrices[0]!;

describe('getProductNetPrice', () => {
  it('returns the active price tier for the selected quantity', () => {
    const tier = getActiveProductPriceTier(ProductMock, 1);

    expect(tier).toBe(graduatedTier);
  });

  it('returns gross and net unit prices from the active tier data object', () => {
    expect(getProductUnitPriceGross(ProductMock, 1)).toBe(180);
    expect(getProductUnitPriceNet(ProductMock, 1)).toBe(151.26050420168);
  });

  it('shows secondary net price when gross and net differ in API data', () => {
    expect(shouldShowProductNetPrice(ProductMock, 1)).toBe(true);
  });

  it('shows secondary net price even when the storefront price tier is net (isNet: true)', () => {
    const netStorefrontProduct = {
      ...ProductMock,
      prices: {
        ...ProductMock.prices,
        graduatedPrices: [
          {
            ...graduatedTier,
            isNet: true,
            unitPrice: { value: 100.84033613445, formatted: '€100.84' },
            data: {
              ...graduatedTier.data,
              unitPrice: 120,
              unitPriceNet: 100.84033613445,
            },
          },
        ],
      },
    } as Product;

    expect(getProductUnitPriceGross(netStorefrontProduct, 1)).toBe(120);
    expect(getProductUnitPriceNet(netStorefrontProduct, 1)).toBe(100.84033613445);
    expect(shouldShowProductNetPrice(netStorefrontProduct, 1)).toBe(true);
  });

  it('hides secondary net price when gross and net are equal', () => {
    const equalPriceProduct = {
      ...ProductMock,
      prices: {
        ...ProductMock.prices,
        graduatedPrices: [
          {
            ...graduatedTier,
            data: {
              ...graduatedTier.data,
              unitPrice: 100,
              unitPriceNet: 100,
            },
          },
        ],
      },
    } as Product;

    expect(shouldShowProductNetPrice(equalPriceProduct, 1)).toBe(false);
  });

  it('prefers VAT-inclusive listing price when storefront tier is net', () => {
    const netStorefrontProduct = {
      ...ProductMock,
      prices: {
        ...ProductMock.prices,
        specialOffer: null,
        graduatedPrices: [
          {
            ...graduatedTier,
            isNet: true,
            unitPrice: { value: 54.62, formatted: '€54.62' },
            data: {
              ...graduatedTier.data,
              unitPrice: 65,
              unitPriceNet: 54.62,
            },
          },
        ],
      },
    } as Product;

    expect(getProductListingUnitPrice(netStorefrontProduct)).toBe(65);
    expect(hasProductGrossUnitPrice(netStorefrontProduct)).toBe(true);
  });

  it('falls back to storefront/net listing price when gross data is missing', () => {
    const { unitPrice: _graduatedGross, ...graduatedDataWithoutGross } = graduatedTier.data;
    const { unitPrice: _defaultGross, ...defaultDataWithoutGross } = ProductMock.prices.default.data;

    const netOnlyProduct = {
      ...ProductMock,
      prices: {
        ...ProductMock.prices,
        specialOffer: null,
        graduatedPrices: [
          {
            ...graduatedTier,
            isNet: true,
            unitPrice: { value: 54.62, formatted: '€54.62' },
            data: {
              ...graduatedDataWithoutGross,
              unitPriceNet: 54.62,
            },
          },
        ],
        default: {
          ...ProductMock.prices.default,
          isNet: true,
          unitPrice: { value: 54.62, formatted: '€54.62' },
          data: {
            ...defaultDataWithoutGross,
            unitPriceNet: 54.62,
          },
        },
      },
    } as unknown as Product;

    expect(getProductListingUnitPrice(netOnlyProduct)).toBe(54.62);
    expect(hasProductGrossUnitPrice(netOnlyProduct)).toBe(false);
  });

  it('prefers VAT-inclusive RRP for listing crossed price', () => {
    const netRrpProduct = {
      ...ProductMock,
      prices: {
        ...ProductMock.prices,
        specialOffer: null,
        rrp: {
          ...ProductMock.prices.rrp,
          isNet: true,
          unitPrice: { value: 100.84, formatted: '€100.84' },
          data: {
            ...ProductMock.prices.rrp.data,
            unitPrice: 120,
            unitPriceNet: 100.84,
          },
        },
      },
    } as Product;

    expect(getProductListingCrossedPrice(netRrpProduct)).toBe(120);
  });
});
