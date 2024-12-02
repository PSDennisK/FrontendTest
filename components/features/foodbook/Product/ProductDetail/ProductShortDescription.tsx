'use client';

import {Culture, Description} from '@/types';
import {getTranslatedValue} from '@/utils/helpers';
import React, {useMemo} from 'react';

interface ProductShortDescriptionProps {
  description: Description;
  locale: keyof typeof Culture;
}

const ProductShortDescription: React.FC<ProductShortDescriptionProps> = ({
  description,
  locale,
}) => {
  const content = useMemo(() => {
    if (!description) return null;
    return (
      getTranslatedValue(description.translation, locale) || description.value
    );
  }, [description, locale]);

  if (!content) return null;

  return (
    <p
      itemProp="description"
      className="text-normal mb-4 leading-7 print:text-sm"
    >
      {content}
    </p>
  );
};

export default React.memo(ProductShortDescription);
