export type IconTextProps = {
  icon?: {
    url: string;
    alt?: string;
  };
  text?: {
    content: string;
    color: string;
    fontSize: string;
  };
  layout?: {
    gap: string;
    iconWidth: string;
  };
};