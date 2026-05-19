import { getPlentyApiLocale, getPlentyTextSlot } from '~/utils/localePlentyMap';

/**
 * Dev-only banner showing active PWA locale and Plenty API locale (no Google Translate).
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.dev) {
    return;
  }

  const i18n = nuxtApp.$i18n as { locale: { value: string } };

  nuxtApp.hook('app:mounted', () => {
    const banner = document.createElement('div');
    banner.id = 'locale-debug-banner';
    banner.setAttribute(
      'style',
      'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#062633;color:#fff;font:12px/1.4 monospace;padding:6px 12px;text-align:center;',
    );

    const update = () => {
      const pwaLocale = i18n.locale.value;
      const apiLocale = getPlentyApiLocale(pwaLocale);
      const textSlot = getPlentyTextSlot(pwaLocale);
      banner.textContent = `PWA: ${pwaLocale} | API catalog: ${apiLocale} | Text slot: ${textSlot}`;
    };

    update();
    watch(() => i18n.locale.value, update);
    document.body.appendChild(banner);
  });
});
