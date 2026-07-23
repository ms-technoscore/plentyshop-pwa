<template>
  <div class="google-translate-wrapper">
    <div id="google_translate_element" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from '#imports';

type GoogleTranslateElementOptions = {
  pageLanguage: string;
  includedLanguages: string;
  autoDisplay: boolean;
};

type GoogleTranslateConstructor = new (
  options: GoogleTranslateElementOptions,
  elementId: string,
) => unknown;

type GoogleTranslateWindow = Window & typeof globalThis & {
  googleTranslateElementInit?: () => void;
  google?: typeof globalThis.google & {
    translate?: {
      TranslateElement: GoogleTranslateConstructor;
    };
  };
};

const route = useRoute();
const { locale } = useI18n();

const GOOGLE_TRANSLATE_LOCALE_MAP: Record<string, string> = {
  cn: 'zh-CN',
  nn: 'ar',
};

/** Languages shown in the Google Translate dropdown. */
const INCLUDED_LANGUAGES = [
  'de', // German
  'en', // English
  'es', // Spanish
  'pt', // Portuguese
  'ru', // Russian
  'nl', // Dutch
  'pl', // Polish
  'da', // Danish
  'fr', // French
  'it', // Italian
  'cs', // Czech
  'zh-CN', // Chinese
  'ar', // Arabic
].join(',');

const getGoogleTranslatePageLanguage = () => GOOGLE_TRANSLATE_LOCALE_MAP[locale.value] ?? locale.value;

const loadGoogleTranslate = async () => {
  const translateWindow = window as GoogleTranslateWindow;

  // 1. Wait for Vue to finish its page-transition DOM updates
  await nextTick();

  // 2. Empty our target container so Vue stops fighting it
  const container = document.getElementById('google_translate_element');
  if (container) {
    container.innerHTML = '';
  }

  // 3. NUKE: Remove the old script and hidden iframes Google leaves behind
  const oldScript = document.getElementById('google-translate-script');
  if (oldScript) oldScript.remove();
  
  document.querySelectorAll('.goog-te-menu-frame').forEach((el) => el.remove());

  // 4. NUKE: Delete the global translate object so Google is forced to start fresh
  if (translateWindow.google?.translate) {
    delete translateWindow.google.translate;
  }

  // 5. Define the initialization callback
  translateWindow.googleTranslateElementInit = () => {
    const TranslateElement = translateWindow.google?.translate?.TranslateElement;
    if (!TranslateElement) return;

    new TranslateElement(
      {
        pageLanguage: getGoogleTranslatePageLanguage(),
        includedLanguages: INCLUDED_LANGUAGES,
        autoDisplay: false,
      },
      'google_translate_element'
    );
  };

  // 6. Inject the brand new script
  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.body.appendChild(script);
};

onMounted(() => {
  // Initial load
  setTimeout(() => {
    loadGoogleTranslate();
  }, 100);
});

// The SPA Fix: Run the nuke and rebuild process on every single page change!
watch(() => route.path, () => {
  setTimeout(() => {
    loadGoogleTranslate();
  }, 200); // A 200ms delay ensures Vue's virtual DOM is completely done moving things around
});

watch(
  () => locale.value,
  () => {
    setTimeout(() => {
      loadGoogleTranslate();
    }, 200);
  },
);
</script>

<style>
/* 1. HIDE GOOGLE BRANDING & EXTRA TEXT */
.goog-logo-link,
.goog-te-gadget span,
.goog-te-gadget > div > a {
    display: none !important;
}

.goog-te-gadget {
    color: transparent !important;
    font-size: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    line-height: 0 !important;
    white-space: nowrap !important;
}

/* 2. STYLE THE DROPDOWN MENU TO MATCH THE PREVIOUS UI */
.goog-te-gadget .goog-te-combo {
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    width: 126px !important;
    max-width: 126px !important;
    height: 28px !important;
    color: #111827 !important;
    background-color: #ffffff !important;
    background-image:
      linear-gradient(45deg, transparent 50%, #6b7280 50%),
      linear-gradient(135deg, #6b7280 50%, transparent 50%),
      linear-gradient(to right, #d1d5db, #d1d5db) !important;
    background-position:
      calc(100% - 12px) calc(50% - 3px),
      calc(100% - 6px) calc(50% - 3px),
      calc(100% - 1.45rem) 50% !important;
    background-size: 5px 5px, 5px 5px, 1px 58% !important;
    background-repeat: no-repeat !important;
    border: 1px solid #d1d5db !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    font-size: 12px !important;
    font-weight: 500 !important;
    line-height: 1 !important;
    padding: 0 1.55rem 0 6px !important;
    margin: 0 !important;
    cursor: pointer !important;
    outline: none !important;
    vertical-align: middle !important;
    text-overflow: clip !important;
}

.goog-te-gadget .goog-te-combo:hover,
.goog-te-gadget .goog-te-combo:focus {
    border-color: #9ca3af !important;
}

/* 4. HIDE TOP BANNER & LAYOUT-BREAKING IFRAMES */
.goog-te-banner-frame,
iframe.goog-te-banner-frame,
body > .skiptranslate {
    display: none !important;
}

.goog-te-gadget img {
    display: none !important;
}

.google-translate-wrapper {
    max-width: 100%;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    line-height: 1;
}
</style>