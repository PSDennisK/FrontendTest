'use client';

import SearchResults from '@/components/features/foodbook/Product/ProductSearch/SearchResults';
import {Container, Section} from '@/components/ui/Layout';
import {LoadingProductHolder} from '@/components/ui/Skeleton';
import {Brand, Culture, SearchResult} from '@/types';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

type ResultsSectionProps = {
  locale: keyof typeof Culture;
  isLoading: boolean;
  error: string | null;
  searchResult: SearchResult | null;
  keyword: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  brand: Brand;
};

const CLASSES = {
  loadingGrid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  noResults: 'w-full md:w-3/4',
  noResultsText: 'text-center text-lg mt-6',
};

const LoadingState: FC = () => (
  <Container className={CLASSES.loadingGrid}>
    <LoadingProductHolder amount={21} />
  </Container>
);

const NoResults: FC<{message: string}> = ({message}) => (
  <Section className={CLASSES.noResults}>
    <p className={CLASSES.noResultsText}>{message}</p>
  </Section>
);

const ResultsSection: FC<ResultsSectionProps> = memo(
  ({
    locale,
    isLoading,
    error,
    searchResult,
    keyword,
    currentPage,
    totalPages,
    onPageChange,
    brand,
  }) => {
    const {t} = useTranslation('common');

    if (isLoading) {
      return <LoadingState />;
    }

    if (!searchResult) {
      return <NoResults message={t('product.noFiltersUsed')} />;
    }

    return (
      <SearchResults
        locale={locale}
        keyword={keyword}
        searchResult={searchResult}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        brand={brand}
      />
    );
  },
);

ResultsSection.displayName = 'ResultsSection';

export default ResultsSection;
