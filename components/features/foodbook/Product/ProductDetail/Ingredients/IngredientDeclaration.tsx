'use client';

import {useTranslatedValue} from '@/app/hooks/useTranslatedValue';
import {Description} from '@/types';
import {toHtmlEntities} from '@/utils/helpers';
import {FC, memo} from 'react';

type IngredientDeclarationProps = {
  ingredientdeclaration: Description;
};

const IngredientDeclaration: FC<IngredientDeclarationProps> = memo(
  ({ingredientdeclaration}) => {
    const translatedDeclaration = useTranslatedValue(ingredientdeclaration);

    if (!translatedDeclaration) return null;

    return (
      <p
        className="my-3 print:text-sm"
        dangerouslySetInnerHTML={{
          __html: toHtmlEntities(translatedDeclaration),
        }}
      />
    );
  },
);

IngredientDeclaration.displayName = 'IngredientDeclaration';

export default IngredientDeclaration;
