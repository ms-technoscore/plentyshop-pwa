/**
 * Maps Plenty catalog API labels (often German) to PWA i18n keys.
 * Prefer availabilityId / condition id when present; fall back to name matching.
 */
const availabilityIdToKey: Record<number, string> = {
  1: 'availabilities.availabilityInStock',
  2: 'availabilities.availabilityOutOfStock',
  3: 'availabilities.availabilityPreOrder',
  4: 'availabilities.availabilityBackOrder',
  5: 'availabilities.availabilitySoldOut',
  6: 'availabilities.availabilityDiscontinued',
  7: 'availabilities.availabilityLimitedAvailability',
  8: 'availabilities.availabilityInStoreOnly',
  9: 'availabilities.availabilityOnlineOnly',
  10: 'availabilities.availabilityPreSale',
};

const availabilityNameToKey: Record<string, string> = {
  'Auf Lager': 'availabilities.availabilityInStock',
  'In stock': 'availabilities.availabilityInStock',
  'Available': 'availabilities.availabilityInStock',
  'Nicht auf Lager': 'availabilities.availabilityOutOfStock',
  'Out of stock': 'availabilities.availabilityOutOfStock',
  'Vorbestellbar': 'availabilities.availabilityPreOrder',
  'Pre-order': 'availabilities.availabilityPreOrder',
  'Lieferrückstand': 'availabilities.availabilityBackOrder',
  'Back order': 'availabilities.availabilityBackOrder',
  'Ausverkauft': 'availabilities.availabilitySoldOut',
  'Sold out': 'availabilities.availabilitySoldOut',
};

const conditionIdToKey: Record<number, string> = {
  0: 'product.conditionNew',
  1: 'product.conditionNew',
};

const conditionNameToKey: Record<string, string> = {
  Neu: 'product.conditionNew',
  New: 'product.conditionNew',
  Gebraucht: 'product.conditionUsed',
  Used: 'product.conditionUsed',
};

type TranslateFn = (key: string) => string;

const resolveByKey = (key: string | undefined, t: TranslateFn, fallback: string): string => {
  if (!key) return fallback;
  const translated = t(key);
  return translated === key ? fallback : translated;
};

type ProductAvailability = {
  id?: number;
  names?: { name?: string; availabilityId?: number };
};

export const getLocalizedAvailabilityName = (product: unknown, t: TranslateFn): string => {
  const variation = (product as { variation?: { availabilityId?: number; availability?: ProductAvailability } })
    ?.variation;
  const apiName = variation?.availability?.names?.name ?? '';
  const availability = variation?.availability;
  const id = variation?.availabilityId ?? availability?.id ?? availability?.names?.availabilityId;

  if (typeof id === 'number' && availabilityIdToKey[id]) {
    return resolveByKey(availabilityIdToKey[id], t, apiName);
  }

  const normalized = apiName.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const key = availabilityNameToKey[normalized] ?? availabilityNameToKey[apiName];
  return resolveByKey(key, t, apiName);
};

export const getLocalizedConditionName = (product: unknown, t: TranslateFn): string => {
  const item = (product as {
    item?: {
      conditionApi?: { id?: number; names?: { name?: string } | { name?: string }[] };
      condition?: { id?: number; names?: { name?: string } };
    };
  })?.item;

  const condition = item?.conditionApi ?? item?.condition;
  const names = condition?.names;
  const apiName = Array.isArray(names) ? names[0]?.name : names?.name;
  const fallback = apiName ?? '';
  const id = condition?.id;

  if (typeof id === 'number' && conditionIdToKey[id]) {
    return resolveByKey(conditionIdToKey[id], t, fallback || t('product.conditionNew'));
  }

  const key = conditionNameToKey[fallback ?? ''];
  return resolveByKey(key, t, fallback || t('product.conditionNew'));
};
