import {SearchFilterFilter} from '@/types';

export type SavedFilters = {
  activeFilters: SearchFilterFilter[];
  nutritionalValues: NutritionalValue[];
};

export type NutritionalValue = {
  id: number;
  name: string;
  minValue: number;
  maxValue: number;
  currentValue: number;
};
