'use client';

import {ProductCardSmall} from '@/components/features/foodbook/Product/ProductCard';
import {Container} from '@/components/ui/Layout';
import {LoadingProductHolder} from '@/components/ui/Skeleton';
import {useTranslation} from '@/i18n/client';
import {foodbookService} from '@/services';
import {Culture, LatestProduct} from '@/types';
import {useParams} from 'next/navigation';
import {useCallback, useEffect, useState} from 'react';

// Types
interface State {
  products: LatestProduct[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: number | null;
}

// Constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const GRID_CLASSES =
  'grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5 md:gap-4' as const;
const SKELETON_COUNT = 5;

const LatestProducts = () => {
  const locale = useParams()?.locale as keyof typeof Culture;
  const {t} = useTranslation(locale, 'common');

  // State
  const [state, setState] = useState<State>({
    products: [],
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  // Fetch products with caching
  const fetchProducts = useCallback(
    async (force = false) => {
      // Check cache
      if (
        !force &&
        state.lastUpdated &&
        Date.now() - state.lastUpdated < CACHE_DURATION
      ) {
        return;
      }

      setState(prev => ({...prev, isLoading: true, error: null}));

      try {
        const products = await foodbookService.fetchLatestProducts();
        setState({
          products,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error
              : new Error('Failed to fetch products'),
        }));
      }
    },
    [state.lastUpdated],
  );

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Render functions
  const renderError = () => (
    <Container className="text-center py-4">
      <p className="text-red-600 mb-2">{t('error.failedToLoad')}</p>
      <button
        onClick={() => fetchProducts(true)}
        className="text-ps-blue-400 hover:text-ps-blue-500 font-medium"
      >
        {t('common.tryAgain')}
      </button>
    </Container>
  );

  const renderProducts = () => (
    <Container className={GRID_CLASSES}>
      {state.products.map(product => (
        <ProductCardSmall key={product.id} locale={locale} product={product} />
      ))}
    </Container>
  );

  const renderLoading = () => (
    <Container className={GRID_CLASSES}>
      <LoadingProductHolder amount={SKELETON_COUNT} />
    </Container>
  );

  return (
    <Container className="w-full pt-6">
      <Container className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold leading-7">{t('home.newInPs')}</h3>
        {!state.isLoading && state.products.length > 0 && (
          <button
            onClick={() => fetchProducts(true)}
            className="text-ps-blue-400 hover:text-ps-blue-500 text-sm"
            aria-label={t('common.refresh')}
          >
            {t('common.refresh')}
          </button>
        )}
      </Container>

      {state.error && renderError()}
      {state.isLoading && renderLoading()}
      {!state.isLoading && !state.error && renderProducts()}
    </Container>
  );
};

export default LatestProducts;
