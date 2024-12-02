'use client';

import FallbackImage from '@/components/ui/Image/FallbackImage';
import {Container} from '@/components/ui/Layout';
import {Qualitymarkinfo} from '@/types';
import {getHighResImageUrl} from '@/utils/helpers';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mx-auto relative mb-8 lg:mb-10 xl:mb-12',
  title: 'text-2xl font-semibold leading-6 mb-4',
  marksGrid: 'flex flex-wrap gap-5',
  image: 'w-auto max-h-12 object-contain',
} as const;

type QualitymarksProps = {
  qualitymarks: Qualitymarkinfo | Qualitymarkinfo[];
};

const Qualitymarks: FC<QualitymarksProps> = memo(({qualitymarks}) => {
  const {t} = useTranslation('common');

  if (!qualitymarks) return null;

  const marks = Array.isArray(qualitymarks) ? qualitymarks : [qualitymarks];
  if (marks.length === 0) return null;

  return (
    <Container id="qualitymarks">
      <Container className={CLASSES.container}>
        <h2 className={CLASSES.title}>{t('product.qualityMarks')}</h2>
        <Container className={CLASSES.marksGrid}>
          {marks.map(mark => (
            <FallbackImage
              key={mark.id}
              itemProp="image"
              id={mark.name?.value}
              src={getHighResImageUrl(mark.logo)}
              title={mark.name?.value}
              alt={mark.name?.value || t('common.qualityMarkImage')}
              width={100}
              height={100}
              className={CLASSES.image}
              loading="lazy"
            />
          ))}
        </Container>
      </Container>
    </Container>
  );
});

Qualitymarks.displayName = 'Qualitymarks';

export default Qualitymarks;
