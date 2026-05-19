import type { Product, ProductParams } from '@plentymarkets/shop-api';
import { productGetters } from '@plentymarkets/shop-api';
import { getPlentyApiLocale, getPlentyTextSlot } from '~/utils/localePlentyMap';

type PlentyDescription = {
  name?: string;
  name1?: string;
  description?: string;
  previewDescription?: string;
  metaDescription?: string;
  urlPath?: string;
};

const productParamsFromProduct = (product: Product): ProductParams | null => {
  const id = productGetters.getItemId(product);
  if (!id) {
    return null;
  }

  const variationId =
    productGetters.getId(product) || String(productGetters.getVariationId(product) || '');

  return { id, ...(variationId ? { variationId } : {}) };
};

/**
 * Loads product texts from an alternate Plenty slot (e.g. pt for Arabic) via the PWA server proxy.
 * Storefront getProduct must use an active catalog locale (de); texts may still exist in other slots.
 */
export const mergePlentyTextSlot = async (
  product: Product,
  params: ProductParams,
  textSlot: string,
): Promise<Product> => {
  if (!params.id || textSlot === 'de') {
    return product;
  }

  const variationId =
    params.variationId?.toString() ||
    productGetters.getId(product) ||
    String(productGetters.getVariationId(product) || '');

  if (!variationId) {
    return product;
  }

  try {
    const descriptions = await $fetch<PlentyDescription | PlentyDescription[]>('/api/plenty-item-text', {
      query: {
        itemId: params.id,
        variationId,
        lang: textSlot,
      },
    });

    const entry = Array.isArray(descriptions) ? descriptions[0] : descriptions;
    if (!entry?.name && !entry?.name1) {
      return product;
    }

    const texts = { ...(product.texts ?? {}) };
    const name = entry.name1 ?? entry.name ?? texts.name1;

    if (name) {
      texts.name1 = name;
      texts.name2 = name;
      texts.name3 = name;
    }
    if (entry.description) {
      texts.description = entry.description;
    }
    if (entry.previewDescription) {
      texts.shortDescription = entry.previewDescription;
    }
    if (entry.metaDescription) {
      texts.metaDescription = entry.metaDescription;
    }
    // Do not copy urlPath from the storage slot (e.g. pt/…) — it triggers a redirect that drops variationId.
    texts.lang = textSlot;

    return { ...product, texts };
  } catch {
    return product;
  }
};

/** Merges alternate Plenty text slots for each product in a list (category, recommendations, etc.). */
export const mergePlentyTextSlotsForProducts = async (
  products: Product[],
  textSlot: string,
): Promise<Product[]> => {
  if (!products.length || textSlot === 'de') {
    return products;
  }

  return Promise.all(
    products.map(async (product) => {
      const params = productParamsFromProduct(product);
      if (!params) {
        return product;
      }
      return mergePlentyTextSlot(product, params, textSlot);
    }),
  );
};

/** Applies the mapped Plenty text slot for the active PWA locale when it differs from the catalog locale. */
export const applyPlentyTextSlotForLocale = async (
  products: Product[],
  pwaLocale: string,
): Promise<Product[]> => {
  const textSlot = getPlentyTextSlot(pwaLocale);
  const plentyApiLocale = getPlentyApiLocale(pwaLocale);

  if (textSlot === plentyApiLocale) {
    return products;
  }

  return mergePlentyTextSlotsForProducts(products, textSlot);
};
