'use client';

import {useTranslatedValue} from '@/app/hooks/useTranslatedValue';
import {Container} from '@/components/ui/Layout';
import {Description} from '@/types';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-lg font-semibold leading-6 mb-2',
  content: 'mb-2',
  paragraph: 'text-normal mb-4 print:text-sm',
} as const;

type ProductDescriptionProps = {
  description: Description;
};

const ProductDescription: FC<ProductDescriptionProps> = memo(
  ({description}) => {
    const {t} = useTranslation('common');
    const content = useTranslatedValue(description);

    if (!content) return null;

    const sections = content.split('\r\n');

    return (
      <Container className={CLASSES.container}>
        <h2 className={CLASSES.title}>{t('product.description')}</h2>

        <div itemProp="description" className={CLASSES.content}>
          {sections.map((section, index) => (
            <p key={index} className={CLASSES.paragraph}>
              {section}
            </p>
          ))}
        </div>
      </Container>
    );
  },
);

ProductDescription.displayName = 'ProductDescription';

export default ProductDescription;
