import type { Composer } from 'vue-i18n';
import { isRtlLocale } from '~/utils/localePlentyMap';

/**
 * Applies RTL document direction and Arabic-friendly font when the Arabic locale is active.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as Composer;

  const applyDocumentDirection = () => {
    const rtl = isRtlLocale(i18n.locale.value);
    const html = document.documentElement;

    html.lang = i18n.locale.value;
    html.dir = rtl ? 'rtl' : 'ltr';
    document.body.classList.toggle('locale-ar', rtl);

    const fontId = 'noto-sans-arabic-font';
    const existing = document.getElementById(fontId);

    if (rtl && !existing) {
      const link = document.createElement('link');
      link.id = fontId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;700&display=swap';
      document.head.appendChild(link);
    } else if (!rtl && existing) {
      existing.remove();
    }
  };

  nuxtApp.hook('app:mounted', () => {
    applyDocumentDirection();
    watch(() => i18n.locale.value, applyDocumentDirection);
  });
});
