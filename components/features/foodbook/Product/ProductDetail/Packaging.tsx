'use client';

import {Container} from '@/components/ui/Layout';
import {
  Culture,
  Logisticinfo,
  Logisticinfolist,
  PackagingmaterialinfoElement,
} from '@/types';
import {getTranslatedValue, normalizeToArray} from '@/utils/helpers';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  table: {
    base: 'w-full text-left text-sm mb-4',
    cell: 'p-2',
    headerCell: 'p-2',
    headerRow: 'border-b bg-gray-50 dark:bg-gray-800',
    row: 'border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800',
  },
} as const;

const TABLE_HEADERS = [
  'material',
  'value',
  'percentageRecycled',
  'isRecyclable',
  'comment',
] as const;

type Locale = keyof typeof Culture;

const hasPackagingMaterials = (logisticInfo: Logisticinfo): boolean => {
  if (!logisticInfo) return false;

  const hasMaterials =
    !!logisticInfo?.package?.packagingmaterialinfolist?.packagingmaterialinfo;
  const nestedLogisticInfos = logisticInfo?.logisticinfolist?.logisticinfo
    ? normalizeToArray(logisticInfo.logisticinfolist.logisticinfo)
    : [];

  return (
    hasMaterials ||
    nestedLogisticInfos.some(info => hasPackagingMaterials(info))
  );
};

const hasAnyPackagingMaterials = (
  logisticinfolist: Logisticinfolist,
): boolean => {
  if (!logisticinfolist?.logisticinfo) return false;
  const logisticInfos = normalizeToArray(logisticinfolist);
  return logisticInfos.some(info => hasPackagingMaterials(info.logisticinfo));
};

type PackagingMaterialRowProps = {
  material: PackagingmaterialinfoElement;
};

const PackagingMaterialRow: FC<PackagingMaterialRowProps> = memo(
  ({material}) => {
    const {t} = useTranslation('common');

    if (!material?.name?.value) return null;

    const {
      name,
      value,
      unitofmeasurename,
      percentagerecycledmaterial,
      isrecyclable,
      comment,
    } = material;

    return (
      <tr className={CLASSES.table.row}>
        <td className={CLASSES.table.cell}>{name?.value}</td>
        <td className={CLASSES.table.cell}>
          {value} {unitofmeasurename?.value}
        </td>
        <td className={CLASSES.table.cell}>
          {percentagerecycledmaterial !== undefined &&
            `${percentagerecycledmaterial}${t('productsheet.packaging.percentageRecycled')}`}
        </td>
        <td className={CLASSES.table.cell}>
          {isrecyclable === '1'
            ? t('productsheet.packaging.recyclable')
            : t('productsheet.packaging.notRecyclable')}
        </td>
        <td className={CLASSES.table.cell}>{comment?.value}</td>
      </tr>
    );
  },
);

type PackagingTableProps = {
  materials: PackagingmaterialinfoElement | PackagingmaterialinfoElement[];
  packageName: string;
};

const PackagingTable: FC<PackagingTableProps> = memo(
  ({materials, packageName}) => {
    const {t} = useTranslation('common');
    const materialArray = normalizeToArray(materials);

    if (!materialArray?.length) return null;

    return (
      <table className={CLASSES.table.base}>
        <thead>
          <tr className="border-b">
            <th className={CLASSES.table.headerCell} colSpan={5}>
              {packageName}
            </th>
          </tr>
          <tr className={CLASSES.table.headerRow}>
            {TABLE_HEADERS.map(key => (
              <th key={key} className={CLASSES.table.headerCell}>
                {t(`productsheet.packaging.${key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {materialArray.map(material => (
            <PackagingMaterialRow
              key={`${material.id}-${material.name?.value}`}
              material={material}
            />
          ))}
        </tbody>
      </table>
    );
  },
);

type LogisticInfoProps = {
  logisticInfo: Logisticinfo;
  locale: Locale;
  depth: number;
};

const LogisticInfoComponent: FC<LogisticInfoProps> = memo(
  ({logisticInfo, locale, depth}) => {
    const {package: packaging} = logisticInfo;

    if (!packaging?.packagingmaterialinfolist?.packagingmaterialinfo)
      return null;

    const translatedPackageName = getTranslatedValue(
      packaging.name?.translation,
      locale,
    );

    return (
      <>
        <PackagingTable
          materials={packaging.packagingmaterialinfolist.packagingmaterialinfo}
          packageName={translatedPackageName}
        />
        {logisticInfo.logisticinfolist?.logisticinfo && (
          <>
            {normalizeToArray(logisticInfo.logisticinfolist.logisticinfo).map(
              (subInfo, index) => (
                <LogisticInfoComponent
                  key={`${subInfo.id}-${index}-${depth}`}
                  logisticInfo={subInfo}
                  locale={locale}
                  depth={depth + 1}
                />
              ),
            )}
          </>
        )}
      </>
    );
  },
);

type PackagingProps = {
  logisticinfolist: Logisticinfolist;
  locale: Locale;
};

const Packaging: FC<PackagingProps> = memo(({logisticinfolist, locale}) => {
  const {t} = useTranslation('common');

  if (
    !logisticinfolist?.logisticinfo ||
    !hasAnyPackagingMaterials(logisticinfolist)
  ) {
    return null;
  }

  const logisticInfos = normalizeToArray(logisticinfolist);

  return (
    <Container id="packaging" className={CLASSES.container}>
      <h2 className={CLASSES.title}>{t('productsheet.packingMaterial')}</h2>
      {logisticInfos.map((logisticInfo, index) => (
        <LogisticInfoComponent
          key={`${logisticInfo.logisticinfo.id}-${index}`}
          logisticInfo={logisticInfo.logisticinfo}
          locale={locale}
          depth={0}
        />
      ))}
    </Container>
  );
});

PackagingMaterialRow.displayName = 'PackagingMaterialRow';
PackagingTable.displayName = 'PackagingTable';
LogisticInfoComponent.displayName = 'LogisticInfoComponent';
Packaging.displayName = 'Packaging';

export default Packaging;
