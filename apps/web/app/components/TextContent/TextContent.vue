<template>
  <div
    :data-testid="props.testId ? 'text-content-' + props.testId : 'text-content'"
    :style="{ color: props.text?.color }"
    :class="['w-full min-w-0', 'flex flex-col items-stretch space-y-4', textAlignmentClass]"
  >
    <div v-if="text?.pretitle" data-testid="text-pretitle" class="text-xl font-bold mb-2" v-html="text.pretitle" />

    <h1
      v-if="text?.title && index === 0"
      data-testid="text-title"
      class="typography-display-3 md:typography-display-2 lg:typography-display-1 font-bold my-2 lg:leading-[4rem]"
      v-html="text.title"
    />

    <h2
      v-if="text?.title && index !== 0"
      data-testid="text-title"
      class="text-2xl font-semibold mb-4"
      v-html="text.title"
    />

    <div v-if="text?.subtitle" data-testid="text-subtitle" class="text-lg font-semibold" v-html="text.subtitle" />

    <!-- Google Maps embeds are split out so the consent overlay can wrap them. -->
    <template v-if="containsMapEmbed">
      <template v-for="(segment, segmentIndex) in htmlSegments" :key="segmentIndex">
        <div
          v-if="segment.type === 'html' && segment.content"
          ref="rteSegmentRefs"
          data-testid="text-html"
          class="rte-prose rte-prose--render"
          :class="`rte-prose--${props.text?.textAlignment ?? 'left'}`"
          v-html="segment.content"
        />
        <div v-else-if="segment.type === 'map'" class="block w-full min-w-0">
          <GoogleMapsConsent
            :embed-url="segment.embedUrl"
            :preview-url="segment.previewUrl"
            :width="segment.width"
            :height="segment.height"
          />
        </div>
      </template>
    </template>
    <div
      v-else-if="props.text?.htmlDescription"
      ref="rteHtmlRef"
      class="rte-prose rte-prose--render"
      :data-testid="props.testId ? 'text-html-' + props.testId : 'text-html'"
      :class="`rte-prose--${props.text?.textAlignment ?? 'left'}`"
      @click="handleRteClick"
      v-html="renderedHtmlDescription"
    />

    <UiButton
      v-if="props.button?.label && props.button?.link"
      :tag="NuxtLink"
      :to="localePath(props.button.link)"
      :variant="props.button.variant ?? 'primary'"
      :data-testid="props.testId ? 'text-button-' + props.testId : 'text-button'"
      class="mt-3 px-4 py-2 cursor-pointer"
    >
      {{ props.button.label }}
    </UiButton>
  </div>
</template>

<script setup lang="ts">
import GoogleMapsConsent from '~/components/GoogleMapsConsent/GoogleMapsConsent.vue';
import type { TextContentProps } from '~/components/TextContent/types';
import { decodeHtmlEntities } from '~/utils/decodeHtmlEntities';
import {
  hydrateGoogleMapsConsentWidgets,
  unmountGoogleMapsConsentWidgets,
} from '~/utils/hydrateGoogleMapsConsent';
import { hasStaticGoogleMapsConsent, parseGoogleMapsHtml } from '~/utils/parseGoogleMapsHtml';
import { isInternalLink } from '~/utils/urlHelper';

const props = defineProps<TextContentProps>();

const htmlSegments = computed(() => {
  const html = props.text?.htmlDescription;
  if (!html) return [];
  return parseGoogleMapsHtml(html);
});

const containsMapEmbed = computed(() => htmlSegments.value.some((segment) => segment.type === 'map'));

const localePath = useLocalePath();
const router = useRouter();
const NuxtLink = resolveComponent('NuxtLink');
const instance = getCurrentInstance();

const rteHtmlRef = ref<HTMLElement | null>(null);
const rteSegmentRefs = ref<HTMLElement[] | HTMLElement | null>(null);

const renderedHtmlDescription = computed(() => {
  const html = decodeHtmlEntities(props.text?.htmlDescription);
  if (!html) return '';

  return html.replace(
    /<a\b([^>]*?)href=(["'])([^"']*?)\2/gi,
    (match: string, before: string, quote: string, href: string) => {
      if (isInternalLink(href, router)) {
        return `<a${before}href=${quote}${localePath(href)}${quote}`;
      }
      return match;
    },
  );
});

const handleRteClick = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return;

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const anchor = target.closest('a') as HTMLAnchorElement | null;
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href || !isInternalLink(href, router)) return;
  if (anchor.target && anchor.target !== '_self') return;

  event.preventDefault();
  router.push(href);
};

const textAlignmentClass = computed(() => {
  switch (props.text?.textAlignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
});

const rteRoots = (): HTMLElement[] => {
  const roots: HTMLElement[] = [];
  if (rteHtmlRef.value) roots.push(rteHtmlRef.value);

  const segments = rteSegmentRefs.value;
  if (Array.isArray(segments)) {
    roots.push(...segments.filter(Boolean));
  } else if (segments) {
    roots.push(segments);
  }

  return roots;
};

const hydrateDeadMapWidgets = () => {
  if (!import.meta.client || !instance?.appContext) return;

  const html = props.text?.htmlDescription;
  if (!hasStaticGoogleMapsConsent(html)) return;

  for (const root of rteRoots()) {
    hydrateGoogleMapsConsentWidgets(root, instance.appContext);
  }
};

onMounted(() => {
  nextTick(hydrateDeadMapWidgets);
});

onUpdated(() => {
  nextTick(hydrateDeadMapWidgets);
});

onBeforeUnmount(() => {
  for (const root of rteRoots()) {
    unmountGoogleMapsConsentWidgets(root);
  }
});
</script>
