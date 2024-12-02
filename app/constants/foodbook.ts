import {Culture} from '@/types';

const FOODBOOK_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_FOODBOOK_API_URL,
  ENDPOINTS: {
    SEARCH: {
      AUTOCOMPLETE: '/v2/Search/:locale/AutoComplete/:keyword',
      RESULTS: '/v2/Search/SearchResults',
      BYEAN: '/v2/Search/SearchByEan/:eancode',
    },
    BRAND: {
      ALL: '/v2/Brand/All',
      INFO: '/v2/Brand/BrandInfo/:brandid',
    },
    FILTER: {
      LIST: '/v2/Filter/List',
    },
    PRODUCER: {
      ALL: '/v2/Producer/All',
      INFO: '/v2/Producer/ProducerInfo/:producerid',
    },
    PRODUCT: {
      ALL: '/v2/Product/All',
      LASTADDED: '/v2/Product/LastAdded',
      INFO: '/v2/Product/GetProductSheet/:packagedproductid',
    },
    CO: {
      FARMTOFARM: '/v2/Co/Farmtofarm/:mongodbid',
      CRADLETOGATE: '/v2/Co/Cradletogate/:mongodbid',
      CRADLETOGRAVE: '/v2/Co/Cradletograve/:mongodbid',
    },
  },
  DEFAULT_LOCALE: 'nl' as keyof typeof Culture,
  LOCALE_MAP: {
    nl: '1',
    de: '2',
    en: '3',
    fr: '4',
  },
};

export default FOODBOOK_CONFIG;
