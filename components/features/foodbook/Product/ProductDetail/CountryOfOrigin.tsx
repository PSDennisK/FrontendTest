'use client';

import LegalName from '@/components/features/foodbook/Product/ProductDetail/LegalName';
import {Container} from '@/components/ui/Layout';
import {Commercialinfo, Culture, Productinfo} from '@/types';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  content: 'mb-4',
  title: 'text-xl font-semibold leading-6 mb-4',
  labelWrapper: 'space-y-2',
  label: 'font-semibold leading-6 print:text-sm',
} as const;

type CountryOfOriginProps = {
  productinfo: Productinfo;
  commercialinfo: Commercialinfo;
  locale: keyof typeof Culture;
};

const CountryOfOrigin: FC<CountryOfOriginProps> = memo(
  ({productinfo, commercialinfo, locale}) => {
    const {t} = useTranslation('common');

    if (!productinfo) return null;

    return (
      <Container id="countryoforigin" className={CLASSES.container}>
        <Container className={CLASSES.content}>
          <h2 className={CLASSES.title}>{t('product.origin')}</h2>

          <Container className={CLASSES.labelWrapper}>
            <span className={CLASSES.label}>{t('product.originCountry')}:</span>{' '}
            {productinfo.countryoforiginname?.value}
          </Container>

          <LegalName commercialinfo={commercialinfo} locale={locale} />
        </Container>
      </Container>
    );
  },
);

CountryOfOrigin.displayName = 'CountryOfOrigin';

export default CountryOfOrigin;
