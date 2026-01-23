<template>
  <div class="google-translate-wrapper">
    <div id="google_translate_element"/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  window.googleTranslateElementInit = () => {
    if (window.google && window.google.translate && window.google.translate.TranslateElement) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'de', // Your site's default language
          // LIMIT LANGUAGES HERE: Comma separated codes
          includedLanguages: 'ar,zh-CN,zh-TW,hr,nl,en,fr,de,hi,it,pl,pt,ru,es,sv,tr', 
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    }
  };

  const scriptId = 'google-translate-script';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  } else if (window.google && window.google.translate) {
    window.googleTranslateElementInit();
  }
});
</script>

<style>
/* 1. HIDE GOOGLE BRANDING & EXTRA TEXT */
.goog-logo-link {
    display: none !important;
}
.goog-te-gadget {
    color: transparent !important;
    font-size: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* 2. STYLE THE DROPDOWN MENU */
.goog-te-gadget .goog-te-combo {
    color: #062633 !important;
    background-color: transparent !important;
    border: 1px solid transparent !important;
    font-size: 14px !important;
    font-weight: 500 !important;
    padding: 4px 0 !important;
    margin: 0 !important;
    cursor: pointer !important;
    outline: none !important;
    vertical-align: middle !important;
}

/* 3. OPTIONAL: Hover effect */
.goog-te-gadget .goog-te-combo:hover {
    color: #0284c7 !important;
}

/* 4. HIDE TOP BANNER */
.goog-te-banner-frame {
    display: none !important;
}
body {
    top: 0px !important; 
}
.goog-te-gadget img{
    display: none !important;
}
</style>