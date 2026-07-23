import { describe, expect, it } from 'vitest';
import { parseGoogleMapsHtml } from '~/utils/parseGoogleMapsHtml';

describe('parseGoogleMapsHtml', () => {
  it('returns a single html segment when no Google Maps iframe is present', () => {
    const html = '<p>Hello world</p>';
    expect(parseGoogleMapsHtml(html)).toEqual([{ type: 'html', content: html }]);
  });

  it('extracts a Google Maps iframe into a map segment', () => {
    const embedUrl = 'https://www.google.com/maps/embed?pb=test';
    const html = `<p>Before</p><iframe src="${embedUrl}" width="100%" height="600"></iframe><p>After</p>`;

    expect(parseGoogleMapsHtml(html)).toEqual([
      { type: 'html', content: '<p>Before</p>' },
      { type: 'map', embedUrl, previewUrl: undefined, width: '100%', height: '600' },
      { type: 'html', content: '<p>After</p>' },
    ]);
  });

  it('reads data-map-preview from iframe attributes', () => {
    const embedUrl = 'https://www.google.com/maps/embed?pb=test';
    const preview = 'https://cdn.example.com/map.jpg';
    const html = `<iframe data-map-preview="${preview}" src="${embedUrl}" height="400"></iframe>`;

    expect(parseGoogleMapsHtml(html)).toEqual([
      { type: 'map', embedUrl, previewUrl: preview, width: undefined, height: '400' },
    ]);
  });

  it('replaces an isolated static google-maps-consent widget with a live map segment', async () => {
    const { googleMapsKontaktEmbedUrl } = await import('~/configuration/googleMapsConsent.config');
    const html = `
      <div data-testid="google-maps-consent" class="google-maps-consent">
        <button data-testid="google-maps-consent-button">Karte laden</button>
      </div>
    `;

    expect(parseGoogleMapsHtml(html)).toEqual([
      { type: 'map', embedUrl: googleMapsKontaktEmbedUrl, width: '600', height: '450' },
    ]);
  });

  it('keeps full page DOM dumps as HTML so layout can be preserved and hydrated in place', () => {
    const html = `
      <div data-draggable="true">
        <div data-testid="block-wrapper">
          <h1>Contact</h1>
          <div data-testid="multi-grid-column">
            <div data-testid="text-content"><p>WhatsApp: +49 177</p></div>
          </div>
          <div data-testid="multi-grid-column">
            <div data-testid="google-maps-consent"><button>Load map</button></div>
          </div>
        </div>
      </div>
    `;

    expect(parseGoogleMapsHtml(html)).toEqual([{ type: 'html', content: html }]);
  });
});
