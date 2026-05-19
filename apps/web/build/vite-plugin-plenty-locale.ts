import type { Plugin } from 'vite';
import { resolve } from 'pathe';

/**
 * Patches shop-core useSdk to send a storefront-active Plenty locale (ar/pt → de for catalog).
 */
export const plentyLocaleSdkPlugin = (rootDir: string): Plugin => ({
  name: 'plenty-locale-sdk',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('@plentymarkets/shop-core') || !id.endsWith('useSdk.js')) {
      return;
    }

    if (!code.includes('const locale = $i18n.locale.value')) {
      return;
    }

    const mapImport = resolve(rootDir, 'app/utils/localePlentyMap.ts');

    return {
      code: `import { getPlentyApiLocale } from ${JSON.stringify(mapImport)};\n${code.replace(
        'const locale = $i18n.locale.value',
        'const locale = getPlentyApiLocale($i18n.locale.value)',
      )}`,
      map: null,
    };
  },
});
