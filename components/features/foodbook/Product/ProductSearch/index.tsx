'use client';

import {Container} from '@/components/ui/Layout';

import {useSearchParams} from 'next/navigation';
import React, {useCallback, useEffect, useMemo} from 'react';
import {useTranslation} from 'react-i18next';

import {useMetaTags} from '@/app/hooks/useMetaTags';
import {useProductSearch} from '@/app/hooks/useProductSearch';
import FiltersSection from '@/components/features/foodbook/Filters/FiltersSection';
import OffCanvasFilter from '@/components/features/foodbook/Filters/OffCanvasFilter';
import ResultsSection from '@/components/features/foodbook/Filters/ResultsSection';
import {foodbook} from '@/foodbook.config';
import {LocaleTypes} from '@/i18n/settings';
import {SearchFilterFilter, Voedingswaarde} from '@/types';

interface ProductSearchProps {
  params: {
    locale: LocaleTypes;
  };
}

interface MetaContent {
  title: string;
  description: string;
}

const ITEMS_PER_PAGE = Number(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE) || 12;

const ProductSearch: React.FC<ProductSearchProps> = ({params}) => {
  const {locale} = params;
  const {t} = useTranslation('common');
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const {
    keyword,
    setKeyword,
    searchResult,
    isLoading,
    error,
    currentPage,
    totalPages,
    activeFilters,
    filters,
    isLoadingFilters,
    setCurrentPage,
    setActiveFilters,
    handleFilterChange,
    handleBrandFilterChange,
    loadFilters,
  } = useProductSearch(searchTerm, ITEMS_PER_PAGE);

  const [nutritionalValues, setNutritionalValues] = React.useState<
    Voedingswaarde[]
  >([]);
  const [initialNutritionalValues, setInitialNutritionalValues] =
    React.useState<Voedingswaarde[]>([]);

  const availableFilters = useMemo(
    () => searchResult?.filters?.map(f => f.key) || [],
    [searchResult?.filters],
  );

  const metaContent = useMemo(
    (): MetaContent => ({
      title: keyword
        ? t('product.search.metaTitleWithSearch', {
            siteName: foodbook.site_name,
            searchTerm: keyword,
          })
        : t('product.search.metaTitle', {siteName: foodbook.site_name}),
      description: keyword
        ? t('product.search.metaDescriptionWithSearch', {searchTerm: keyword})
        : t('product.search.metaDescription'),
    }),
    [keyword, t],
  );

  useEffect(() => {
    if (searchTerm) {
      setKeyword(searchTerm);
    }
  }, [searchTerm, setKeyword]);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

  useEffect(() => {
    if (
      searchResult?.voedingswaardes &&
      initialNutritionalValues.length === 0
    ) {
      const values = searchResult.voedingswaardes.map(v => ({
        ...v,
        currentValue: v.maxValue,
      }));

      setInitialNutritionalValues(values);
      setNutritionalValues(values);
    }
  }, [searchResult, initialNutritionalValues.length]);

  useEffect(() => {
    document.title = metaContent.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaContent.description);
    }
  }, [metaContent]);

  const handleNutritionalValueChange = useCallback(
    (id: number, value: number) => {
      setNutritionalValues(prev =>
        prev.map(nv => (nv.id === id ? {...nv, currentValue: value} : nv)),
      );

      setActiveFilters(prev => {
        const filterKey = 'Nutrient';
        const filterIndex = prev.findIndex(f => f.key === filterKey);
        const updatedFilter = {
          key: filterKey,
          itemBetween: [
            {
              id,
              minimal: 0,
              maximum: Math.round(value),
            },
          ],
        };

        return filterIndex > -1
          ? [
              ...prev.slice(0, filterIndex),
              updatedFilter,
              ...prev.slice(filterIndex + 1),
            ]
          : [...prev, updatedFilter];
      });

      setCurrentPage(1);
    },
    [setActiveFilters, setCurrentPage],
  );

  const handleResetFilters = useCallback(() => {
    setActiveFilters([]);
    setNutritionalValues(prev =>
      prev.map(nv => ({...nv, currentValue: nv.maxValue})),
    );
  }, [setActiveFilters]);

  const handleSliderChange = useCallback(
    (filterKey: string, optionId: number, value: [number, number]) => {
      const updatedFilter: SearchFilterFilter = {
        key: filterKey,
        itemBetween: [
          {
            id: optionId,
            minimal: value[0],
            maximum: value[1],
          },
        ],
      };

      setActiveFilters(prev => {
        const filterIndex = prev.findIndex(f => f.key === filterKey);
        return filterIndex > -1
          ? [
              ...prev.slice(0, filterIndex),
              updatedFilter,
              ...prev.slice(filterIndex + 1),
            ]
          : [...prev, updatedFilter];
      });

      setCurrentPage(1);
    },
    [setActiveFilters, setCurrentPage],
  );

  const metaConfig = useMemo(
    () => ({
      title: keyword
        ? t('product.search.metaTitleWithSearch', {
            siteName: foodbook.site_name,
            searchTerm: keyword,
          })
        : t('product.search.metaTitle', {siteName: foodbook.site_name}),
      description: keyword
        ? t('product.search.metaDescriptionWithSearch', {searchTerm: keyword})
        : t('product.search.metaDescription'),
      ogImage: foodbook.default_image,
      canonical: `${foodbook.site_domain}/${locale}/search${keyword ? `?search=${encodeURIComponent(keyword)}` : ''}`,
      alternateLangs: {
        'nl-NL': `${foodbook.site_domain}/nl/search${keyword ? `?search=${encodeURIComponent(keyword)}` : ''}`,
        'en-GB': `${foodbook.site_domain}/en/search${keyword ? `?search=${encodeURIComponent(keyword)}` : ''}`,
      },

      noindex: searchResult?.products?.length === 0,
    }),
    [keyword, locale, searchResult?.products?.length, t],
  );

  useMetaTags({
    config: metaConfig,
    variables: {
      siteName: foodbook.site_name,
      searchTerm: keyword,
    },
  });

  return (
    <>
      <Container className="flex">
        <OffCanvasFilter>
          <FiltersSection
            filters={filters}
            isLoading={isLoadingFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onBrandFilterChange={handleBrandFilterChange}
            onResetFilters={handleResetFilters}
            nutritionalValues={nutritionalValues}
            onNutritionalValueChange={handleNutritionalValueChange}
            error={error}
            availableFilters={availableFilters}
            hasSearchTerm={Boolean(keyword)}
            searchResultFilters={searchResult?.filters}
            searchResults={searchResult?.products}
            onSliderChange={handleSliderChange}
          />
        </OffCanvasFilter>

        <aside className="hidden md:block md:sticky h-full md:w-1/4 lg:pt-4 shrink-0 pr-8 w-96 top-16">
          <FiltersSection
            filters={filters}
            isLoading={isLoadingFilters}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onBrandFilterChange={handleBrandFilterChange}
            onResetFilters={handleResetFilters}
            nutritionalValues={nutritionalValues}
            onNutritionalValueChange={handleNutritionalValueChange}
            error={error}
            availableFilters={availableFilters}
            hasSearchTerm={Boolean(keyword)}
            searchResultFilters={searchResult?.filters}
            searchResults={searchResult?.products}
            onSliderChange={handleSliderChange}
          />
        </aside>

        <ResultsSection
          locale={locale}
          isLoading={isLoading}
          error={error}
          searchResult={searchResult}
          keyword={keyword}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          brand={null}
        />
      </Container>
    </>
  );
};

export default React.memo(ProductSearch);
