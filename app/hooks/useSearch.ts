import {foodbookService} from '@/services';
import {Culture, Suggestions} from '@/types';
import {debounce} from 'lodash';
import {useCallback, useEffect, useState} from 'react';

export const useSearch = (locale: keyof typeof Culture) => {
  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestions>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearSearch = useCallback(() => {
    setKeyword('');
    setSuggestions(null);
    setShowSuggestions(false);
    setError(null);
  }, []);

  const fetchSuggestions = useCallback(
    debounce(async (usedKeyword: string) => {
      if (usedKeyword.length < 2) {
        setSuggestions(null);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const results = await foodbookService.fetchAutocomplete(
          usedKeyword,
          locale,
        );
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions(null);
        setError('Failed to fetch suggestions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [locale],
  );

  useEffect(() => {
    fetchSuggestions(keyword);
  }, [keyword, fetchSuggestions]);

  return {
    keyword,
    setKeyword,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    isLoading,
    clearSearch,
    error,
  };
};
