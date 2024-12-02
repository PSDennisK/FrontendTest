'use client';

import {Container} from '@/components/ui/Layout';
import {foodbookService} from '@/services';
import Image from 'next/image';
import {FC, memo, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'flex-1 text-sm leading-5',
  title: 'block font-semibold',
  subtitle: 'block text-[11px] font-semibold',
  image: 'max-w-[110px] h-auto object-contain',
} as const;

type PSImpactScoreProps = {
  mongoDbId: string;
};

const PSImpactScore: FC<PSImpactScoreProps> = memo(({mongoDbId}) => {
  const {t} = useTranslation('common');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!mongoDbId || mongoDbId === '000000000000000000000000') return;

    let objectUrl: string | null = null;

    const fetchImage = async () => {
      try {
        const blob = await foodbookService.fetchImpactScoreFarm(mongoDbId);
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error('Failed to fetch impact score:', error);
      }
    };

    fetchImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [mongoDbId]);

  if (!mongoDbId || !imageUrl) return null;

  return (
    <Container className={CLASSES.container}>
      <span
        className={CLASSES.title}
        dangerouslySetInnerHTML={{__html: t('product.carbonEmissions')}}
      />
      <span className={CLASSES.subtitle}>{t('product.farmToFarm')}</span>

      <Image
        src={imageUrl}
        alt={t('product.carbonFootprint')}
        title={t('product.carbonFootprint')}
        width={110}
        height={30}
        className={CLASSES.image}
        priority={false}
      />
    </Container>
  );
});

PSImpactScore.displayName = 'PSImpactScore';

export default PSImpactScore;
