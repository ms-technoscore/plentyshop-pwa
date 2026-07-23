import { createVNode, render, type AppContext } from 'vue';
import GoogleMapsConsent from '~/components/GoogleMapsConsent/GoogleMapsConsent.vue';
import { googleMapsKontaktEmbedUrl } from '~/configuration/googleMapsConsent.config';

export const LIVE_MAP_MOUNT_ATTR = 'data-live-map-mount';
export const LIVE_MAP_ROOT_ATTR = 'data-live-map-root';

/**
 * Replace dead CMS-captured GoogleMapsConsent markup (no Vue handlers) with a live component,
 * without changing the surrounding HTML layout.
 */
export const hydrateGoogleMapsConsentWidgets = (root: HTMLElement, appContext: AppContext) => {
  const deadWidgets = root.querySelectorAll<HTMLElement>(
    `[data-testid="google-maps-consent"]:not([${LIVE_MAP_ROOT_ATTR}])`,
  );

  for (const dead of deadWidgets) {
    if (dead.closest(`[${LIVE_MAP_MOUNT_ATTR}]`)) continue;

    const mountPoint = document.createElement('div');
    mountPoint.className = 'block w-full min-w-0';
    mountPoint.setAttribute(LIVE_MAP_MOUNT_ATTR, '1');
    dead.replaceWith(mountPoint);

    const vnode = createVNode(GoogleMapsConsent, {
      embedUrl: googleMapsKontaktEmbedUrl,
      width: '600',
      height: '450',
    });
    vnode.appContext = appContext;
    render(vnode, mountPoint);
  }
};

export const unmountGoogleMapsConsentWidgets = (root: HTMLElement) => {
  root.querySelectorAll<HTMLElement>(`[${LIVE_MAP_MOUNT_ATTR}]`).forEach((mountPoint) => {
    render(null, mountPoint);
  });
};
