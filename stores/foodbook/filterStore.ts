import {Filter} from '@/types';
import {create} from 'zustand';

interface FilterStoreState {
  keyword: string;
  filters: Filter[];
  pageIndex: number;
  pageSize: number;
  setKeyword: (keyword: string) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setInitialFilters: (filters: Filter[]) => void;
  addFilterValue: (filterKey: string, value: number) => void;
  removeFilterValue: (filterKey: string, value: number) => void;
  clearFilters: () => void;
  setRangeFilter: (
    filterKey: string,
    id: number,
    min: number,
    max: number,
  ) => void;
}

const useFilterStore = create<FilterStoreState>(set => ({
  keyword: '',
  filters: [],
  pageIndex: 0,
  pageSize: 21,
  setKeyword: keyword => set({keyword}),
  setPageIndex: pageIndex => set({pageIndex}),
  setPageSize: pageSize => set({pageSize}),
  setInitialFilters: filters => set({filters}),
  addFilterValue: (filterKey, value) =>
    set(state => {
      const filters = state.filters.map(filter => {
        if (filter.key === filterKey) {
          return {
            ...filter,
            values: filter.values ? [...filter.values, value] : [value],
          };
        }
        return filter;
      });
      return {filters};
    }),
  removeFilterValue: (filterKey, value) =>
    set(state => {
      const filters = state.filters.map(filter => {
        if (filter.key === filterKey) {
          return {
            ...filter,
            values: filter.values?.filter(v => v !== value),
          };
        }
        return filter;
      });
      return {filters};
    }),
  clearFilters: () => set({filters: []}),
  setRangeFilter: (filterKey, id, min, max) =>
    set(state => {
      const filters = state.filters.map(filter => {
        if (filter.key === filterKey) {
          return {
            ...filter,
            itemBetween: [
              {
                id: id,
                minimal: min,
                maximum: max,
              },
            ],
          };
        }
        return filter;
      });

      // Als de filter nog niet bestaat, voeg deze toe
      // if (!filters.some(filter => filter.key === filterKey)) {
      //   filters.push({
      //     key: filterKey,
      //     itemBetween: [
      //       {
      //         id: id,
      //         minimal: min,
      //         maximum: max
      //       }
      //     ]
      //   });
      // }

      return {filters};
    }),
}));

export default useFilterStore;
