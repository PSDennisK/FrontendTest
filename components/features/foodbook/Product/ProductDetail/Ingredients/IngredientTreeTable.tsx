'use client';

import {Container} from '@/components/ui/Layout';
import {Countryoforigins, Culture, Ingredientinfo} from '@/types';
import {getTranslationValue} from '@/utils/helpers';
import {isArray} from 'lodash';
import {FC, ReactNode, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'my-6',
  title: 'text-lg font-semibold leading-4 mb-4',
  table: 'w-full text-sm text-left',
  row: 'border-b odd:bg-white even:bg-gray-50',
  cell: 'p-2',
} as const;

type IngredientTreeTableProps = {
  ingredientinfo: Ingredientinfo[];
  locale: keyof typeof Culture;
  depth?: number;
};

const getCountryNames = (
  countryoforigins?: Countryoforigins,
  locale?: keyof typeof Culture,
): string => {
  if (!countryoforigins?.countryoforigin) return '';

  const countries = isArray(countryoforigins.countryoforigin)
    ? countryoforigins.countryoforigin
    : [countryoforigins.countryoforigin];

  return countries
    .map(c => getTranslationValue(c.translation, locale, c.name.value))
    .filter(Boolean)
    .join(', ');
};

const IngredientTreeTable: FC<IngredientTreeTableProps> = memo(
  ({ingredientinfo, locale, depth = 0}) => {
    const {t} = useTranslation('common');

    if (!ingredientinfo) return null;

    const renderIngredientRow = (
      ingredient: Ingredientinfo,
      rowDepth: number,
    ) => {
      if (!ingredient) return null;

      const paddingLeft = rowDepth * 15;
      const percentage = ingredient.percentage
        ? `${ingredient.percentage}%`
        : '';

      return (
        <tr key={`${ingredient.id}-${rowDepth}`} className={CLASSES.row}>
          <td className={CLASSES.cell}>
            <span style={{paddingLeft: `${paddingLeft}px`}}>
              {getTranslationValue(ingredient.name, locale)}
            </span>
          </td>
          <td className={CLASSES.cell}>{percentage}</td>
          <td className={CLASSES.cell}>
            {getCountryNames(ingredient.countryoforigins, locale)}
          </td>
        </tr>
      );
    };

    const renderIngredientTree = (
      currentIngredients: Ingredientinfo[],
      currentDepth: number,
    ): ReactNode[] => {
      if (!currentIngredients) return [];

      const ingredients = isArray(currentIngredients)
        ? currentIngredients
        : [currentIngredients];

      return ingredients
        .sort((a, b) => Number(a.sequence) - Number(b.sequence))
        .map(ingredient => {
          const rows = [renderIngredientRow(ingredient, currentDepth)];

          return rows;
        })
        .flat();
    };

    return (
      <Container id="ingredientstree" className={CLASSES.container}>
        <h3 className={CLASSES.title}>
          {t('productsheet.ingredientsInTable')}
        </h3>
        <table className={CLASSES.table}>
          <thead>
            <tr className={CLASSES.row}>
              <th className={CLASSES.cell}>{t('product.ingredient')}</th>
              <th className={CLASSES.cell}>{t('product.percentage')}</th>
              <th className={CLASSES.cell}>{t('product.countryOfOrigin')}</th>
            </tr>
          </thead>
          <tbody>{renderIngredientTree(ingredientinfo, depth)}</tbody>
        </table>
      </Container>
    );
  },
);

IngredientTreeTable.displayName = 'IngredientTreeTable';

export default IngredientTreeTable;
