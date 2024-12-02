'use client';

import {Container} from '@/components/ui/Layout';
import {
  Allergeninfo,
  ContainmentLevel,
  Culture,
  Name,
  tabbedAllergens,
} from '@/types';
import {getTranslationValue} from '@/utils/helpers';
import {isArray} from 'lodash';
import {FC, Fragment, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {FaMinus, FaPlus, FaPlusMinus, FaRegCircle} from 'react-icons/fa6';

type AllergenFullProps = {
  allergens: Allergeninfo[];
  allergenComment: Name;
  locale: keyof typeof Culture;
};

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  legend: {
    table: 'w-1/2 mb-6 text-sm',
    header: 'border-b bg-gray-50 dark:bg-gray-700',
    cell: 'text-center px-2 py-1',
    iconRow: 'border-b',
    iconCell: 'p-2',
  },
  allergenTable: 'w-full text-sm',
  row: 'border-b odd:bg-white even:bg-gray-50',
  cell: {
    name: 'w-[25%] p-2',
    tabbed: 'pl-8',
    icon: 'w-[8%] text-center',
  },
  comments: 'mt-4',
  comment: 'text-sm mb-2',
} as const;

const AllergenIcon: FC<{level: string; size?: number}> = memo(
  ({level, size = 12}) => {
    const icons = {
      [ContainmentLevel.Contains]: (
        <FaPlus className="text-red-500" size={size} />
      ),
      [ContainmentLevel.MayContain]: (
        <FaPlusMinus className="text-red-500" size={size} />
      ),
      [ContainmentLevel.Without]: <FaMinus size={size} />,
      [ContainmentLevel.NotSupplied]: <FaRegCircle size={size - 2} />,
    };

    return <span title={level}>{icons[level.toLowerCase()] || null}</span>;
  },
);

const LegendTable: FC<{t: (key: string) => string}> = memo(({t}) => (
  <table className={CLASSES.legend.table}>
    <thead>
      <tr className={CLASSES.legend.header}>
        {['with', 'mayContainSpores', 'without', 'notSupplied'].map(key => (
          <th key={key} className={CLASSES.legend.cell}>
            {t(`product.allergen.${key}`)}
          </th>
        ))}
      </tr>
      <tr className={CLASSES.legend.iconRow}>
        {[
          {icon: FaPlus, color: 'text-red-500'},
          {icon: FaPlusMinus, color: 'text-red-500'},
          {icon: FaMinus, color: ''},
          {icon: FaRegCircle, color: '', size: 10},
        ].map(({icon: Icon, color, size = 12}, index) => (
          <th key={index} className={CLASSES.legend.iconCell}>
            <Icon className={`${color} mx-auto`} size={size} />
          </th>
        ))}
      </tr>
    </thead>
  </table>
));

const AllergenFull: FC<AllergenFullProps> = memo(
  ({allergens, allergenComment, locale}) => {
    const {t} = useTranslation('common');

    const filteredAllergens =
      allergens?.sort((a, b) => a.sequence - b.sequence) || [];
    if (filteredAllergens.length === 0) return null;

    const comments = isArray(allergenComment)
      ? allergenComment
      : [allergenComment];
    const columnLength = Math.ceil(filteredAllergens.length / 3);

    return (
      <Container id="allergens" className={CLASSES.container}>
        <h2 className={CLASSES.title}>{t('product.allergens')}</h2>

        <LegendTable t={t} />

        <table className={CLASSES.allergenTable}>
          <tbody>
            {[...Array(columnLength)].map((_, rowIndex) => (
              <tr key={rowIndex} className={CLASSES.row}>
                {[0, 1, 2].map(colIndex => {
                  const allergen =
                    filteredAllergens[rowIndex + colIndex * columnLength];
                  if (!allergen) {
                    return (
                      <Fragment key={`empty-${colIndex}-${rowIndex}`}>
                        <td className="w-[25%]" />
                        <td className="w-[8%]" />
                      </Fragment>
                    );
                  }

                  return (
                    <Fragment key={allergen.id}>
                      <td
                        className={`${CLASSES.cell.name} ${
                          tabbedAllergens.includes(allergen.id)
                            ? CLASSES.cell.tabbed
                            : ''
                        }`}
                      >
                        {getTranslationValue(allergen, locale)}
                      </td>
                      <td className={CLASSES.cell.icon}>
                        <AllergenIcon
                          level={allergen.levelofcontainmentname.value}
                        />
                      </td>
                    </Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {comments?.length > 0 && (
          <Container className={CLASSES.comments}>
            {comments.map((comment, index) => (
              <p key={index} className={CLASSES.comment}>
                {comment?.value}
              </p>
            ))}
          </Container>
        )}
      </Container>
    );
  },
);

AllergenIcon.displayName = 'AllergenIcon';
LegendTable.displayName = 'LegendTable';
AllergenFull.displayName = 'AllergenFull';

export default AllergenFull;
