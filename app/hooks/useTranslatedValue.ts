import {LocaleTypes} from '@/i18n/settings';
import {TranslationInput} from '@/types';

import {getTranslatedValue} from '@/utils/helpers';
import {useParams} from 'next/navigation';

export const useTranslatedValue = (
  input: TranslationInput,
  fallback: string = '',
) => {
  const locale = useParams()?.locale as LocaleTypes;

  if (!locale) {
    console.warn('Locale not found in params. Using fallback value.');
    return fallback;
  }

  return getTranslatedValue(input, locale, fallback);
};
