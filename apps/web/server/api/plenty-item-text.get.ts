import { defineEventHandler, getQuery } from 'h3';

type StorefrontTexts = {
  name1?: string;
  name2?: string;
  name3?: string;
  description?: string;
  shortDescription?: string;
  metaDescription?: string;
  urlPath?: string;
  lang?: string;
};

/**
 * Loads item texts for a Plenty language slot via the storefront API (read-only).
 * Uses `x-security-token` + `locale` header — same auth as the rest of the PWA.
 * Backend `/rest/items/.../descriptions` requires OAuth and does not work with API_SECURITY_TOKEN.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const itemId = query.itemId?.toString();
  const variationId = query.variationId?.toString();
  const lang = query.lang?.toString() ?? 'de';

  if (!itemId || !variationId) {
    return null;
  }

  const apiEndpoint = process.env.API_ENDPOINT || 'https://www.komplett-konzept.de';
  const securityToken = process.env.API_SECURITY_TOKEN;

  if (!securityToken) {
    return null;
  }

  try {
    const url = new URL(`/rest/storefront/items/${itemId}`, apiEndpoint);
    url.searchParams.set('variationId', variationId);

    const response = await fetch(url.href, {
      method: 'GET',
      headers: {
        'x-security-token': securityToken,
        locale: lang,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const body = (await response.json()) as {
      data?: { item?: { documents?: { data?: { texts?: StorefrontTexts } }[] } };
    };

    const texts = body.data?.item?.documents?.[0]?.data?.texts;
    // Storefront falls back to default (de) when a language is not activated for the shop.
    if (!texts?.name1 || texts.lang !== lang) {
      return null;
    }

    return {
      name: texts.name1,
      name1: texts.name1,
      description: texts.description,
      previewDescription: texts.shortDescription,
      metaDescription: texts.metaDescription,
      urlPath: texts.urlPath,
    };
  } catch {
    return null;
  }
});
