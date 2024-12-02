'use client';

import useDarkMode from '@/app/hooks/features/useDarkMode';
import {type FC, memo, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {HiOutlineMoon, HiOutlineSun} from 'react-icons/hi2';

type Theme = 'light' | 'dark';

const ICON_CLASSES = 'text-lg text-ps-blue-800';
const BUTTON_CLASSES =
  'inline-flex relative pr-5 focus:outline-none rounded-sm';

/**
 * Component that toggles between light and dark mode
 * Uses system preferences as initial value
 */
const DarkmodeSwitcher: FC = memo(() => {
  const {t} = useTranslation('common');
  const [colorTheme, setTheme] = useDarkMode();

  // Check system preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // If no theme has been set yet, use system preference
    if (!localStorage.getItem('theme')) {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }

    const handleChange = (e: MediaQueryListEvent) => {
      // Adjust only if the user has not yet set an explicit preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme: Theme = colorTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const isLight = colorTheme === 'light';
  const label = isLight ? t('common.useLightMode') : t('common.useDarkMode');

  return (
    <button
      type="button"
      id={isLight ? 'lightmode' : 'darkmode'}
      title={label}
      aria-label={label}
      onClick={toggleTheme}
      className={BUTTON_CLASSES}
    >
      {isLight ? (
        <HiOutlineSun className={ICON_CLASSES} aria-hidden="true" />
      ) : (
        <HiOutlineMoon className={ICON_CLASSES} aria-hidden="true" />
      )}
    </button>
  );
});

DarkmodeSwitcher.displayName = 'DarkmodeSwitcher';

export default DarkmodeSwitcher;
