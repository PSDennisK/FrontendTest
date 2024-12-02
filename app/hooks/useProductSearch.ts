import debounce from 'lodash/debounce';
import {useCallback, useEffect, useMemo, useState} from 'react';

import {foodbookService} from '@/services';
import {Filter, SearchFilterFilter, SearchParams, SearchResult} from '@/types';

export const useProductSearch = (
  initialKeyword: string,
  itemsPerPage: number,
) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState<SearchFilterFilter[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  const loadFilters = useCallback(async () => {
    setIsLoadingFilters(true);
    try {
      const fetchedFilters = await foodbookService.fetchFilters();
      setFilters(fetchedFilters);
    } catch (err) {
      setError('Failed to load filters. Please try again later.');
    } finally {
      setIsLoadingFilters(false);
    }
  }, []);

  const performSearch = useCallback(
    async (searchParams: SearchParams) => {
      const params = {
        ...searchParams,
        filters: searchParams.filters || [], // Gebruik de filters van de parameters
      };

      setIsLoading(true);
      setError(null);

      try {
        const result = await foodbookService.fetchSearchResult(searchParams);

        if (!result) throw new Error('No search result found');

        setSearchResult(result);
        setTotalPages(Math.ceil(result.results / itemsPerPage));
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        setSearchResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce(
        (searchParams: SearchParams) => performSearch(searchParams),
        300,
      ),
    [performSearch],
  );

  const handleFilterChange = useCallback(
    (filterKey: string, optionId: number, checked: boolean) => {
      setActiveFilters(prev => {
        const newFilters = [...prev];
        const filterIndex = newFilters.findIndex(f => f.key === filterKey);

        if (checked) {
          if (filterIndex === -1) {
            return [
              ...newFilters,
              {
                key: filterKey,
                values: [optionId],
              },
            ];
          } else {
            const currentFilter = newFilters[filterIndex];
            const updatedFilter = {
              ...currentFilter,
              values: [...(currentFilter.values || []), optionId],
            };
            newFilters[filterIndex] = updatedFilter;
            return newFilters;
          }
        } else {
          if (filterIndex > -1) {
            const currentFilter = newFilters[filterIndex];
            const updatedValues = currentFilter.values?.filter(
              id => id !== optionId,
            );

            if (!updatedValues?.length) {
              return newFilters.filter((_, idx) => idx !== filterIndex);
            } else {
              newFilters[filterIndex] = {
                ...currentFilter,
                values: updatedValues,
              };
              return newFilters;
            }
          }
        }

        return newFilters;
      });

      setCurrentPage(1);
    },
    [],
  );

  const handleBrandFilterChange = useCallback(
    (brandId: number[], checked: boolean) => {
      setActiveFilters(prev => {
        const brandFilterIndex = prev.findIndex(f => f.key === 'Brand');

        if (checked) {
          if (brandFilterIndex > -1) {
            const updatedFilter = {...prev[brandFilterIndex]};
            updatedFilter.values = [
              ...(updatedFilter.values || []),
              ...brandId,
            ];
            return [
              ...prev.slice(0, brandFilterIndex),
              updatedFilter,
              ...prev.slice(brandFilterIndex + 1),
            ];
          }
          return [...prev, {key: 'Brand', values: brandId}];
        } else {
          if (brandFilterIndex > -1) {
            const updatedFilter = {...prev[brandFilterIndex]};
            updatedFilter.values = updatedFilter.values?.filter(
              id => !brandId.includes(id),
            );

            if (!updatedFilter.values?.length) {
              return prev.filter((_, index) => index !== brandFilterIndex);
            }

            return [
              ...prev.slice(0, brandFilterIndex),
              updatedFilter,
              ...prev.slice(brandFilterIndex + 1),
            ];
          }
        }
        return prev;
      });
    },
    [],
  );

  useEffect(() => {
    const searchParams = {
      keyword,
      filters: activeFilters,
      pageIndex: currentPage - 1,
      pageSize: itemsPerPage,
    };

    if (keyword || activeFilters.length > 0) {
      performSearch(searchParams);
    }
  }, [keyword, activeFilters, currentPage, itemsPerPage, performSearch]);

  return {
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
    loadFilters: useCallback(async () => {
      setIsLoadingFilters(true);
      try {
        const fetchedFilters = await foodbookService.fetchFilters();
        setFilters(fetchedFilters);
      } catch (err) {
        setError('Failed to load filters. Please try again later.');
      } finally {
        setIsLoadingFilters(false);
      }
    }, []),
  };
};
