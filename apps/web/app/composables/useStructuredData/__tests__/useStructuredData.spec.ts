import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { ref } from 'vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { productGetters, productSeoSettingsGetters } from '@plentymarkets/shop-api';

const { useHead, useRuntimeConfig, useState, useProductReviews, useProductReviewAverage, useRoute, useLocalePath } =
  vi.hoisted(() => {
    return {
      useHead: vi.fn(),
      useRuntimeConfig: vi.fn(() => ({
        public: {
          domain: 'https://example.com',
        },
      })),
      useState: vi.fn((key: string, init: () => { loading: boolean }) => ref(init())),
      useProductReviews: vi.fn(),
      useProductReviewAverage: vi.fn(),
      useRoute: vi.fn(() => ({
        path: '/kategorie/neu-eingetroffen/test-product_58645_61987',
      })),
      useLocalePath: vi.fn(() => (path: string) => path),
    };
  });

vi.mock('@plentymarkets/shop-api', () => ({
  categoryTreeGetters: {
    getName: vi.fn(() => 'Category'),
  },
  productGetters: {
    getAverageRating: vi.fn(() => 4.5),
    getCheapestGraduatedPrice: vi.fn(() => 19.99),
    getCoverImage: vi.fn(() => 'https://example.com/image.jpg'),
    getCrossedPrice: vi.fn(() => 24.99),
    getGraduatedPrices: vi.fn(() => []),
    getId: vi.fn(() => 'sku-1'),
    getItemId: vi.fn(() => '1'),
    getLengthMM: vi.fn(() => 10),
    getName: vi.fn(() => 'Test product'),
    getPrice: vi.fn(() => 19.99),
    getRegularPriceCurrency: vi.fn(() => 'EUR'),
    getSpecialOffer: vi.fn(() => null),
    getSpecialPriceCurrency: vi.fn(() => 'EUR'),
    getTotalReviews: vi.fn(() => 0),
    getWeightG: vi.fn(() => 500),
    getWidthMM: vi.fn(() => 20),
    getHeightMM: vi.fn(() => 30),
  },
  productSeoSettingsGetters: {
    getConditionOfItem: vi.fn(() => 'https://schema.org/NewCondition'),
    getMappedAvailability: vi.fn(() => 'https://schema.org/InStock'),
    getSeoManufacturer: vi.fn(() => ''),
    getBrand: vi.fn(() => ''),
    getSku: vi.fn(() => ''),
    getGtin: vi.fn(() => ''),
    getGtin8: vi.fn(() => ''),
    getGtin13: vi.fn(() => ''),
    getIsbn: vi.fn(() => ''),
    getMpn: vi.fn(() => ''),
    getPriceValidUntil: vi.fn(() => ''),
    getForcedCanonicalUrl: vi.fn(() => ''),
    getCanonical: vi.fn(() => ({})),
    getCanonicalHref: vi.fn(() => ''),
    getCanonicalAlternate: vi.fn(() => []),
    getCanonicalAlternateHref: vi.fn((item: { href: string }) => item.href),
    getCanonicalAlternateHreflang: vi.fn((item: { hreflang: string }) => item.hreflang),
  },
  reviewGetters: {
    getReviewAuthor: vi.fn(() => 'Jane Doe'),
    getReviewItems: vi.fn(() => [{ id: 'review-1' }]),
    getReviewRating: vi.fn(() => 5),
  },
}));

mockNuxtImport('useHead', () => useHead);
mockNuxtImport('useRuntimeConfig', () => useRuntimeConfig);
mockNuxtImport('useState', () => useState);
mockNuxtImport('useProductReviews', () => useProductReviews);
mockNuxtImport('useProductReviewAverage', () => useProductReviewAverage);
mockNuxtImport('useRoute', () => useRoute);
mockNuxtImport('useLocalePath', () => useLocalePath);

import { useStructuredData } from '../useStructuredData';

const getStructuredData = () => {
  const headConfig = useHead.mock.calls.at(-1)?.[0];
  const scriptEntry = (headConfig?.script as Array<{ innerHTML: string }> | undefined)?.[0];

  expect(headConfig).toBeDefined();
  expect(scriptEntry).toBeDefined();

  return JSON.parse(scriptEntry!.innerHTML);
};

describe('useStructuredData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProductReviews.mockReturnValue({ data: ref([{ id: 'review-1' }]) });
    useProductReviewAverage.mockReturnValue({ data: ref(undefined) });
    vi.mocked(productGetters.getTotalReviews).mockReturnValue(0);
    vi.mocked(productSeoSettingsGetters.getForcedCanonicalUrl).mockReturnValue('');
    vi.mocked(productSeoSettingsGetters.getCanonical).mockReturnValue({} as never);
    vi.mocked(productSeoSettingsGetters.getCanonicalHref).mockReturnValue('');
    vi.mocked(productSeoSettingsGetters.getCanonicalAlternate).mockReturnValue([]);
  });

  it('omits aggregateRating when there are no reviews and sets a return policy', () => {
    const { setProductMetaData } = useStructuredData();

    setProductMetaData(
      {
        texts: { description: 'Test description' },
      } as never,
      {} as never,
    );

    const structuredData = getStructuredData();

    expect(structuredData.aggregateRating).toBeUndefined();
    expect(structuredData.offers.hasMerchantReturnPolicy).toEqual({
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      refundType: 'https://schema.org/FullRefund',
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    });
  });

  it('includes aggregateRating when reviewCount is positive', () => {
    vi.mocked(productGetters.getTotalReviews).mockReturnValue(3);
    useProductReviewAverage.mockReturnValue({ data: ref({}) });

    const { setProductMetaData } = useStructuredData();

    setProductMetaData(
      {
        texts: { description: 'Test description' },
      } as never,
      {} as never,
    );

    const structuredData = getStructuredData();

    expect(structuredData.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: 4.5,
      reviewCount: 3,
    });
  });

  it('sets product canonical from the current page URL when SEO canonical is empty', () => {
    const { setProductCanonicalMetaData } = useStructuredData();

    setProductCanonicalMetaData({} as never);

    expect(useHead).toHaveBeenCalledWith({
      link: [
        {
          rel: 'canonical',
          href: 'https://example.com/kategorie/neu-eingetroffen/test-product_58645_61987',
        },
      ],
    });
  });

  it('prefers a forced canonical URL over the page URL', () => {
    vi.mocked(productSeoSettingsGetters.getForcedCanonicalUrl).mockReturnValue('https://example.com/custom-canonical');

    const { setProductCanonicalMetaData } = useStructuredData();

    setProductCanonicalMetaData({} as never);

    expect(useHead).toHaveBeenCalledWith({
      link: [
        {
          rel: 'canonical',
          href: 'https://example.com/custom-canonical',
        },
      ],
    });
  });
});
