'use client';

import FiltersSection from '@/components/features/foodbook/Filters/FiltersSection';
import OffCanvasFilter from '@/components/features/foodbook/Filters/OffCanvasFilter';
import ResultsSection from '@/components/features/foodbook/Filters/ResultsSection';
import {Container} from '@/components/ui/Layout';
import {foodbookService} from '@/services';
import {
  Brand,
  Culture,
  Filter,
  SearchFilterFilter,
  SearchParams,
  SearchResult,
  Voedingswaarde,
} from '@/types';
import {splitHandle} from '@/utils/helpers';
import debounce from 'lodash/debounce';
import {useSearchParams} from 'next/navigation';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface BrandSearchProps {
  params: {
    locale: keyof typeof Culture;
    slug: string;
  };
}

const BrandSearch: React.FC<BrandSearchProps> = ({params: {locale, slug}}) => {
  const {t} = useTranslation('common');
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const itemsPerPage = 21;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [keyword, setKeyword] = useState(searchTerm);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [activeFilters, setActiveFilters] = useState<SearchFilterFilter[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [availableFilters, setAvailableFilters] = useState<string[]>([]);
  const [nutritionalValues, setNutritionalValues] = useState<Voedingswaarde[]>(
    [],
  );
  const [initialNutritionalValues, setInitialNutritionalValues] = useState<
    Voedingswaarde[]
  >([]);

  const performSearch = useCallback(
    async (searchParams: SearchParams) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await foodbookService.fetchSearchResult(searchParams);
        if (!result) {
          throw new Error('No search result found');
        }
        setSearchResult(result);
        setTotalPages(Math.ceil(result.results / itemsPerPage));

        // Update available filters
        setAvailableFilters(result.filters.map(filter => filter.key));

        // Initialize nutritional values if not already done
        if (result.voedingswaardes && initialNutritionalValues.length === 0) {
          const values = result.voedingswaardes.map(v => ({
            ...v,
            currentValue: v.maxValue,
          }));
          setInitialNutritionalValues(values);
          setNutritionalValues(values);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('Failed to fetch search results. Please try again.');
        setSearchResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage, initialNutritionalValues.length],
  );

  const debouncedSearch = useCallback(
    debounce((searchParams: SearchParams) => performSearch(searchParams), 300),
    [performSearch],
  );

  useEffect(() => {
    const loadBrand = async () => {
      setIsLoadingFilters(true);
      try {
        const filterKey = 'Brand';
        const brandid = splitHandle(slug);
        const fetchedBrand = await foodbookService.fetchBrandById(brandid);
        if (fetchedBrand) {
          setBrand(fetchedBrand);

          const brandFilter: SearchFilterFilter = {
            key: filterKey,
            values: [Number(brandid)],
          };

          const initialSearchParams: SearchParams = {
            keyword: '',
            filters: [brandFilter],
            pageIndex: 0,
            pageSize: itemsPerPage,
          };

          setActiveFilters([brandFilter]);

          performSearch(initialSearchParams);
        } else {
          setError('Brand not found');
        }
      } catch (error) {
        console.error('Error fetching brand:', error);
        setError(`Failed to load brand: ${error.message}`);
      } finally {
        setIsLoadingFilters(false);
      }
    };
    loadBrand();
  }, [slug, itemsPerPage, performSearch]);

  useEffect(() => {
    const loadFilters = async () => {
      setIsLoadingFilters(true);
      try {
        const fetchedFilters = await foodbookService.fetchFilters();
        setFilters(fetchedFilters);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setError('Failed to load filters');
      } finally {
        setIsLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  const handleFilterChange = useCallback(
    (filterKey: string, optionId: number, checked: boolean) => {
      setActiveFilters(prev => {
        let newFilters;
        const filterIndex = prev.findIndex(f => f.key === filterKey);
        if (filterIndex > -1) {
          const updatedFilter = {...prev[filterIndex]};
          if (checked) {
            updatedFilter.values = [...(updatedFilter.values || []), optionId];
          } else {
            updatedFilter.values = updatedFilter.values?.filter(
              id => id !== optionId,
            );
          }
          if (!updatedFilter.values || updatedFilter.values.length === 0) {
            newFilters = prev.filter((_, index) => index !== filterIndex);
          } else {
            newFilters = [
              ...prev.slice(0, filterIndex),
              updatedFilter,
              ...prev.slice(filterIndex + 1),
            ];
          }
        } else if (checked) {
          newFilters = [...prev, {key: filterKey, values: [optionId]}];
        } else {
          newFilters = prev;
        }
        setCurrentPage(1);
        return newFilters;
      });
    },
    [],
  );

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
              id: id,
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
    [],
  );

  const handleResetFilters = useCallback(() => {
    setActiveFilters([]);
    setNutritionalValues(prev =>
      prev.map(nv => ({...nv, currentValue: nv.maxValue})),
    );
  }, []);

  const handleSliderChange = useCallback(
    (filterKey: string, optionId: number, value: [number, number]) => {
      setActiveFilters(prev => {
        const filterIndex = prev.findIndex(f => f.key === filterKey);
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
    [],
  );

  const handleBrandFilterChange = useCallback(() => {
    // Intentionally empty as brand filtering is not needed on the brand page
  }, []);

  // Trigger search when filters or pagination changes
  useEffect(() => {
    if (brand) {
      const searchParams: SearchParams = {
        keyword: '',
        filters: activeFilters,
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      };
      debouncedSearch(searchParams);
    }
  }, [brand, activeFilters, currentPage, debouncedSearch, itemsPerPage]);

  return (
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
        brand={brand}
      />
    </Container>
  );
};

export default React.memo(BrandSearch);
