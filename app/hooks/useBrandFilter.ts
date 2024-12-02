import {SearchFilterFilter} from '@/types';
import {useCallback, useState} from 'react';

export const useBrandFilter = () => {
  const [activeFilters, setActiveFilters] = useState<SearchFilterFilter[]>([]);

  const handleBrandFilterChange = useCallback(
    (brandId: number[], checked: boolean) => {
      setActiveFilters(prev => {
        const brandFilterIndex = prev.findIndex(f => f.key === 'Brand');

        if (checked) {
          // Als het filter al bestaat, voeg de nieuwe waarde toe
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
          // Als het filter nog niet bestaat, maak een nieuwe aan
          return [...prev, {key: 'Brand', values: brandId}];
        } else {
          // Als unchecked, verwijder de waarde uit het filter
          if (brandFilterIndex > -1) {
            const updatedFilter = {...prev[brandFilterIndex]};
            updatedFilter.values = updatedFilter.values?.filter(
              id => !brandId.includes(id),
            );

            // Als er geen waarden meer zijn, verwijder het hele filter
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

  return {activeFilters, handleBrandFilterChange};
};
