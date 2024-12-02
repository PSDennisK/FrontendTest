'use client';

import styles from '@/app/styles/components/FilterSection.module.css';
import {Container, Section} from '@/components/ui/Layout';
import {foodbookService} from '@/services';
import {
  Brand,
  Filter,
  FilterOption,
  FilterResult,
  FilterType,
  SearchFilterFilter,
  SearchProduct,
} from '@/types';
import {camelCase} from 'lodash';
import {FC, memo, useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FaChevronDown, FaChevronUp} from 'react-icons/fa6';

type FilterSectionProps = {
  filters: Filter[];
  onFilterChange: (
    filterId: string,
    optionId: number,
    checked: boolean,
  ) => void;
  onSliderChange: (
    filterId: string,
    optionId: number,
    value: [number, number],
  ) => void;
  activeFilters: SearchFilterFilter[];
  availableFilters: string[];
  hasSearchTerm: boolean;
  searchResultFilters: FilterResult[];
  searchResults: SearchProduct[];
};

const MAXIMUM_VISIBLE_BRANDS = 15;
const INITIAL_VISIBLE_COUNT = 4;

const CLASSES = {
  optionWrapper: 'flex items-center text-sm justify-between mb-1',
  filterWrapper: 'flex items-center mb-6 flex-wrap select-none cursor-pointer',
  filterHeader: 'flex flex-row w-full justify-between items-center border-b',
  filterTitle:
    'text-md font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-white pb-1',
  optionCount: 'text-gray-500 text-sm',
  showMoreButton:
    'mt-2 flex items-center text-xs focus:outline-none hover:text-ps-lightblue-600',
  optionsSection: 'basis-full overflow-x-auto transition-all select-text pt-2',
};

const FilterSection: FC<FilterSectionProps> = memo(
  ({
    filters,
    onFilterChange,
    onSliderChange,
    activeFilters,
    availableFilters,
    hasSearchTerm,
    searchResultFilters,
    searchResults,
  }) => {
    const {t} = useTranslation('common');
    const [expandedOptions, setExpandedOptions] = useState<
      Record<string, boolean>
    >({});
    const [collapsedFilters, setCollapsedFilters] = useState<
      Record<string, boolean>
    >({});
    const [brands, setBrands] = useState<Brand[]>([]);

    // Fetch brands on mount
    useEffect(() => {
      const fetchBrands = async () => {
        try {
          const fetchedBrands = await foodbookService.fetchBrands();
          setBrands(fetchedBrands);
        } catch (error) {
          console.error('Error fetching brands:', error);
        }
      };

      fetchBrands();
    }, []);

    // Get result count for specific filter option
    const getOptionResultCount = useCallback(
      (filterKey: string, optionId: number): number => {
        const filterResult = searchResultFilters?.find(
          r => r.key === filterKey && r.id === optionId,
        );
        return filterResult?.results || 0;
      },
      [searchResultFilters],
    );

    // Create brand filter
    const brandFilter = useMemo(() => {
      const uniqueBrandOptions = new Map<string, FilterOption>();
      const brandResults = searchResultFilters?.filter(f => f.key === 'Brand');

      // Process each brand
      brands.forEach(brand => {
        const brandResult = brandResults?.find(r => brand.id.includes(r.id));
        const count = brandResult?.results || 0;
        const isActive = activeFilters.some(
          f => f.key === 'Brand' && brand.id.some(id => f.values?.includes(id)),
        );

        if (count > 0 || isActive) {
          uniqueBrandOptions.set(brand.name, {
            id: brand.id[0],
            name: brand.name,
            count,
          });
        }
      });

      // Convert to array and sort by count
      let options = Array.from(uniqueBrandOptions.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, MAXIMUM_VISIBLE_BRANDS);

      // Add active brands that might not be in top results
      activeFilters
        .filter(f => f.key === 'Brand')
        .forEach(filter => {
          filter.values?.forEach(value => {
            const activeBrand = brands.find(b => b.id.includes(value));
            if (
              activeBrand &&
              !options.some(o => o.name === activeBrand.name)
            ) {
              options.push({
                id: value,
                name: activeBrand.name,
                count: getOptionResultCount('Brand', value),
              });
            }
          });
        });

      return {
        id: 'brand',
        key: 'Brand',
        name: 'Brand',
        filterType: FilterType.Checkbox,
        options,
        showInitially: true,
        results: options.length,
      };
    }, [brands, searchResultFilters, activeFilters, getOptionResultCount]);

    // Combine brand filter with other filters
    const visibleFilters = useMemo(
      () => [brandFilter, ...filters],
      [filters, brandFilter],
    );

    // Handle option expansion toggle
    const toggleOptionExpansion = useCallback(
      (filterId: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setExpandedOptions(prev => ({
          ...prev,
          [filterId]: !prev[filterId],
        }));
      },
      [],
    );

    // Handle filter collapse toggle
    const toggleFilterCollapse = useCallback((filterId: string) => {
      setCollapsedFilters(prev => ({
        ...prev,
        [filterId]: !prev[filterId],
      }));
    }, []);

    // Render filter options
    const renderFilterOptions = useCallback(
      (filter: Filter) => {
        if (filter.options.length === 0) {
          return null;
        }

        if (filter.key === 'Brand') {
          return renderOptions(filter, filter.options);
        }

        // Process options for non-brand filters
        const processedOptions = filter.options
          .map(option => ({
            ...option,
            count: getOptionResultCount(filter.key, option.id),
          }))
          .filter(option => {
            const isActive = activeFilters.some(
              f => f.key === filter.key && f.values?.includes(option.id),
            );
            return option.count > 0 || isActive;
          });

        if (processedOptions.length === 0) {
          return null;
        }

        return renderOptions(filter, processedOptions);
      },
      [activeFilters, getOptionResultCount],
    );

    // Render individual options
    const renderOptions = useCallback(
      (filter: Filter, options: FilterOption[]) => {
        const visibleOptions = expandedOptions[filter.id]
          ? options
          : options.slice(0, INITIAL_VISIBLE_COUNT);

        return (
          <>
            {visibleOptions.map(option => {
              const brandInfo =
                filter.key === 'Brand'
                  ? brands.find(b => b.name === option.name)
                  : null;

              const brandIds = brandInfo?.id || [option.id];

              const isActive = brandIds.some(id =>
                activeFilters.some(
                  f => f.key === filter.key && f.values?.includes(id),
                ),
              );

              return (
                <div
                  key={`${option.name}-${option.id}`}
                  className={CLASSES.optionWrapper}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${filter.id}-${option.id}`}
                      onChange={e => {
                        if (filter.key === 'Brand' && brandInfo) {
                          brandInfo.id.forEach(id => {
                            onFilterChange(filter.key, id, e.target.checked);
                          });
                        } else {
                          onFilterChange(
                            filter.key,
                            option.id,
                            e.target.checked,
                          );
                        }
                      }}
                      checked={isActive}
                      className={styles.filterCheckbox}
                    />
                    <label htmlFor={`${filter.id}-${option.id}`}>
                      {option.name}
                    </label>
                  </div>
                  <span className={CLASSES.optionCount}>({option.count})</span>
                </div>
              );
            })}

            {options.length > INITIAL_VISIBLE_COUNT && (
              <button
                onClick={e => toggleOptionExpansion(filter.id, e)}
                className={CLASSES.showMoreButton}
              >
                {expandedOptions[filter.id] ? (
                  <>
                    <FaChevronUp className="w-3 h-3 mr-1" />
                    {t('filter.showLess')}
                  </>
                ) : (
                  <>
                    <FaChevronDown className="w-3 h-3 mr-1" />
                    {t('filter.showMore')}
                  </>
                )}
              </button>
            )}
          </>
        );
      },
      [
        expandedOptions,
        brands,
        activeFilters,
        onFilterChange,
        t,
        toggleOptionExpansion,
      ],
    );

    return (
      <>
        {visibleFilters.map(filter => {
          const filterOptions = renderFilterOptions(filter);

          if (!filterOptions) {
            return null;
          }

          return (
            <div key={filter.id} className={CLASSES.filterWrapper}>
              {filter.options.length > 0 && (
                <>
                  <Container
                    className={CLASSES.filterHeader}
                    onClick={() => toggleFilterCollapse(filter.id)}
                  >
                    <h4 className={CLASSES.filterTitle}>
                      {t(`filter.${camelCase(filter?.key)}`)}
                    </h4>

                    {collapsedFilters[filter.id] ? (
                      <FaChevronDown className="w-4 h-4 mr-1" />
                    ) : (
                      <FaChevronUp className="w-4 h-4 mr-1" />
                    )}
                  </Container>

                  {!collapsedFilters[filter.id] && (
                    <Section className={CLASSES.optionsSection}>
                      {filterOptions}
                    </Section>
                  )}
                </>
              )}
            </div>
          );
        })}
      </>
    );
  },
);

FilterSection.displayName = 'FilterSection';

export default FilterSection;
