export interface PromoCardContent {
  title: string;
  link: string;
  image: string;
  alt: string;
  height: string;
}

export interface PromoCardProps {
  content: PromoCardContent;
}