'use client';

import {Container} from '@/components/ui/Layout';

import {usePathname, useRouter} from 'next/navigation';
import NProgress from 'nprogress';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {AiOutlineLoading3Quarters} from 'react-icons/ai';
import {FaXmark} from 'react-icons/fa6';
import {HiOutlineMagnifyingGlass} from 'react-icons/hi2';

import {useSearch} from '@/app/hooks/useSearch';
import {fallbackLng, locales} from '@/i18n/settings';
import {Culture} from '@/types';
import {createSlug} from '@/utils/helpers';

type SearchFormProps = {
  locale: keyof typeof Culture;
  isHeaderSearch?: boolean;
};

type Suggestion = {
  id: number;
  name: string;
  type: 'product' | 'brand';
  href: string;
};

const SCROLL_DEBOUNCE_TIME = 100;
const BLUR_DELAY = 200;

const STYLES = {
  form: {
    container:
      'relative flex items-center overflow-hidden text-center rounded-xl z-10',
    input:
      'w-full h-12 px-6 py-2 text-sm md:text-base font-medium focus:outline-none',
    button: {
      base: 'inline-flex items-center h-12 px-4 text-base font-bold leading-6 text-white transition duration-150 ease-in-out',
      default:
        'bg-ps-blue-700 border border-transparent hover:bg-ps-blue-800 focus:outline-none active:bg-indigo-950',
      clear: 'text-2xl text-ps-blue-800 cursor-pointer absolute right-16',
    },
  },
  suggestions: {
    container:
      'absolute top-14 z-20 w-full rounded-xl text-left bg-white border border-slate-400/20 px-3.5 py-3 text-sm leading-5',
    group: {
      title:
        'relative mb-2 mt-2.5 text-sm font-semibold text-slate-500 after:h-[1px] after:absolute after:block after:bg-slate-200 after:top-1/2 after:w-full after:left-0 after:-translate-y-1/2',
      titleText: 'bg-white relative pr-2 z-10',
    },
    item: {
      base: 'flex w-full text-left items-center rounded-md p-1.5 cursor-pointer hover:bg-slate-50',
      focused: 'bg-slate-100',
    },
  },
  error:
    'absolute top-14 z-20 w-full rounded-xl bg-red-100 border border-red-400 text-red-700 px-4 py-3',
} as const;

const useVisibilityControl = (isHeaderSearch: boolean, isHomePage: boolean) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleScroll = useCallback(() => {
    if (!isHeaderSearch || !isHomePage) return;

    const heroSearchForm = document.querySelector('.hero-search-form');
    if (heroSearchForm instanceof HTMLElement) {
      const {bottom} = heroSearchForm.getBoundingClientRect();
      setIsVisible(bottom <= 0);
    }
  }, [isHeaderSearch, isHomePage]);

  useEffect(() => {
    if (!isHeaderSearch) {
      setIsVisible(true);
      setIsInitialized(true);
      return;
    }

    const scrollListener = () => window.requestAnimationFrame(handleScroll);

    const timer = setTimeout(() => {
      handleScroll();
      setIsInitialized(true);
      window.addEventListener('scroll', scrollListener);
    }, SCROLL_DEBOUNCE_TIME);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', scrollListener);
    };
  }, [handleScroll, isHeaderSearch]);

  return {isVisible, isInitialized};
};

const SearchForm: React.FC<SearchFormProps> = ({
  locale,
  isHeaderSearch = false,
}) => {
  const {t} = useTranslation('common');
  const pathname = usePathname();
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const {
    keyword,
    setKeyword,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    isLoading,
    clearSearch,
    error,
  } = useSearch(locale);

  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);

  const isHomePage = useMemo(() => {
    const homepagePaths = ['/', ...locales.map(loc => `/${loc}/`)];
    return homepagePaths.includes(pathname);
  }, [pathname]);

  const {isVisible, isInitialized} = useVisibilityControl(
    isHeaderSearch,
    isHomePage,
  );

  const handleSearch = useCallback(async () => {
    if (!keyword.trim()) return;

    NProgress.start();
    const baseUrl = locale === fallbackLng ? '/product' : `/${locale}/product`;
    const searchUrl = `${baseUrl}?search=${encodeURIComponent(keyword.trim())}`;

    await router.push(searchUrl);
  }, [keyword, locale, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions(null);
    handleSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSuggestions(null);
      setShowSuggestions(false);
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const getAllSuggestions = useCallback((): Suggestion[] => {
    const allSuggestions = [
      ...(suggestions?.products || []).map(item => ({
        ...item,
        type: 'product' as const,
      })),
      ...(suggestions?.brands || []).map(item => ({
        ...item,
        type: 'brand' as const,
      })),
    ];

    return allSuggestions.map(item => ({
      ...item,
      href: `/${locale}/${item.type}/${createSlug(item.id.toString(), item.name.trim())}`,
    }));
  }, [suggestions, locale]);

  const highlightKeyword = useCallback(
    (text: string) => {
      if (!keyword.trim()) return text;

      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escapedText = text.replace(
        /[&<>'"]/g,
        char =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;',
          })[char] || char,
      );

      const html = escapedText.replace(
        new RegExp(escapedKeyword, 'gi'),
        match => `<strong class="font-bold">${match}</strong>`,
      );

      return <span dangerouslySetInnerHTML={{__html: html}} />;
    },
    [keyword],
  );

  const handleSuggestionClick = useCallback(
    async (url: string) => {
      NProgress.start();
      clearSearch();
      await router.push(url);
    },
    [router, clearSearch],
  );

  const renderSuggestionGroup = useCallback(
    (items: any[], title: string, type: 'product' | 'brand') => {
      if (!items?.length) return null;

      return (
        <>
          <div className={STYLES.suggestions.group.title}>
            <span className={STYLES.suggestions.group.titleText}>
              {t(`search.${title}`)}
            </span>
          </div>
          {items.map(item => {
            const globalIndex = getAllSuggestions().findIndex(
              s => s.id === item.id && s.type === type,
            );

            return (
              <button
                key={item.id}
                className={`${STYLES.suggestions.item.base} ${
                  focusedSuggestionIndex === globalIndex
                    ? STYLES.suggestions.item.focused
                    : ''
                }`}
                onClick={() =>
                  handleSuggestionClick(
                    `/${locale}/${type}/${createSlug(item.id.toString(), item.name.trim())}`,
                  )
                }
                onMouseEnter={() => setFocusedSuggestionIndex(globalIndex)}
                onFocus={() => setFocusedSuggestionIndex(globalIndex)}
                tabIndex={0}
                role="option"
                aria-selected={focusedSuggestionIndex === globalIndex}
              >
                {highlightKeyword(item.name)}
              </button>
            );
          })}
        </>
      );
    },
    [
      focusedSuggestionIndex,
      getAllSuggestions,
      locale,
      t,
      highlightKeyword,
      handleSuggestionClick,
    ],
  );

  const showSuggestionsContent = useMemo(
    () =>
      showSuggestions &&
      Object.values(suggestions || {}).some(group => group.length > 0),
    [showSuggestions, suggestions],
  );

  const containerClassName = useMemo(() => {
    if (!isInitialized) return 'hidden';

    const baseClass =
      'relative w-full max-w-2xl mx-auto transition-opacity duration-300 ease-in-out';
    const visibilityClass = isHeaderSearch
      ? isVisible
        ? 'opacity-100 max-h-16 pointer-events-auto mt-2 md:mt-0'
        : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'
      : '';

    return `${baseClass} ${visibilityClass}`.trim();
  }, [isHeaderSearch, isVisible, isInitialized]);

  return (
    <Container className={containerClassName}>
      <form
        onSubmit={handleSubmit}
        className={STYLES.form.container}
        role="search"
        aria-label={t('common.searchLabel')}
      >
        <label htmlFor="search" className="sr-only">
          {t('common.search')}
        </label>
        <input
          id="search"
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), BLUR_DELAY)}
          onKeyDown={handleKeyDown}
          placeholder={t('common.searchPlaceholder')}
          className={STYLES.form.input}
          style={{
            fontSize: '16px',
            minHeight: '44px',
          }}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showSuggestionsContent}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
        />

        {!isLoading && keyword && (
          <button
            type="button"
            className={STYLES.form.button.clear}
            onClick={clearSearch}
            title={t('search.clear')}
            aria-label={t('search.clearLabel')}
          >
            <FaXmark />
          </button>
        )}

        <button
          type="submit"
          className={`${STYLES.form.button.base} ${STYLES.form.button.default}`}
          aria-label={t('search.submit')}
          disabled={isLoading}
        >
          {isLoading ? (
            <AiOutlineLoading3Quarters
              className="loading-icon text-2xl"
              aria-hidden="true"
            />
          ) : (
            <HiOutlineMagnifyingGlass className="text-2xl" aria-hidden="true" />
          )}
        </button>
      </form>

      {error && (
        <div className={STYLES.error} role="alert">
          <p>{error}</p>
        </div>
      )}

      {showSuggestionsContent && !error && (
        <div
          ref={suggestionsRef}
          id="search-suggestions"
          className={STYLES.suggestions.container}
          role="listbox"
        >
          {renderSuggestionGroup(suggestions?.products, 'products', 'product')}
          {renderSuggestionGroup(suggestions?.brands, 'brands', 'brand')}
        </div>
      )}
    </Container>
  );
};

export default React.memo(SearchForm);
