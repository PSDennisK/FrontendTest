export type Filter = {
  id: string;
  name: string;
  key: string;
  filterType: FilterType;
  showInitially: boolean;
  results: number;
  options: FilterOption[];
  values?: number[];
  itemBetween?: ItemBetween[];
};

export type FilterOption = {
  id: number;
  name: string;
  count?: number;
};

export enum FilterType {
  Checkbox = 'Checkbox',
  Slider = 'Slider',
}

export type FilterResult = {
  key: string;
  id: number;
  results: number;
};

export type ItemBetween = {
  id: number;
  minimal: number;
  maximum: number;
};

export type SearchParams = {
  keyword: string;
  filters: SearchFilterFilter[];
  pageIndex: number;
  pageSize: number;
};

export type SearchResult = {
  results: number;
  products: SearchProduct[];
  filters: FilterResult[]; //Filter[];
  showSubFilters: string[];
  voedingswaardes: Voedingswaarde[];
};

export type SearchFilter = {
  keyword: string;
  filters: SearchFilterFilter[];
  pageIndex: number;
  pageSize: number;
};

export type SearchFilterFilter = {
  key: string;
  values?: number[];
  itemBetween?: ItemBetween[];
};

export type SearchProduct = {
  id: number;
  name: string;
  image: string;
  brand: string;
  gtin: string;
};

export type Suggestions = {
  products: ProductSuggestion[];
  brands: BrandSuggestion[];
  producers: ProducerSuggestion[];
  wholesalers: WholesalerSuggestion[];
};

export type ProductSuggestion = {
  id: number;
  name: string;
};

export type BrandSuggestion = {
  id: number;
  name: string;
};

export type ProducerSuggestion = {
  id: number;
  name: string;
};

export type WholesalerSuggestion = {
  id: number;
  name: string;
  artikelnummer: string;
};

export type Voedingswaarde = {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
  currentValue: number;
};
