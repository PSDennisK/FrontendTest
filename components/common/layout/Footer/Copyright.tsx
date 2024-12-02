import {createTranslation} from '@/i18n';
import {Culture} from '@/types';
import {FC} from 'react';

interface CopyrightProps {
  className?: string;
  locale: keyof typeof Culture;
}

/**
 * Copyright component that displays copyright information in the specified locale
 * @param className - Optional CSS classes for styling
 * @param locale - The locale to use for translations
 */
const Copyright: FC<CopyrightProps> = async ({className, locale}) => {
  if (!Object.keys(Culture).includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const t = await createTranslation(locale, 'common');
  const currentYear = new Date().getFullYear();

  return (
    <span
      className={`mt-4 text-sm text-neutral-400 sm:order-first sm:mt-0 ${className ?? ''}`}
    >
      &copy; {currentYear} {t('common.psInFoodService')}.{' '}
      <span className="block sm:inline">{t('footer.allRightsReserved')}.</span>
    </span>
  );
};

export default Copyright;
