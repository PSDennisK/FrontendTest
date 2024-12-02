'use client';

import BrandCard from '@/components/features/foodbook/Brand/BrandCard';
import Pagination from '@/components/features/foodbook/Product/Pagination';
import ProductGrid from '@/components/features/foodbook/Product/ProductGrid/ProductGrid';
import {ErrorBoundary, ErrorFallback} from '@/components/ui/ErrorBoundary';
import {Container, Section} from '@/components/ui/Layout';
import {Brand, Culture, SearchProduct, SearchResult} from '@/types';
import {type FC, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {AutoSizer, List, WindowScroller} from 'react-virtualized';

type BrandResultsProps = {
  locale: keyof typeof Culture;
  keyword: string;
  brand: Brand;
  searchResult: SearchResult;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type SortOption =
  | 'DEFAULT'
  | 'name'
  | 'name_desc'
  | 'nutriscore'
  | 'impactScore';

const CONTAINER_CLASSES = {
  brand: 'flex-1 items-end',
  results: 'flex-1 items-end',
  header: 'flex items-center justify-between mb-6',
  count: 'flex items-center text-sm justify-end w-full lg:justify-between',
  resultText: 'shrink-0 leading-4 md:mr-6 hidden lg:block mt-0.5',
  sortWrapper: 'relative ml-2 lg:ml-0 min-w-[160px]',
  errorContainer: 'p-4 text-center',
  errorHeading: 'text-lg font-semibold text-red-600 mb-2',
  errorText: 'text-sm text-gray-600',
  errorDev: 'mt-4 p-2 bg-gray-100 rounded text-left text-sm',
};

const SELECT_CLASSES = `
    relative w-full font-semibold rounded-lg cursor-pointer pr-5 text-left 
    focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 
    focus-visible:ring-white focus-visible:ring-offset-brand 
    focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm
  `;

const SORT_FUNCTIONS: Record<
  SortOption,
  ((a: SearchProduct, b: SearchProduct) => number) | null
> = {
  DEFAULT: null,
  name: (a, b) => a.name.localeCompare(b.name),
  name_desc: (a, b) => b.name.localeCompare(a.name),
  nutriscore: null,
  impactScore: null,
};

// Virtualized Product Grid Component
const VirtualizedProductGrid: FC<{
  locale: keyof typeof Culture;
  products: SearchProduct[];
  itemHeight?: number;
}> = memo(({locale, products, itemHeight = 300}) => {
  const rowRenderer = useCallback(
    ({index, key, style}: any) => {
      const product = products[index];
      return (
        <div key={key} style={style}>
          <ProductGrid locale={locale} products={[product]} />
        </div>
      );
    },
    [products],
  );

  return (
    <WindowScroller>
      {({height, isScrolling, onChildScroll, scrollTop}) => (
        <AutoSizer disableHeight>
          {({width}) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={products.length}
              rowHeight={itemHeight}
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={width}
              overscanRowCount={3}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
});

VirtualizedProductGrid.displayName = 'VirtualizedProductGrid';

// Main Component
const BrandResults: FC<BrandResultsProps> = memo(
  ({
    locale,
    keyword,
    brand,
    searchResult,
    currentPage,
    totalPages,
    onPageChange,
  }) => {
    const {t} = useTranslation('common');
    const [visibleProducts, setVisibleProducts] = useState<SearchProduct[]>([]);
    const [sortError, setSortError] = useState<Error | null>(null);
    const [displayCount, setDisplayCount] = useState(20);

    // Scroll position restoration
    useEffect(() => {
      const scrollPosition = sessionStorage.getItem('scrollPosition');
      if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
      }

      return () => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      };
    }, []);

    // Progressive loading
    const loadMore = useCallback(() => {
      setDisplayCount(prev =>
        Math.min(prev + 20, searchResult?.products?.length || 0),
      );
    }, [searchResult?.products?.length]);

    // Initialize products with animation delay
    useEffect(() => {
      const timer = setTimeout(() => {
        setVisibleProducts(
          searchResult?.products?.slice(0, displayCount) ?? [],
        );
      }, 100);

      return () => clearTimeout(timer);
    }, [searchResult?.products, displayCount]);

    // Format result count based on locale
    const formattedResultCount = useMemo(() => {
      return new Intl.NumberFormat(locale).format(searchResult?.results ?? 0);
    }, [locale, searchResult?.results]);

    // Handle sort order changes
    const handleSortOrder = useCallback(
      (option: SortOption) => {
        try {
          if (!searchResult?.products || !SORT_FUNCTIONS[option]) return;

          setSortError(null);
          setVisibleProducts(prevProducts => {
            const sortedProducts = [...prevProducts];
            const sortFn = SORT_FUNCTIONS[option];
            return sortFn ? sortedProducts.sort(sortFn) : sortedProducts;
          });
        } catch (error) {
          setSortError(error as Error);
          console.error('Sorting error:', error);
          setVisibleProducts(searchResult?.products ?? []);
        }
      },
      [searchResult?.products],
    );

    // Reset error state
    const handleRetry = useCallback(() => {
      setSortError(null);
      setVisibleProducts(searchResult?.products ?? []);
    }, [searchResult?.products]);

    // Render result count text
    const renderResultCount = useMemo(() => {
      if (searchResult?.results > 0) {
        return (
          <span className="font-semibold">
            {formattedResultCount} {t('product.productsFound')}
            {keyword?.trim() && (
              <>
                {' '}
                {t('common.for')}{' '}
                <span className="italic font-bold">{keyword}</span>
              </>
            )}
          </span>
        );
      }
      return (
        <span className="font-semibold">{t('error.noProductsFound')}</span>
      );
    }, [formattedResultCount, keyword, searchResult?.results, t]);

    const hasMore = displayCount < (searchResult?.products?.length || 0);

    return (
      <ErrorBoundary
        fallback={
          <ErrorFallback
            errorContainer={CONTAINER_CLASSES.errorContainer}
            errorHeading={CONTAINER_CLASSES.errorHeading}
            errorText={CONTAINER_CLASSES.errorText}
            errorDev={CONTAINER_CLASSES.errorDev}
          />
        }
      >
        <Section className="w-full md:w-3/4">
          {sortError && (
            <ErrorFallback error={sortError} onRetry={handleRetry} />
          )}

          {brand && (
            <Container
              itemType="https://schema.org/Brand"
              className={CONTAINER_CLASSES.brand}
            >
              <BrandCard brand={brand} locale={locale} />
            </Container>
          )}

          <Container className={CONTAINER_CLASSES.results}>
            <Container className={CONTAINER_CLASSES.header}>
              <Container className={CONTAINER_CLASSES.count}>
                <Container className={CONTAINER_CLASSES.resultText}>
                  {renderResultCount}
                </Container>

                <Container className={CONTAINER_CLASSES.sortWrapper}>
                  <Container className="flex items-center">
                    <Container className="flex shrink-0 mr-2 text-opacity-70">
                      <label htmlFor="sortOrder" className="sr-only">
                        {t('sort.sortBy')}
                      </label>
                      <select
                        id="sortOrder"
                        className={SELECT_CLASSES}
                        name="sorting"
                        onChange={e =>
                          handleSortOrder(e.target.value as SortOption)
                        }
                      >
                        <option value="DEFAULT">{t('sort.default')}</option>
                        <option value="name">{t('sort.name')}</option>
                        <option value="name_desc">{t('sort.nameDesc')}</option>
                        <option value="nutriscore" disabled>
                          {t('sort.nutriScore')}
                        </option>
                        <option value="impactScore" disabled>
                          {t('sort.impactScore')}
                        </option>
                      </select>
                    </Container>
                  </Container>
                </Container>
              </Container>
            </Container>

            {visibleProducts?.length > 0 && (
              <div className="min-h-[300px]">
                <VirtualizedProductGrid
                  locale={locale}
                  products={visibleProducts}
                  itemHeight={300}
                />
                {hasMore && (
                  <button
                    onClick={loadMore}
                    className="w-full py-4 text-center text-blue-600 hover:text-blue-800"
                  >
                    {t('common.loadMore')}
                  </button>
                )}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </Container>
        </Section>
      </ErrorBoundary>
    );
  },
);

BrandResults.displayName = 'BrandResults';

export default BrandResults;
