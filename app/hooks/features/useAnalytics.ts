import {useCallback} from 'react';

export type AnalyticsCategory =
  | 'filters'
  | 'search'
  | 'product'
  | 'interaction';

export type AnalyticsAction =
  | 'filter_changed'
  | 'filters_reset'
  | 'filters_restored'
  | 'filters_updated'
  | 'nutritional_value_changed'
  | 'search_performed'
  | 'search_refined'
  | 'view_item'
  | 'select_item';

// Base event data type with common properties
interface BaseEventData {
  timestamp?: string;
  [key: string]: any; // Allow additional properties
}

// Specific event type interfaces
interface FilterChangeEventData extends BaseEventData {
  event_type: 'filter_change';
  filter_key: string;
  option_id: number | string;
  action: 'added' | 'removed';
}

interface FilterResetEventData extends BaseEventData {
  event_type: 'filter_reset';
  filter_count: number;
  nutritional_value_count: number;
}

interface NutritionalValueEventData extends BaseEventData {
  event_type: 'nutritional_value';
  nutritional_value_id: number;
  new_value: number;
  previous_value?: number;
  change_amount?: number | null;
}

// Use BaseEventData as the main type for flexibility
type EventData = BaseEventData;

export const ANALYTICS_CATEGORY = {
  FILTERS: 'filters',
  SEARCH: 'search',
  PRODUCT: 'product',
  INTERACTION: 'interaction',
} as const;

export const ANALYTICS_ACTION = {
  FILTER_CHANGED: 'filter_changed',
  FILTERS_RESET: 'filters_reset',
  FILTERS_RESTORED: 'filters_restored',
  FILTERS_UPDATED: 'filters_updated',
  NUTRITIONAL_VALUE_CHANGED: 'nutritional_value_changed',
  SEARCH_PERFORMED: 'search_performed',
  SEARCH_REFINED: 'search_refined',
  VIEW_ITEM: 'view_item',
  SELECT_ITEM: 'select_item',
} as const;

/**
 * Custom hook for Google Analytics tracking
 */
export function useAnalytics() {
  const trackEvent = useCallback(
    (
      action: AnalyticsAction,
      eventData: EventData,
      category: AnalyticsCategory = 'interaction',
    ) => {
      try {
        if (typeof window === 'undefined' || !window.gtag) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Analytics Event:', {
              action,
              category,
              ...eventData,
            });
          }
          return;
        }

        window.gtag('event', action, {
          event_category: category,
          ...eventData,
          timestamp: eventData?.timestamp || new Date().toISOString(),
        });
      } catch (error) {
        console.warn('Analytics Error:', error);
      }
    },
    [],
  );

  const trackFilterEvent = useCallback(
    (action: AnalyticsAction, eventData: EventData) => {
      trackEvent(action, eventData, 'filters');
    },
    [trackEvent],
  );

  const trackFilterChange = useCallback(
    (filterKey: string, optionId: number | string, checked: boolean) => {
      trackFilterEvent(ANALYTICS_ACTION.FILTER_CHANGED, {
        event_type: 'filter_change',
        filter_key: filterKey,
        option_id: optionId,
        action: checked ? 'added' : 'removed',
        timestamp: new Date().toISOString(),
      });
    },
    [trackFilterEvent],
  );

  const trackFilterReset = useCallback(
    (filterCount: number, nutritionalValueCount: number) => {
      trackFilterEvent(ANALYTICS_ACTION.FILTERS_RESET, {
        event_type: 'filter_reset',
        filter_count: filterCount,
        nutritional_value_count: nutritionalValueCount,
        timestamp: new Date().toISOString(),
      });
    },
    [trackFilterEvent],
  );

  const trackNutritionalValueChange = useCallback(
    (id: number, value: number, previousValue?: number) => {
      trackFilterEvent(ANALYTICS_ACTION.NUTRITIONAL_VALUE_CHANGED, {
        event_type: 'nutritional_value',
        nutritional_value_id: id,
        new_value: value,
        previous_value: previousValue,
        change_amount: previousValue ? value - previousValue : null,
        timestamp: new Date().toISOString(),
      });
    },
    [trackFilterEvent],
  );

  return {
    trackEvent,
    trackFilterEvent,
    trackFilterChange,
    trackFilterReset,
    trackNutritionalValueChange,
    ANALYTICS_ACTION,
    ANALYTICS_CATEGORY,
  };
}

export type {
  BaseEventData,
  EventData,
  FilterChangeEventData,
  FilterResetEventData,
  NutritionalValueEventData,
};
