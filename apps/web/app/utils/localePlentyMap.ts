/**
 * Maps public PWA locale codes to PlentyONE language slot codes.
 * Arabic (`ar`) copy is stored in the Portuguese (`pt`) slot — Plenty has no native `ar`.
 */
export const localePlentyMap: Record<string, string> = {
  de: 'de',
  en: 'en',
  es: 'es',
  fr: 'fr',
  it: 'it',
  pt: 'pt',
  cn: 'cn',
  zh: 'cn',
  ar: 'pt',
};

/** Plenty slots that are not activated on the storefront catalog (getProduct returns item.notFound). */
const storefrontInactiveSlots = new Set(['pt', 'en', 'es', 'fr', 'cn', 'it']);

/**
 * Locale sent on SDK / storefront requests so the item can be loaded.
 * Arabic uses `de` for the catalog call; Arabic texts live in the `pt` slot (see getPlentyTextSlot).
 */
export const getPlentyApiLocale = (locale: string): string => {
  const slot = localePlentyMap[locale] ?? locale;

  if (locale === 'ar' || storefrontInactiveSlots.has(slot)) {
    return 'de';
  }

  return slot;
};

/** Plenty language slot used for product/category texts (n8n writes Arabic to `pt`). */
export const getPlentyTextSlot = (locale: string): string => localePlentyMap[locale] ?? locale;

/** @deprecated Use getPlentyApiLocale */
export const getPlentyLocale = getPlentyApiLocale;

export const isRtlLocale = (locale: string): boolean => locale === 'ar';

/** Plenty storage slots used only via mapping — not shown in the language selector (use `ar` in URLs). */
export const hiddenUiLocales = new Set(['pt']);
