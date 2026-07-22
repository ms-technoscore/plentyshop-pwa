<template>
  <div
    data-testid="text-card"
    :class="[
      'w-full',
      'flex',
      'flex-col',
      'items-stretch',
      'space-y-4',
      textAlignmentClass,
      containsGoogleMapsEmbed ? 'text-card--map-bleed max-lg:!pl-0 max-lg:!pr-0' : '',
      // Match MegaMenu / NarrowContainer gutters when CMS leaves horizontal padding at 0
      !containsGoogleMapsEmbed && !hasExplicitHorizontalPadding ? 'px-4 md:px-5 lg:px-5' : '',
    ]"
    :style="inlineStyle"
  >
    <TextContent :text="props.content.text" :button="props.content.button" :index="props.index" />
  </div>
</template>

<script setup lang="ts">
import type { TextCardProps } from './types';
import { hasGoogleMapsEmbed as htmlHasGoogleMapsEmbed } from '~/utils/parseGoogleMapsHtml';

const props = defineProps<TextCardProps>();

const containsGoogleMapsEmbed = computed(() => htmlHasGoogleMapsEmbed(props.content.text?.htmlDescription));

const toPositivePaddingPx = (value: unknown): number => {
  if (value === undefined || value === null || value === '') return 0;
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
};

const hasExplicitHorizontalPadding = computed(() => {
  const layout = props.content.layout || {};
  return toPositivePaddingPx(layout.paddingLeft) > 0 || toPositivePaddingPx(layout.paddingRight) > 0;
});

const textAlignmentClass = computed(() => {
  switch (props.content.text?.textAlignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
});
const inlineStyle = computed(() => {
  const layout = props.content.layout || {};

  const style: Record<string, string | number> = {
    backgroundColor: layout.backgroundColor ?? 'transparent',
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
  };

  const paddingLeft = toPositivePaddingPx(layout.paddingLeft);
  const paddingRight = toPositivePaddingPx(layout.paddingRight);

  if (containsGoogleMapsEmbed.value) {
    style['--text-card-pl'] = paddingLeft ? `${paddingLeft}px` : '0px';
    style['--text-card-pr'] = paddingRight ? `${paddingRight}px` : '0px';
    return style;
  }

  // Only inline CMS horizontal padding when set; otherwise Tailwind gutters above apply.
  if (paddingLeft) style.paddingLeft = `${paddingLeft}px`;
  if (paddingRight) style.paddingRight = `${paddingRight}px`;

  return style;
});
</script>

<style scoped>
@media (max-width: 1023px) {
  [data-testid='text-card'].text-card--map-bleed {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

@media (min-width: 1024px) {
  [data-testid='text-card'].text-card--map-bleed {
    padding-left: var(--text-card-pl, 0);
    padding-right: var(--text-card-pr, 0);
  }
}
</style>
