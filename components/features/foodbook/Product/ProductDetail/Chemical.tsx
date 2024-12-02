'use client';

import {Container} from '@/components/ui/Layout';
import {
  Culture,
  Physiochemicalcharacteristicinfo,
  Physiochemicalcharacteristicset,
} from '@/types';
import {getTranslationValue} from '@/utils/helpers';
import {isArray} from 'lodash';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  table: {
    container: 'w-full text-sm',
    header: 'bg-gray-50 dark:bg-gray-700',
    cell: 'p-2 text-left',
    row: 'border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800',
  },
} as const;

type ChemicalProps = {
  chemicalinformationset: Physiochemicalcharacteristicset;
  locale: keyof typeof Culture;
};

const Chemical: FC<ChemicalProps> = memo(({chemicalinformationset, locale}) => {
  const {t} = useTranslation('common');

  if (!chemicalinformationset) return null;

  const chemicalcharacteristicinfo =
    chemicalinformationset.physiochemicalcharacteristicinfolist
      ?.physiochemicalcharacteristicinfo;
  if (!chemicalcharacteristicinfo) return null;

  const chemicalcharacteristic = isArray(chemicalcharacteristicinfo)
    ? chemicalcharacteristicinfo
    : [chemicalcharacteristicinfo];

  return (
    <Container id="chemical" className={CLASSES.container}>
      <h2 className={CLASSES.title}>{t('product.chemicalInformation')}</h2>

      <table className={CLASSES.table.container}>
        <thead className={CLASSES.table.header}>
          <tr>
            <th className={CLASSES.table.cell}>
              {t('product.chemical.chemical')}
            </th>
            <th className={CLASSES.table.cell}>
              {t('product.chemical.value')}
            </th>
            <th className={CLASSES.table.cell}>
              {t('product.chemical.maxValue')}
            </th>
            <th className={CLASSES.table.cell}>
              {t('product.chemical.unitOfMeasure')}
            </th>
          </tr>
        </thead>
        <tbody>
          {chemicalcharacteristic?.map(
            (chemicalinfo: Physiochemicalcharacteristicinfo, index) => (
              <tr
                key={`${chemicalinfo.id}-${index}`}
                className={CLASSES.table.row}
              >
                <td className={CLASSES.table.cell}>
                  {getTranslationValue(
                    chemicalinfo?.translation,
                    locale,
                    chemicalinfo.name.value,
                  )}
                </td>
                <td className={CLASSES.table.cell}>{chemicalinfo.valuefrom}</td>
                <td className={CLASSES.table.cell}>{chemicalinfo.valueto}</td>
                <td className={CLASSES.table.cell}>
                  {chemicalinfo.unitofmeasurename?.value}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </Container>
  );
});

Chemical.displayName = 'Chemical';

export default Chemical;
