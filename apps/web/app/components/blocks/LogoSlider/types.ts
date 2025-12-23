export interface LogoItem {
  image: string;
  alt?: string;
  link?: string;
}

export interface LogoSliderContent {
  title?: string;
  itemsPerPageDesktop: number;
  itemsPerPageTablet: number;
  itemsPerPageMobile: number;
  items: LogoItem[];
}

export interface LogoSliderProps {
  content: LogoSliderContent;
}