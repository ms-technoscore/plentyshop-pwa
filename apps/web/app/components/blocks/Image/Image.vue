<template>
  <div class="relative w-full flex justify-center" :style="wrapperStyle" data-testid="image-block">
    <component
      :is="linkTag"
      v-if="hasImage"
      :to="linkTarget"
      :aria-label="ariaLabel"
      v-bind="isExternalLink(linkTarget) ? { target: '_blank', rel: 'noopener' } : {}"
      data-testid="image-link"
      class="w-full h-full"
    >
      <NuxtImg
        :src="getImageUrl()"
        :alt="props.content.image.alt"
        class="w-full h-full"
        :class="[
          imageClasses,
          props.content.image.fillMode === 'fit' ? 'object-contain' : 'object-cover'
        ]"
        :style="{
          display: 'block',
          filter:
            props.content.image.brightness !== null && props.content.image.brightness !== undefined
              ? `brightness(${props.content.image.brightness})`
              : '',
          ...imageInlineStyle,
        }"
        :width="getImageDimensions().width"
        :height="getImageDimensions().height"
        data-testid="image-block-image"
      />
    </component>

    <div
      v-if="props.content?.text?.textOverlay || props.content?.button.label"
      class="absolute inset-0 px-4 pointer-events-none flex flex-col"
      :class="overlayAlignClasses"
      :style="{ color: props.content.text?.textOverlayColor || '#000' }"
      data-testid="image-overlay-text"
    >
      <div v-html="props.content.text.textOverlay" />
      <UiButton
        v-if="props.content?.button.label"
        class="cursor-pointer pointer-events-auto"
        :tag="NuxtLink"
        :to="localePath(props.content.button.link ?? '')"
        :variant="props.content.button.variant ?? 'primary'"
        size="lg"
        :data-testid="'image-button-' + (meta?.uuid ?? '')"
        v-bind="isExternalLink(props.content.button.link) ? { target: '_blank', rel: 'noopener' } : {}"
      >
        {{ props.content.button.label }}
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageProps, ImageDimensions } from './types';

const viewport = useViewport();
const NuxtLink = resolveComponent('NuxtLink');
const localePath = useLocalePath();
const { getBlockDepth } = useBlockManager();

const props = defineProps<ImageProps>();

const hasImage = computed(() => !!props.content?.image);
const linkTarget = computed(() =>
  props.content?.image?.linktarget?.trim() ? localePath(props.content.image.linktarget) : undefined,
);
const linkTag = computed(() => (linkTarget.value ? NuxtLink : 'div'));
const ariaLabel = computed(() => props.content?.image?.alt || 'Image link');

const isExternalLink = (link: string | undefined) => !!link && /^(https?:)?\/\//.test(link);

const depth = getBlockDepth(props.meta.uuid);

// Logic to determine if we are using 'auto' height or fixed/ratio height
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isAutoHeight = computed(() => {
  const h = props.content?.image?.height;
  return h === 'auto' || !h; // Default to auto if empty? Or default to aspect ratio? 
  // Let's stick to: if it's explicitly 'auto', do auto. If empty, fallback to ratio.
});

const wrapperStyle = computed(() => {
  const userHeight = props.content?.image?.height;

  // 1. If inside a nested block (depth > 0), force a fixed height
  if (depth > 0) {
    return { position: 'relative' as const, height: '24rem' };
  }

  // 2. If user set 'auto', let content dictate height (no fixed height on wrapper)
  if (userHeight === 'auto') {
    return { position: 'relative' as const, height: 'auto' };
  }

  // 3. If user set a specific height (e.g. '500px' or '50vh')
  if (userHeight && userHeight.trim() !== '') {
    // If user just typed "500", append "px". If "500px", keep it.
    const finalHeight = /^\d+$/.test(userHeight) ? `${userHeight}px` : userHeight;
    return { position: 'relative' as const, height: finalHeight };
  }

  // 4. Fallback: Default Aspect Ratio (Old behavior) if input is empty
  return {
    aspectRatio: '16 / 9',
    position: 'relative' as const,
  };
});

// If height is 'auto', image is relative. If height is fixed, image is absolute to fill the fixed box.
const imageClasses = computed(() => {
  const h = props.content?.image?.height;
  if (h === 'auto') return 'relative';
  // If specific height or empty (fallback to ratio), use absolute to fill the container
  return 'absolute inset-0'; 
});

const getImageUrl = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return props.content?.image?.wideScreen;
    }
    case 'lg': {
      return props.content?.image?.desktop;
    }
    case 'md': {
      return props.content?.image?.tablet;
    }
    default: {
      return props.content?.image?.mobile;
    }
  }
};
const overlayAlignClasses = computed(() => {
  const vertical =
    props.content?.text.textOverlayAlignY === 'top'
      ? 'items-start'
      : props.content?.text.textOverlayAlignY === 'bottom'
        ? 'items-end'
        : 'items-center';

  const horizontal =
    props.content?.text.textOverlayAlignX === 'left'
      ? 'justify-start text-left'
      : props.content?.text.textOverlayAlignX === 'right'
        ? 'justify-end text-right'
        : 'justify-center text-center';

  return [vertical, horizontal];
});
const getImageDimensions = (): ImageDimensions => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return { width: 696, height: 392 };
    }
    case 'lg': {
      return { width: 712, height: 474 };
    }
    case 'md': {
      return { width: 757, height: 483 };
    }
    default: {
      return { width: 320, height: 320 };
    }
  }
};

const imageInlineStyle = computed(() => {
  const layout = props.content.layout ?? {};
  return {
    paddingTop: `${layout.paddingTop ?? 0}px`,
    paddingBottom: `${layout.paddingBottom ?? 0}px`,
    paddingLeft: `${layout.paddingLeft ?? 0}px`,
    paddingRight: `${layout.paddingRight ?? 0}px`,
    backgroundColor: layout.backgroundColor ?? 'transparent',
  };
});
</script>