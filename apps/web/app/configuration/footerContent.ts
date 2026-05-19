import type { FooterContent } from '~/components/blocks/Footer/types';

/** Column title that triggers the dynamic category tree instead of static links. */
export const FOOTER_SHOP_COLUMN_TITLES = new Set(['Im Shop', 'في المتجر']);

export const isFooterShopColumn = (title?: string): boolean => !!title && FOOTER_SHOP_COLUMN_TITLES.has(title);

const footerContentDe: FooterContent = {
  backgroundColor: '#333333',
  textColor: '#ffffff',
  columns: [
    {
      id: 'col-1',
      image: 'https://cdn03.plentymarkets.com/evlxcyoplb75/frontend/Logo_KK_dp_25K.png',
      title: 'Komplett Konzept Verwertungs GmbH',
      links: [
        { text: 'Über uns', url: '/ueberuns' },
        { text: 'Abbau und Demontage', url: '/abbau-und-demontage' },
        { text: 'Reparatur und Instandsetzung', url: '/reparatur-und-instandhaltung' },
        { text: 'Team', url: '/team' },
        { text: 'Stellenangebote', url: '/Stellenangebote' },
        { text: 'Partner', url: '/partner' },
        { text: 'Kontakt', url: '/Kontakt' },
        { text: 'Impressum', url: '/impressum' },
        { text: 'Warenankauf', url: 'http://www.waren-ankauf.de/' },
      ],
      socials: [
        { icon: 'facebook', url: 'https://www.facebook.com/Komplett.Konzept.GmbH/' },
        { icon: 'instagram', url: 'https://www.instagram.com/komplettkonzept/' },
        { icon: 'youtube', url: 'https://www.youtube.com/@konzeptkomplett4034' },
        { icon: 'linkedin', url: 'https://www.linkedin.com/in/mario-parlitz-77b66239/' },
      ],
    },
    {
      id: 'col-2',
      image: 'https://cdn03.plentymarkets.com/evlxcyoplb75/frontend/Bezahlarten.png',
      title: 'Zahlung und Versand',
      links: [
        { text: 'Widerrufsrecht', url: '/widerruf' },
        { text: 'Datenschutzerklärung', url: '/datenschutz' },
        { text: 'Datenverarbeitung', url: '/datenverarbeitung' },
        { text: 'AGB', url: '/agb' },
      ],
    },
    {
      id: 'col-3',
      title: 'Im Shop',
      links: [],
    },
  ],
  footnote: '© Copyright 2024 Komplett Konzept Verwertungs GmbH. All rights reserved.',
};

const footerContentAr: FooterContent = {
  backgroundColor: '#333333',
  textColor: '#ffffff',
  columns: [
    {
      id: 'col-1',
      image: 'https://cdn03.plentymarkets.com/evlxcyoplb75/frontend/Logo_KK_dp_25K.png',
      title: 'Komplett Konzept Verwertungs GmbH',
      links: [
        { text: 'من نحن', url: '/ueberuns' },
        { text: 'التفكيك والإزالة', url: '/abbau-und-demontage' },
        { text: 'الإصلاح والصيانة', url: '/reparatur-und-instandhaltung' },
        { text: 'الفريق', url: '/team' },
        { text: 'الوظائف الشاغرة', url: '/Stellenangebote' },
        { text: 'الشركاء', url: '/partner' },
        { text: 'اتصل بنا', url: '/Kontakt' },
        { text: 'البيانات القانونية', url: '/impressum' },
        { text: 'شراء البضائع', url: 'http://www.waren-ankauf.de/' },
      ],
      socials: [
        { icon: 'facebook', url: 'https://www.facebook.com/Komplett.Konzept.GmbH/' },
        { icon: 'instagram', url: 'https://www.instagram.com/komplettkonzept/' },
        { icon: 'youtube', url: 'https://www.youtube.com/@konzeptkomplett4034' },
        { icon: 'linkedin', url: 'https://www.linkedin.com/in/mario-parlitz-77b66239/' },
      ],
    },
    {
      id: 'col-2',
      image: 'https://cdn03.plentymarkets.com/evlxcyoplb75/frontend/Bezahlarten.png',
      title: 'الدفع والشحن',
      links: [
        { text: 'حق الإلغاء', url: '/widerruf' },
        { text: 'سياسة الخصوصية', url: '/datenschutz' },
        { text: 'معالجة البيانات', url: '/datenverarbeitung' },
        { text: 'الشروط والأحكام العامة', url: '/agb' },
      ],
    },
    {
      id: 'col-3',
      title: 'في المتجر',
      links: [],
    },
  ],
  footnote: '© حقوق النشر 2024 Komplett Konzept Verwertungs GmbH. جميع الحقوق محفوظة.',
};

const footerByLocale: Record<string, FooterContent> = {
  de: footerContentDe,
  ar: footerContentAr,
};

export const getFooterContent = (locale: string): FooterContent =>
  footerByLocale[locale] ?? footerByLocale.de ?? footerContentDe;
