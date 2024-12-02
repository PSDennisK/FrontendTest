'use client';

import {Container} from '@/components/ui/Layout';
import {Culture, Summary} from '@/types';
import {formatShortDate} from '@/utils/formats/dateTimeFormat';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'text-sm mb-4',
} as const;

type FooterDetailsProps = {
  summary: Summary;
  locale: keyof typeof Culture;
};

const FooterDetails: FC<FooterDetailsProps> = memo(({summary, locale}) => {
  const {t} = useTranslation('common');

  if (!summary?.lastupdatedon) return null;

  return (
    <Container className={CLASSES.container}>
      {t('productsheet.lastupdatedon')}{' '}
      {formatShortDate(summary.lastupdatedon, locale)}
    </Container>
  );
});

FooterDetails.displayName = 'FooterDetails';

export default FooterDetails;
