'use client';

import FallbackImage from '@/components/ui/Image/FallbackImage';
import {Container} from '@/components/ui/Layout';
import {Culture, Productinfo} from '@/types';
import {
  convertToBoolean,
  getHighResImageUrl,
  getTranslationValue,
  renderApplicable,
} from '@/utils/helpers';
import {isArray} from 'lodash';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mx-auto relative mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  content: 'flex space-x-3 overflow-x-auto print:text-sm',
  image: 'w-auto max-h-12 object-contain mb-4',
  iddsi: 'mb-4 text-sm',
  table: {
    container: 'w-full text-left text-sm',
    header: 'bg-gray-50 dark:bg-gray-700',
    cell: 'p-2',
    row: 'border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800',
  },
} as const;

type QualitymarksFullProps = {
  productinfo: Productinfo;
  locale: keyof typeof Culture;
};

const QualitymarksFull: FC<QualitymarksFullProps> = memo(
  ({productinfo, locale}) => {
    const {t} = useTranslation('common');

    if (!productinfo) return null;

    const characteristics =
      productinfo.characteristicinfolist?.characteristicinfo;
    const qualitymarks = productinfo.qualitymarkinfolist?.qualitymarkinfo;
    const marks = isArray(qualitymarks) ? qualitymarks : [qualitymarks];

    if (!qualitymarks) return null;

    const translations = {
      notFilledIn: t('common.notFilledIn'),
      yes: t('common.yes'),
      no: t('common.no'),
    };

    const renderMarkLogos = () => (
      <>
        {marks
          .filter(mark => mark !== undefined)
          .map((mark, index) => (
            <FallbackImage
              key={`${mark.id}-${index}`}
              itemProp="image"
              id={mark.name.value}
              src={getHighResImageUrl(mark.logo)}
              title={mark.name.value}
              alt={mark.name.value || t('common.qualityMarkImage')}
              width={100}
              height={100}
              className={CLASSES.image}
              loading="lazy"
            />
          ))}
      </>
    );

    const renderIDDSI = () => {
      if (!productinfo?.iddsiid) return null;
      return (
        <Container className={CLASSES.iddsi}>
          {t('iddsi').toLocaleUpperCase()}:{' '}
          {`${productinfo.iddsiid}. ${productinfo.iddsiname.value}`}
        </Container>
      );
    };

    const renderClaim = (value: string | number | boolean): string =>
      convertToBoolean(value) ? '✓' : t('common.notApplicable');

    const renderCharacteristics = () => {
      const characteristicsArray = isArray(characteristics)
        ? characteristics
        : [characteristics];
      if (!characteristicsArray?.length) return null;

      const sortedMarks = [...characteristicsArray].sort(
        (a, b) => Number(b.isapplicable) - Number(a.isapplicable),
      );

      return (
        <table className={CLASSES.table.container}>
          <thead className={CLASSES.table.header}>
            <tr>
              <th className={CLASSES.table.cell}>
                {t('product.qualitymarks.characteristic')}
              </th>
              <th className={CLASSES.table.cell}></th>
              <th className={CLASSES.table.cell}>
                {t('product.qualitymarks.claimOnLabel')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedMarks.map((item, index) => (
              <tr key={`${item.id}-${index}`} className={CLASSES.table.row}>
                <td className={CLASSES.table.cell}>
                  {getTranslationValue(item.translation, locale)}
                </td>
                <td className={CLASSES.table.cell}>
                  {renderApplicable(item.isapplicable, true, translations)}
                </td>
                <td className={CLASSES.table.cell}>
                  {renderClaim(item.isclaimedonlabel)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    const hasContent = qualitymarks?.length > 0 || characteristics?.length > 0;
    if (!hasContent) return null;

    return (
      <Container id="qualitymarksfull">
        <Container className={CLASSES.container}>
          <h2 className={CLASSES.title}>{t('product.qualityMarks')}</h2>
          <Container className={CLASSES.content}>{renderMarkLogos()}</Container>
          <Container className={CLASSES.content}>{renderIDDSI()}</Container>
          <Container className={CLASSES.content}>
            {characteristics?.length > 0 && renderCharacteristics()}
          </Container>
        </Container>
      </Container>
    );
  },
);

QualitymarksFull.displayName = 'QualitymarksFull';
export default QualitymarksFull;
