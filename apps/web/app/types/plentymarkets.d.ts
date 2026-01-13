import '@plentymarkets/shop-api';

declare module '@plentymarkets/shop-api' {
  export interface NewsletterParams {
    extraFields?: Record<string, string>;
  }
}
