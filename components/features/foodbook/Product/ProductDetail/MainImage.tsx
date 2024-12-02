'use client';

import FallbackImage from '@/components/ui/Image/FallbackImage';
import {Container} from '@/components/ui/Layout';
import {Summary} from '@/types';
import {getHighResImageUrl} from '@/utils/helpers';
import {FC, memo} from 'react';

const CLASSES = {
  container: 'flex-1 max-w-44 mr-5 hidden print:block',
  image: 'p-2 my-0 border rounded mx-auto w-auto',
} as const;

type MainImageProps = {
  productsummary: Summary;
};

const MainImage: FC<MainImageProps> = memo(({productsummary}) => (
  <Container className={CLASSES.container}>
    <FallbackImage
      itemProp="image"
      id={productsummary?.id}
      src={getHighResImageUrl(productsummary?.packshot)}
      alt={productsummary?.name.value ?? ''}
      className={CLASSES.image}
      width={350}
      height={350}
      priority
      loading="eager"
    />
  </Container>
));

MainImage.displayName = 'MainImage';

export default MainImage;
