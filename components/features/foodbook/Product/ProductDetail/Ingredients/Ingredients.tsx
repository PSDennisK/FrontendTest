'use client';

import IngredientComment from '@/components/features/foodbook/Product/ProductDetail/Ingredients/IngredientComment';
import IngredientDeclaration from '@/components/features/foodbook/Product/ProductDetail/Ingredients/IngredientDeclaration';
import IngredientTreeTable from '@/components/features/foodbook/Product/ProductDetail/Ingredients/IngredientTreeTable';
import {Container} from '@/components/ui/Layout';
import {Culture, Ingredientset} from '@/types';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  booleanProperty: 'print:text-sm',
} as const;

type BooleanPropertyProps = {
  label: string;
  value: string;
};

type IngredientsProps = {
  ingredientset: Ingredientset;
  locale: keyof typeof Culture;
  showIngredientTreeTable?: boolean;
};

const BooleanProperty: FC<BooleanPropertyProps> = memo(({label, value}) => {
  const {t} = useTranslation('common');

  return (
    <p className={CLASSES.booleanProperty}>
      {label}: {value === '1' ? t('common.yes') : t('common.no')}
    </p>
  );
});

const Ingredients: FC<IngredientsProps> = memo(
  ({ingredientset, locale, showIngredientTreeTable}) => {
    const {t} = useTranslation('common');

    if (!ingredientset) return null;

    return (
      <Container id="ingedrients" className={CLASSES.container}>
        <h2 className={CLASSES.title}>{t('product.ingredients')}</h2>

        <IngredientDeclaration
          ingredientdeclaration={ingredientset.ingredientdeclaration}
        />

        <IngredientComment
          ingredientcomment={ingredientset.ingredientcomment}
        />

        {showIngredientTreeTable && (
          <IngredientTreeTable
            ingredientinfo={ingredientset.ingredients?.ingredientinfo}
            locale={locale}
          />
        )}

        <BooleanProperty
          label={t('product.gmoFree')}
          value={ingredientset.isgmofree}
        />
        <BooleanProperty
          label={t('product.irradiated')}
          value={ingredientset.isirradiated}
        />
      </Container>
    );
  },
);

BooleanProperty.displayName = 'BooleanProperty';
Ingredients.displayName = 'Ingredients';

export default Ingredients;
