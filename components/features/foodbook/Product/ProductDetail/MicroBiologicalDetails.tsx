'use client';

import {Container} from '@/components/ui/Layout';
import {
  Culture,
  Microbiologicalorganisminfo,
  Microbiologicalsetinfo,
} from '@/types';
import {getTranslationValue, normalizeToArray} from '@/utils/helpers';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  table: 'w-full text-left text-sm',
  row: 'border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800',
  cell: {
    base: 'p-2',
    name: 'w-1/3 p-2',
  },
} as const;

enum MeasurementPrecision {
  LESS_THAN = 'kleiner dan',
  GREATER_THAN = 'groter dan',
}

const MEASUREMENT_PRECISION_SYMBOLS: Record<MeasurementPrecision, string> = {
  [MeasurementPrecision.LESS_THAN]: '<',
  [MeasurementPrecision.GREATER_THAN]: '>',
} as const;

type TableHeaderProps = {
  value?: string;
};

type TableRowProps = {
  name: string;
  value: string;
  precision?: string;
  unit?: string;
  locale: keyof typeof Culture;
};

type MicroBiologicalDetailsProps = {
  microbiologicalsetinfo: Microbiologicalsetinfo;
  locale: keyof typeof Culture;
};

const getMeasurementPrecisionSymbol = (value?: string): string => {
  if (!value) return '';
  const normalizedValue = value.toLowerCase() as MeasurementPrecision;
  return MEASUREMENT_PRECISION_SYMBOLS[normalizedValue] || value;
};

const TableHeader: FC<TableHeaderProps> = memo(({value}) => (
  <thead>
    <tr className={CLASSES.row}>
      <th className={CLASSES.cell.base}>{value}</th>
    </tr>
  </thead>
));

const TableRow: FC<TableRowProps> = memo(
  ({name, value, precision, unit, locale}) => (
    <tr className={CLASSES.row}>
      <td className={CLASSES.cell.name}>{value}</td>
      <td className={CLASSES.cell.base}>
        {`${getMeasurementPrecisionSymbol(precision)} ${value}`}
      </td>
      <td className={CLASSES.cell.base}>{unit}</td>
    </tr>
  ),
);

const sortMicrobiologicalOrganisms = (
  organisms: Microbiologicalorganisminfo[],
): Microbiologicalorganisminfo[] => {
  return [...organisms].sort((a, b) => {
    const seqA = a.sequence !== undefined ? Number(a.sequence) : Infinity;
    const seqB = b.sequence !== undefined ? Number(b.sequence) : Infinity;
    return seqA - seqB;
  });
};

const MicroBiologicalDetails: FC<MicroBiologicalDetailsProps> = memo(
  ({microbiologicalsetinfo, locale}) => {
    const {t} = useTranslation('common');

    if (
      !microbiologicalsetinfo?.microbiologicalorganisminfolist
        ?.microbiologicalorganisminfo
    ) {
      return null;
    }

    const organisms = microbiologicalsetinfo.microbiologicalorganisminfolist
      .microbiologicalorganisminfo
      ? normalizeToArray(
          microbiologicalsetinfo.microbiologicalorganisminfolist
            .microbiologicalorganisminfo,
        )
      : [];

    const sortedOrganisms = sortMicrobiologicalOrganisms(organisms);
    const stageName = getTranslationValue(
      microbiologicalsetinfo?.microbiologicalstagetranslation,
      locale,
      microbiologicalsetinfo.microbiologicalstagename?.value,
    );

    return (
      <Container id="microbiological" className={CLASSES.container}>
        <h2 className={CLASSES.title}>
          {t('productsheet.microbiologicalSets')}
        </h2>

        <table className={CLASSES.table}>
          <TableHeader value={stageName} />
          <tbody>
            {sortedOrganisms.map(organism => (
              <TableRow
                key={organism.id}
                name={getTranslationValue(
                  organism?.name,
                  locale,
                  organism?.name?.value,
                )}
                value={getTranslationValue(
                  organism.translation,
                  locale,
                  organism.value,
                )}
                precision={organism.measurementprecisionname?.value}
                unit={getTranslationValue(
                  organism.unitofmeasuretranslation,
                  locale,
                  organism.unitofmeasurename?.value,
                )}
                locale={locale}
              />
            ))}
          </tbody>
        </table>
      </Container>
    );
  },
);

TableHeader.displayName = 'TableHeader';
TableRow.displayName = 'TableRow';
MicroBiologicalDetails.displayName = 'MicroBiologicalDetails';

export default MicroBiologicalDetails;
