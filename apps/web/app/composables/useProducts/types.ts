import type { Facet, FacetSearchCriteria, FilterGroup, Product } from '@plentymarkets/shop-api';

export interface UseProductsState {
  data: Facet;
  baseFacets: FilterGroup[];
  rawFacets: FilterGroup[];
  loading: boolean;
  productsPerPage: number;
  currentProduct: Product;
}

export type FetchProducts = (params: FacetSearchCriteria) => Promise<Facet>;
export type SetCurrentProduct = (product: Product) => void;

export interface UseProducts {
  data: Readonly<Ref<UseProductsState['data']>>;
  rawFacets: Readonly<Ref<UseProductsState['rawFacets']>>;
  loading: Readonly<Ref<boolean>>;
  productsPerPage: Readonly<Ref<number>>;
  currentProduct: Readonly<Ref<UseProductsState['currentProduct']>>;
  fetchProducts: FetchProducts;
  setCurrentProduct: SetCurrentProduct;
  isGlobalProductCategoryTemplate: Readonly<Ref<boolean>>;
}

export type UseProductsReturn = (category?: string) => UseProducts;
