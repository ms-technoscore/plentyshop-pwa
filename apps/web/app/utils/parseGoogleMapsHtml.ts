import { googleMapsKontaktEmbedUrl } from '~/configuration/googleMapsConsent.config';

export type HtmlSegment =
  | { type: 'html'; content: string }
  | { type: 'map'; embedUrl: string; previewUrl?: string; width?: string; height?: string };

const GOOGLE_MAPS_IFRAME_REGEX =
  /<iframe\b([^>]*)\bsrc=["'](https?:\/\/[^"']*google\.com\/maps[^"']*)["']([^>]*)>\s*(?:<\/iframe>)?/gi;

const PREVIEW_ATTR_REGEX = /\bdata-map-preview=["']([^"']+)["']/i;
const WIDTH_ATTR_REGEX = /\bwidth=["']?([^"'\s>]+)["']?/i;
const HEIGHT_ATTR_REGEX = /\bheight=["']?([^"'\s>]+)["']?/i;
const STATIC_MAP_CONSENT_REGEX = /data-testid=["']google-maps-consent["']/i;
/** Captured full-page DOM dumps must keep their markup so layout stays intact. */
const PAGE_DUMP_REGEX = /data-draggable=["']true["']|data-testid=["']block-wrapper["']/i;

const parseIframeAttributes = (
  beforeSrc: string,
  afterSrc: string,
): { previewUrl?: string; width?: string; height?: string } => {
  const attrs = `${beforeSrc} ${afterSrc}`;
  return {
    previewUrl: attrs.match(PREVIEW_ATTR_REGEX)?.[1],
    width: attrs.match(WIDTH_ATTR_REGEX)?.[1],
    height: attrs.match(HEIGHT_ATTR_REGEX)?.[1],
  };
};

const kontaktMapSegment = (): HtmlSegment => ({
  type: 'map',
  embedUrl: googleMapsKontaktEmbedUrl,
  width: '600',
  height: '450',
});

export const hasStaticGoogleMapsConsent = (html?: string): boolean =>
  !!html && STATIC_MAP_CONSENT_REGEX.test(html) && !hasGoogleMapsEmbed(html);

export const isGoogleMapsPageDump = (html?: string): boolean => !!html && PAGE_DUMP_REGEX.test(html);

/**
 * CMS sometimes stores a rendered consent widget instead of an iframe.
 * - Isolated widget → live map segment (Vue component in TextContent).
 * - Full page DOM dump → keep HTML as-is (TextContent hydrates the widget in place to preserve layout).
 */
const replaceStaticMapConsent = (html: string): HtmlSegment[] | null => {
  if (!hasStaticGoogleMapsConsent(html)) {
    return null;
  }

  if (isGoogleMapsPageDump(html)) {
    return [{ type: 'html', content: html }];
  }

  return [kontaktMapSegment()];
};

/** Splits HTML into plain segments and Google Maps iframe segments. */
export const parseGoogleMapsHtml = (html: string): HtmlSegment[] => {
  if (!html) {
    return [{ type: 'html', content: html }];
  }

  const staticConsentSegments = replaceStaticMapConsent(html);
  if (staticConsentSegments) {
    return staticConsentSegments;
  }

  if (!html.toLowerCase().includes('google.com/maps')) {
    return [{ type: 'html', content: html }];
  }

  const segments: HtmlSegment[] = [];
  let lastIndex = 0;

  for (const match of html.matchAll(GOOGLE_MAPS_IFRAME_REGEX)) {
    const fullMatch = match[0];
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      segments.push({ type: 'html', content: html.slice(lastIndex, matchIndex) });
    }

    const embedUrl = match[2];
    if (!embedUrl) continue;

    const { previewUrl, width, height } = parseIframeAttributes(match[1] ?? '', match[3] ?? '');

    segments.push({
      type: 'map',
      embedUrl,
      previewUrl,
      width,
      height,
    });

    lastIndex = matchIndex + fullMatch.length;
  }

  if (lastIndex < html.length) {
    segments.push({ type: 'html', content: html.slice(lastIndex) });
  }

  if (segments.length === 0) {
    return [{ type: 'html', content: html }];
  }

  return segments;
};

export const hasGoogleMapsEmbed = (html?: string): boolean =>
  !!html && /<iframe\b[^>]*\bsrc=["']https?:\/\/[^"']*google\.com\/maps/i.test(html);
