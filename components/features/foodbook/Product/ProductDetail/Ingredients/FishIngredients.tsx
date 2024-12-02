'use client';

import {Container} from '@/components/ui/Layout';
import {Culture, Fishingredientinfo} from '@/types';
import {getTranslationValue} from '@/utils/helpers';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  table: 'w-full text-left text-sm',
  header: {
    row: 'border-b',
    cell: 'p-2',
    container: 'bg-gray-50 dark:bg-gray-700',
  },
  row: 'border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800',
  cell: 'p-2',
} as const;

const TABLE_HEADERS = [
  'product.ingredientName',
  'product.latinNameFish',
  'product.captureMethod',
  'product.catchZone',
  'product.countryOfOriginFish',
] as const;

type FishIngredientsInfoProps = {
  fishingredientinfo: Fishingredientinfo;
  locale: keyof typeof Culture;
};

const FishIngredientsInfo: FC<FishIngredientsInfoProps> = memo(
  ({fishingredientinfo, locale}) => {
    if (!fishingredientinfo) return null;

    const catchzoneinfo = Array.isArray(
      fishingredientinfo.catchzoneinfolist?.catchzoneinfo,
    )
      ? fishingredientinfo.catchzoneinfolist.catchzoneinfo
      : [fishingredientinfo.catchzoneinfolist?.catchzoneinfo];

    return (
      <tr className={CLASSES.row}>
        <td className={CLASSES.cell}>
          {fishingredientinfo.ingredientname?.value}
        </td>
        <td className={CLASSES.cell}>
          {getTranslationValue(
            fishingredientinfo.translation,
            locale,
            fishingredientinfo.fishname?.value,
          )}
        </td>
        <td className={CLASSES.cell}>
          {getTranslationValue(
            fishingredientinfo.capturemethod,
            locale,
            fishingredientinfo.capturemethodname?.value,
          )}
        </td>
        <td className={CLASSES.cell}>
          {catchzoneinfo.map((zone, index) => (
            <div key={index}>
              {getTranslationValue(
                zone?.translation,
                locale,
                zone?.name?.value,
              )}
            </div>
          ))}
        </td>
        <td className={CLASSES.cell}>
          {fishingredientinfo.countryoforiginname?.value}
        </td>
      </tr>
    );
  },
);

type FishIngredientsProps = {
  fishingredientinfos: Fishingredientinfo[];
  locale: keyof typeof Culture;
};

const FishIngredients: FC<FishIngredientsProps> = memo(
  ({fishingredientinfos, locale}) => {
    const {t} = useTranslation('common');

    if (!fishingredientinfos?.length) return null;

    return (
      <Container id="fishingredient" className={CLASSES.container}>
        <h2 className={CLASSES.title}>{t('product.originOfFish')}</h2>
        <table className={CLASSES.table}>
          <thead className={CLASSES.header.container}>
            <tr className={CLASSES.header.row}>
              {TABLE_HEADERS.map(header => (
                <th key={header} className={CLASSES.header.cell}>
                  {t(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fishingredientinfos.map(info => (
              <FishIngredientsInfo
                key={info.id}
                fishingredientinfo={info}
                locale={locale}
              />
            ))}
          </tbody>
        </table>
      </Container>
    );
  },
);

FishIngredientsInfo.displayName = 'FishIngredientsInfo';
FishIngredients.displayName = 'FishIngredients';

export default FishIngredients;
