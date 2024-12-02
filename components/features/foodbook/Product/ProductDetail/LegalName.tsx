'use client';

import {Container} from '@/components/ui/Layout';
import {Commercialinfo, Culture} from '@/types';
import {getTranslationValue} from '@/utils/helpers';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mt-4',
  wrapper: 'mb-4',
  label: 'font-semibold leading-6 print:text-sm',
} as const;

type LegalNameProps = {
  commercialinfo: Commercialinfo;
  locale: keyof typeof Culture;
};

const LegalName: FC<LegalNameProps> = memo(({commercialinfo, locale}) => {
  const {t} = useTranslation('common');

  if (!commercialinfo?.legalname?.value) return null;

  return (
    <Container id="legalname" className={CLASSES.container}>
      <div className={CLASSES.wrapper}>
        <span className={CLASSES.label}>{t('product.legalName')}:</span>{' '}
        {getTranslationValue(
          commercialinfo.name,
          locale,
          commercialinfo.legalname.value,
        )}
      </div>
    </Container>
  );
});

LegalName.displayName = 'LegalName';

export default LegalName;
