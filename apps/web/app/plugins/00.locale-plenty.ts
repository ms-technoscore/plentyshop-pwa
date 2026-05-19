import type { Composer } from 'vue-i18n';
import { getPlentyApiLocale, getPlentyTextSlot } from '~/utils/localePlentyMap';

/**
 * Keeps legacy vsf-locale cookie in sync with the Plenty text slot (ar → pt).
 */
export default defineNuxtPlugin((nuxtApp) => {
  const i18n = nuxtApp.$i18n as Composer;
  const vsfLocale = useCookie('vsf-locale');

  const syncPlentyLocale = () => {
    vsfLocale.value = getPlentyTextSlot(i18n.locale.value);
  };

  syncPlentyLocale();

  if (import.meta.client) {
    watch(() => i18n.locale.value, syncPlentyLocale);
  }
});
