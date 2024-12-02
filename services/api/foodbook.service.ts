import API_CONFIG from '@/app/constants/foodbook';
import {apiHandler, imageHandler} from '@/lib/api/foodbook';
import {SearchCache} from '@/lib/cache/search';
import {
  Brand,
  Culture,
  Filter,
  LatestProduct,
  Producer,
  Product,
  SearchParams,
  SearchResult,
} from '@/types';

export class FoodbookService {
  fetchBrands = async (): Promise<Brand[]> => {
    try {
      return await apiHandler('BRAND.ALL', {}, {next: {revalidate: 60}});
    } catch (error) {
      console.error('Error in fetchBrands:', error);
      throw error;
    }
  };

  fetchBrandById = async (brandid: string): Promise<Brand> => {
    try {
      return apiHandler('BRAND.INFO', {brandid}, {next: {revalidate: 60}});
    } catch (error) {
      console.error('Error in fetchBrandById:', error);
      throw error;
    }
  };

  fetchProducers = async (): Promise<Producer[]> => {
    try {
      return await apiHandler('PRODUCER.ALL', {}, {next: {revalidate: 60}});
    } catch (error) {
      console.error('Error in fetchProducers:', error);
      throw error;
    }
  };

  fetchProducerById = async (producerid: string): Promise<Producer> => {
    try {
      return apiHandler(
        'PRODUCER.INFO',
        {producerid},
        {next: {revalidate: 60}},
      );
    } catch (error) {
      console.error('Error in fetchProducerById:', error);
      throw error;
    }
  };

  fetchProducts = async (): Promise<Product[]> => {
    try {
      return await apiHandler('PRODUCT.ALL', {}, {next: {revalidate: 60}});
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      throw error;
    }
  };

  fetchProductById = async (packagedproductid: string): Promise<Product> => {
    try {
      return apiHandler(
        'PRODUCT.INFO',
        {packagedproductid},
        {next: {revalidate: 60}},
      );
    } catch (error) {
      console.error('Error in fetchProductById:', error);
      throw error;
    }
  };

  fetchLatestProducts = async (): Promise<LatestProduct[]> => {
    try {
      return await apiHandler(
        'PRODUCT.LASTADDED',
        {},
        {next: {revalidate: 60}},
      );
    } catch (error) {
      console.error('Error in fetchLatestProducts:', error);
      throw error;
    }
  };

  fetchAutocomplete = async (
    keyword: string,
    locale: keyof typeof Culture = API_CONFIG.DEFAULT_LOCALE,
  ): Promise<any> => {
    try {
      const mappedLocale =
        API_CONFIG.LOCALE_MAP[locale] ||
        API_CONFIG.LOCALE_MAP[API_CONFIG.DEFAULT_LOCALE];

      // Check cache first
      const cachedResult = SearchCache.get(keyword, mappedLocale);
      if (cachedResult) {
        return cachedResult;
      }

      // Fetch from API if not in cache
      const result = await apiHandler(
        'SEARCH.AUTOCOMPLETE',
        {keyword, locale: mappedLocale},
        {
          next: {revalidate: 60},
        },
      );

      // Store in cache
      SearchCache.set(keyword, mappedLocale, result);

      return result;
    } catch (error) {
      console.error('Error in fetchAutocomplete:', error);
      throw error;
    }
  };

  fetchProductByEan = async (eancode: string): Promise<SearchResult> => {
    try {
      return apiHandler('SEARCH.BYEAN', {eancode}, {next: {revalidate: 60}});
    } catch (error) {
      console.error('Error in fetchProductByEan:', error);
      throw error;
    }
  };

  fetchSearchResult = async (params: SearchParams): Promise<SearchResult> => {
    try {
      return await apiHandler(
        'SEARCH.RESULTS',
        {},
        {
          method: 'POST',
          body: params,
          next: {revalidate: 60},
        },
      );
    } catch (error) {
      console.error('Error in fetchSearchResult:', error);
      // Log meer details over de error
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
        });
      }
      throw error;
    }
  };

  fetchFilters = async (): Promise<Filter[]> => {
    try {
      return await apiHandler('FILTER.LIST', {}, {next: {revalidate: 60}});
    } catch (error) {
      console.error('Error in fetchFilters:', error);
      throw error;
    }
  };

  fetchImpactScoreFarm = async (mongodbid: string): Promise<Blob> => {
    try {
      return await imageHandler(
        'CO.FARMTOFARM',
        {mongodbid},
        {next: {revalidate: 60}},
      );
    } catch (error) {
      console.error('Error in fetchImpactScoreFarm:', error);
      throw error;
    }
  };

  fetchImpactScoreGate = async (mongodbid: string): Promise<Blob> => {
    try {
      return await imageHandler(
        'CO.CRADLETOGATE',
        {mongodbid},
        {next: {revalidate: 60}},
      );
    } catch (error) {
      console.error('Error in fetchImpactScoreGate:', error);
      throw error;
    }
  };

  fetchImpactScoreGrave = async (mongodbid: string): Promise<Blob> => {
    try {
      return await imageHandler(
        'CO.CRADLETOGRAVE',
        {mongodbid},
        {next: {revalidate: 60}},
      );
    } catch (error) {
      console.error('Error in fetchImpactScoreGrave:', error);
      throw error;
    }
  };
}

export const foodbookService = new FoodbookService();
