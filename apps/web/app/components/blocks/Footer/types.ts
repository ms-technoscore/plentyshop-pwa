import type { Block } from '@plentymarkets/shop-api';
import type { Ref } from 'vue';

export type FooterProps = {
  content?: FooterSettings;
};

export interface FooterSwitchDefinition {
  columnGroup: 'legal' | 'services';
  key: string;
  shopTranslationKey: string;
  editorTranslationKey: string;
  link: string;
}

export interface FooterSettingsColumn {
  title: string;
  description?: string;
  showContactLink?: boolean;
  showRegisterLink?: boolean;
  showTermsAndConditions?: boolean;
  showCancellationRights?: boolean;
  showCancellationForm?: boolean;
  showLegalDisclosure?: boolean;
  showPrivacyPolicy?: boolean;
  showDeclarationOfAccessibility?: boolean;
  [key: string]: string | boolean | undefined;
}

export interface FooterSettingsColors {
  background: string;
  text: string;
  footnoteBackground: string;
  footnoteText: string;
}

export interface FooterSettings {
  meta: {
    uuid: string;
    isGlobalTemplate?: boolean;
  };
  column1: FooterSettingsColumn;
  column2: FooterSettingsColumn;
  column3: FooterSettingsColumn;
  column4: FooterSettingsColumn;
  footnote: string;
  footnoteAlign: 'left' | 'center' | 'right';
  colors: FooterSettingsColors;
}

// --- Single Link Item ---
export interface FooterLinkItem {
  text: string;
  url: string;
  target?: '_self' | '_blank';
}

// --- Social Icon Item ---
export interface SocialIconItem {
  icon: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'pinterest';
  url: string;
}

// --- Generic Column Structure ---
export interface FooterColumn {
  id: string;
  title?: string;       // Optional header for the column
  image?: string;       // Optional logo or payment icons image
  imageWidth?: string;  // e.g. "150px" or "100%"
  content?: string;     // HTML description text
  links?: FooterLinkItem[]; // List of links
  socials?: SocialIconItem[]; // List of social icons
}

// --- Main Footer Content ---
export interface FooterContent {
  columns: FooterColumn[]; // Dynamic array of columns
  backgroundColor?: string;
  textColor?: string;
  footnote?: string; // Bottom copyright text
}

// --- Helper Types for the System ---
type AddFooterBlockOptions = {
  data: Ref<Block[]>;
  cachedFooter: Ref<unknown>;
  cleanData?: Ref<Block[]>;
};


export type AddFooterBlock = (options: AddFooterBlockOptions) => void;
