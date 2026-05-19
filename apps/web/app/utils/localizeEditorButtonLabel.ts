/**
 * Resolves shop-editor button labels for non-German storefront locales.
 * CMS blocks store German defaults; Arabic copy lives in locale files (editorButtons.*).
 */
export const editorButtonSlugFromPath = (path?: string): string => {
  if (!path) return '';
  const segment = path.replace(/^\/+/, '').split(/[/?#]/)[0] ?? '';
  return normalizeEditorButtonSlug(segment);
};

/** Turn a German CMS label into a stable i18n key segment (handles `&`, umlauts, spaces). */
export const editorButtonSlugFromLabel = (label: string): string => {
  return normalizeEditorButtonSlug(
    label
      .trim()
      .toLowerCase()
      .replace(/\s*&\s*/g, ' '),
  );
};

const normalizeEditorButtonSlug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const tryTranslateSlug = (
  slug: string,
  translate: (key: string) => string,
  hasKey: (key: string) => boolean,
): string | null => {
  if (!slug) return null;
  const key = `editorButtons.${slug}`;
  return hasKey(key) ? translate(key) : null;
};

export const localizeEditorButtonLabel = (
  locale: string,
  cmsLabel: string,
  link: string | undefined,
  translate: (key: string) => string,
  hasKey: (key: string) => boolean,
): string => {
  if (locale === 'de' || !cmsLabel) {
    return cmsLabel;
  }

  const fromPath = tryTranslateSlug(editorButtonSlugFromPath(link), translate, hasKey);
  if (fromPath) return fromPath;

  const fromLabel = tryTranslateSlug(editorButtonSlugFromLabel(cmsLabel), translate, hasKey);
  if (fromLabel) return fromLabel;

  return cmsLabel;
};
