'use client';

import {useAnalytics, useLocalStorage} from '@/app/hooks';
import FilterSection from '@/components/features/foodbook/Filters/FilterSection';
import NutritionalValueSlider from '@/components/features/foodbook/Filters/NutritionalValueSlider';
import {Container} from '@/components/ui/Layout';
import {LoadingFilterHolder} from '@/components/ui/Skeleton';
import {
  Filter,
  FilterResult,
  NutritionalValue,
  SavedFilters,
  SearchFilterFilter,
  SearchProduct,
} from '@/types';
import {debounce} from 'lodash';
import {type FC, memo, useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {AiOutlineClose} from 'react-icons/ai';

type FiltersSectionProps = {
  filters: Filter[];
  isLoading: boolean;
  activeFilters: SearchFilterFilter[];
  onFilterChange: (
    filterKey: string,
    optionId: number,
    checked: boolean,
  ) => void;
  onBrandFilterChange: (brandId: number[], checked: boolean) => void;
  onResetFilters: () => void;
  nutritionalValues?: NutritionalValue[];
  onNutritionalValueChange?: (id: number, value: number) => void;
  error?: string | null;
  availableFilters?: string[];
  hasSearchTerm?: boolean;
  searchResultFilters?: FilterResult[];
  searchResults?: SearchProduct[];
  onSliderChange?: (
    filterKey: string,
    optionId: number,
    value: [number, number],
  ) => void;
  showBrandFilter?: boolean;
};

const CLASSES = {
  header: 'flex w-full justify-between',
  title: 'text-lg font-semibold mb-5 -mt-1',
  resetIcon:
    'size-4 cursor-pointer hover:text-ps-blue-400 transition-all duration-300 ease-in-out',
  errorText: 'text-red-500',
  nutritionalContainer: 'flex flex-col',
};

const STORAGE_KEY = 'foodbook_filters';
const DEBOUNCE_DELAY = 500;

/**
 * Custom hook for filter persistence and analytics
 */
const useFilterManagement = (props: FiltersSectionProps) => {
  const {trackEvent} = useAnalytics();
  const [savedFilters, setSavedFilters] = useLocalStorage<SavedFilters>(
    STORAGE_KEY,
    {
      activeFilters: [],
      nutritionalValues: [],
    },
  );

  const {
    onFilterChange,
    onNutritionalValueChange,
    onResetFilters,
    activeFilters,
    nutritionalValues,
  } = props;

  // Restore saved filters on mount
  useEffect(() => {
    if (savedFilters && !activeFilters.length) {
      savedFilters.activeFilters.forEach(filter => {
        filter.values?.forEach(value => {
          onFilterChange(filter.key, value, true);
        });
      });

      savedFilters.nutritionalValues.forEach(value => {
        if (onNutritionalValueChange) {
          onNutritionalValueChange(value.id, value.currentValue);
        }
      });

      trackEvent('filters_restored', {
        filterCount: savedFilters.activeFilters.length,
        nutritionalValueCount: savedFilters.nutritionalValues.length,
      });
    }
  }, []);

  // Save filters when they change
  const debouncedSaveFilters = useCallback(
    debounce((filters, values) => {
      setSavedFilters({
        activeFilters: filters,
        nutritionalValues: values || [],
      });

      trackEvent('filters_updated', {
        filterCount: filters.length,
        nutritionalValueCount: values?.length || 0,
      });
    }, DEBOUNCE_DELAY),
    [setSavedFilters, trackEvent],
  );

  useEffect(() => {
    debouncedSaveFilters(activeFilters, nutritionalValues);
  }, [activeFilters, nutritionalValues, debouncedSaveFilters]);

  // Enhanced handlers with analytics
  const handleFilterChange = useCallback(
    (filterKey: string, optionId: number, checked: boolean) => {
      trackEvent('filter_changed', {
        filterKey,
        optionId,
        action: checked ? 'added' : 'removed',
      });
      onFilterChange(filterKey, optionId, checked);
    },
    [onFilterChange, trackEvent],
  );

  const handleNutritionalValueChange = useCallback(
    (id: number, value: number) => {
      if (!onNutritionalValueChange) return;

      trackEvent('nutritional_value_changed', {
        id,
        value,
      });
      onNutritionalValueChange(id, value);
    },
    [onNutritionalValueChange, trackEvent],
  );

  const handleResetFilters = useCallback(() => {
    trackEvent('filters_reset', {
      filterCount: activeFilters.length,
      nutritionalValueCount: nutritionalValues?.length || 0,
    });
    setSavedFilters({
      activeFilters: [],
      nutritionalValues: [],
    });
    onResetFilters();
  }, [
    activeFilters,
    nutritionalValues,
    onResetFilters,
    setSavedFilters,
    trackEvent,
  ]);

  return {
    handleFilterChange,
    handleNutritionalValueChange,
    handleResetFilters,
  };
};

/**
 * FiltersSection component with analytics tracking and filter persistence
 */
const FiltersSection: FC<FiltersSectionProps> = memo(props => {
  const {t} = useTranslation('common');
  const {
    filters,
    isLoading,
    activeFilters,
    nutritionalValues,
    error,
    availableFilters = [],
    hasSearchTerm = false,
    searchResultFilters = [],
    searchResults = [],
    onSliderChange = () => {},
  } = props;

  const {handleFilterChange, handleNutritionalValueChange, handleResetFilters} =
    useFilterManagement(props);

  // Early returns
  if (isLoading) {
    return <LoadingFilterHolder amount={5} />;
  }

  if (error) {
    return <p className={CLASSES.errorText}>{error}</p>;
  }

  const hasNutritionalValues = nutritionalValues?.some(
    vw => vw.minValue !== 0 || vw.maxValue !== 0,
  );

  return (
    <>
      <Container className={CLASSES.header}>
        <h3 className={CLASSES.title}>{t('filter.filters')}</h3>
        <button
          type="button"
          onClick={handleResetFilters}
          aria-label={t('filter.clear')}
          className="focus:outline-none focus:ring-2 focus:ring-ps-blue-400 rounded"
        >
          <AiOutlineClose
            className={CLASSES.resetIcon}
            title={t('filter.clear')}
          />
        </button>
      </Container>

      <FilterSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onSliderChange={onSliderChange}
        activeFilters={activeFilters}
        availableFilters={availableFilters}
        hasSearchTerm={hasSearchTerm}
        searchResultFilters={searchResultFilters}
        searchResults={searchResults}
      />

      {hasNutritionalValues && handleNutritionalValueChange && (
        <Container className={CLASSES.nutritionalContainer}>
          {nutritionalValues!
            .filter(value => value.minValue !== 0 || value.maxValue !== 0)
            .map(value => (
              <NutritionalValueSlider
                key={value.id}
                nutritionalValue={value}
                onSliderChange={handleNutritionalValueChange}
              />
            ))}
        </Container>
      )}
    </>
  );
});

FiltersSection.displayName = 'FiltersSection';

export default FiltersSection;
