'use client';

import {useChangeLanguage} from '@/app/hooks/useChangeLanguage';
import {Container} from '@/components/ui/Layout';
import {locales} from '@/i18n';
import '@/node_modules/flag-icons/css/flag-icons.min.css';
import {Culture} from '@/types';
import {type FC, useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FaChevronDown} from 'react-icons/fa6';

type LanguageButtonProps = {
  locale: keyof typeof Culture;
  currentLocale: keyof typeof Culture;
  onSelect: (locale: keyof typeof Culture) => void;
  label: string;
};

const BUTTON_BASE_CLASSES = `
  inline-flex w-full items-center whitespace-nowrap px-3 py-2 text-sm
  hover:bg-neutral-100 active:text-neutral-800 
  dark:text-neutral-200 dark:hover:bg-neutral-600
`;

const DROPDOWN_CLASSES = `
  absolute right-0 z-50 mt-1 min-w-[150px] rounded-lg 
  border border-neutral-200 bg-white py-1 shadow-lg 
  dark:border-neutral-700 dark:bg-neutral-800
`;

const TOGGLE_BUTTON_CLASSES = `
  flex items-center gap-1 px-3 md:px-0 rounded-lg cursor-pointer 
  text-ps-blue-900 focus:outline-none
`;

const LanguageButton: FC<LanguageButtonProps> = ({
  locale,
  currentLocale,
  onSelect,
  label,
}) => {
  const flagCode = locale === 'en' ? 'gb' : locale;
  const isSelected = locale === currentLocale;

  return (
    <button
      className={`${BUTTON_BASE_CLASSES} ${
        isSelected ? 'bg-neutral-100 dark:bg-neutral-600' : 'bg-transparent'
      }`}
      onClick={() => onSelect(locale)}
      role="menuitem"
    >
      <span className="flex items-center gap-2">
        <span className={`fi fi-${flagCode}`} aria-hidden="true" />
        <span>{label}</span>
      </span>
    </button>
  );
};

interface LanguageSwitcherProps {
  locale: keyof typeof Culture;
}

/**
 * Language switcher component with dropdown menu
 * Handles keyboard navigation and click outside
 */
const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  locale: currentLocale,
}) => {
  const {t} = useTranslation('common');
  const changeLanguage = useChangeLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current?.contains(event.target as Node)) return;
    setIsOpen(false);
  }, []);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  const handleLanguageSelect = useCallback(
    (newLocale: keyof typeof Culture) => {
      changeLanguage(newLocale);
      setIsOpen(false);
    },
    [changeLanguage],
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClickOutside, handleEscape]);

  const flagCode = currentLocale === 'en' ? 'gb' : currentLocale;
  const currentLanguageLabel = t('common.currentLanguage');

  return (
    <Container className="relative print:hidden" ref={containerRef}>
      <button
        suppressHydrationWarning
        className={TOGGLE_BUTTON_CLASSES}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={currentLanguageLabel}
        title={currentLanguageLabel}
      >
        <span className={`fi fi-${flagCode}`} aria-hidden="true" />
        <FaChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          className={DROPDOWN_CLASSES}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-button"
        >
          {locales.map(locale => (
            <LanguageButton
              key={locale}
              locale={locale}
              currentLocale={currentLocale}
              onSelect={handleLanguageSelect}
              label={t(`common.${locale}`)}
            />
          ))}
        </ul>
      )}
    </Container>
  );
};

export default LanguageSwitcher;
