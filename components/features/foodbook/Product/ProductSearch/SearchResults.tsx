import BrandCard from '@/components/features/foodbook/Brand/BrandCard';
import Pagination from '@/components/features/foodbook/Product/Pagination';
import ProductGrid from '@/components/features/foodbook/Product/ProductGrid/ProductGrid';
import {Container, Section} from '@/components/ui/Layout';
import {Brand, Culture, SearchProduct, SearchResult} from '@/types';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';

// Types
interface SearchResultsProps {
  locale: keyof typeof Culture;
  keyword: string;
  searchResult: SearchResult;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  brand: Brand | null;
}

type SortOption =
  | 'DEFAULT'
  | 'name'
  | 'name_desc'
  | 'nutriscore'
  | 'impactScore';

// Constants
const INITIAL_VISIBLE_COUNT = 6;
const ANIMATION_DELAY = 100;

const SORT_OPTIONS: Array<{
  value: SortOption;
  translationKey: string;
  disabled?: boolean;
}> = [
  {value: 'DEFAULT', translationKey: 'sort.default'},
  {value: 'name', translationKey: 'sort.name'},
  {value: 'name_desc', translationKey: 'sort.nameDesc'},
  {value: 'nutriscore', translationKey: 'sort.nutriScore', disabled: true},
  {value: 'impactScore', translationKey: 'sort.impactScore', disabled: true},
];

// Utility functions
const sortProducts = (
  products: SearchProduct[],
  option: SortOption,
): SearchProduct[] => {
  const productsCopy = [...products];

  switch (option) {
    case 'name':
      return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return productsCopy.sort((a, b) => b.name.localeCompare(a.name));
    // Placeholder for future implementation
    case 'nutriscore':
    case 'impactScore':
      console.warn(`Sorting by ${option} not implemented yet`);
      return productsCopy;
    default:
      return productsCopy;
  }
};

const SearchResults: React.FC<SearchResultsProps> = ({
  locale,
  keyword,
  searchResult,
  currentPage,
  totalPages,
  onPageChange,
  brand,
}) => {
  const {t} = useTranslation('common');
  const [visibleProducts, setVisibleProducts] = useState<SearchProduct[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortOption>('DEFAULT');

  // Progressive loading effect
  useEffect(() => {
    setVisibleProducts(searchResult.products.slice(0, INITIAL_VISIBLE_COUNT));

    const timer = setTimeout(() => {
      setVisibleProducts(sortProducts(searchResult.products, selectedSort));
    }, ANIMATION_DELAY);

    return () => clearTimeout(timer);
  }, [searchResult.products, selectedSort]);

  // Memoized values
  const formattedResultCount = useMemo(
    () => new Intl.NumberFormat(locale).format(searchResult.results),
    [locale, searchResult.results],
  );

  const resultCountText = useMemo(() => {
    if (searchResult.results <= 0) {
      return t('error.noProductsFound');
    }

    let text = `${formattedResultCount} ${t('product.productsFound')}`;
    if (keyword?.trim()) {
      text += ` ${t('common.for')} `;
      text += `"${keyword.trim()}"`;
    }
    return text;
  }, [formattedResultCount, keyword, t, searchResult.results]);

  // Handlers
  const handleSortChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const option = event.target.value as SortOption;
      setSelectedSort(option);
      setVisibleProducts(sortProducts(searchResult.products, option));
    },
    [searchResult.products],
  );

  return (
    <Section className="w-full md:w-3/4">
      {brand && (
        <Container
          itemType="https://schema.org/Brand"
          className="flex-1 items-end"
        >
          <BrandCard brand={brand} locale={locale} />
        </Container>
      )}

      <Container className="flex items-center justify-between mb-6">
        <Container className="flex items-center text-sm justify-end w-full lg:justify-between">
          {/* Result count */}
          <Container className="shrink-0 leading-4 md:mr-6 hidden lg:block mt-0.5">
            <span className="font-semibold">{resultCountText}</span>
          </Container>

          {/* Sort options */}
          <Container className="relative ml-2 lg:ml-0 min-w-[160px]">
            <Container className="flex items-center">
              <label className="flex shrink-0 mr-2 text-opacity-70">
                {t('sort.sortBy')}:
                <span className="block truncate">
                  <select
                    value={selectedSort}
                    onChange={handleSortChange}
                    className="relative w-full font-semibold rounded-lg cursor-pointer pl-2 pr-5 text-left focus:outline-none sm:text-sm"
                    aria-label={t('sort.sortBy')}
                  >
                    {SORT_OPTIONS.map(({value, translationKey, disabled}) => (
                      <option
                        key={value}
                        value={value}
                        disabled={disabled}
                        className={disabled ? 'text-gray-200' : ''}
                      >
                        {t(translationKey)}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </Container>
          </Container>
        </Container>
      </Container>

      {/* Results grid */}
      <ProductGrid
        locale={locale}
        products={visibleProducts}
        className="min-h-[200px]" // Prevent layout shift
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </Section>
  );
};

export default React.memo(SearchResults, (prevProps, nextProps) => {
  return (
    prevProps.keyword === nextProps.keyword &&
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.searchResult.results === nextProps.searchResult.results &&
    prevProps.searchResult.products.length ===
      nextProps.searchResult.products.length
  );
});
