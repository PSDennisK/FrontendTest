'use client';

import {Container} from '@/components/ui/Layout';
import {Culture, ProductClass} from '@/types';
import {convertToBoolean, getTranslationValue, parseId} from '@/utils/helpers';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  list: 'list-inside list-disc marker:text-ps-blue-500 mb-4 print:text-sm',
} as const;

const CHAR_BULLETS = ['5', '9', '16', '29', '28', '26', '27'];
const ALCOHOL_ID = '45';

type BulletPointsProps = {
  product: ProductClass;
  locale: keyof typeof Culture;
};

const BulletPoints: FC<BulletPointsProps> = memo(({product, locale}) => {
  const {t} = useTranslation('common');

  if (!product) return null;

  const {productinfolist, specificationinfolist} = product;
  const productinfo = productinfolist?.productinfo;
  const chemicalinformationset =
    specificationinfolist?.specificationinfo?.physiochemicalcharacteristicset;

  const physiochemicalcharacteristicinfo = Array.isArray(
    chemicalinformationset?.physiochemicalcharacteristicinfolist
      .physiochemicalcharacteristicinfo,
  )
    ? chemicalinformationset?.physiochemicalcharacteristicinfolist
        .physiochemicalcharacteristicinfo
    : chemicalinformationset?.physiochemicalcharacteristicinfolist
          .physiochemicalcharacteristicinfo
      ? [
          chemicalinformationset?.physiochemicalcharacteristicinfolist
            .physiochemicalcharacteristicinfo,
        ]
      : [];

  const characteristicinfo = Array.isArray(
    productinfo?.characteristicinfolist?.characteristicinfo,
  )
    ? productinfo?.characteristicinfolist?.characteristicinfo
    : productinfo?.characteristicinfolist?.characteristicinfo
      ? [productinfo?.characteristicinfolist?.characteristicinfo]
      : [];

  const renderIDDSI = () => {
    if (!productinfo?.iddsiid) return null;
    return (
      <li>
        {t('iddsi').toLocaleUpperCase()}:{' '}
        {`${productinfo.iddsiid}. ${productinfo.iddsiname.value}`}
      </li>
    );
  };

  const renderCharacteristics = () => {
    if (!characteristicinfo?.length) return null;

    return characteristicinfo
      .filter(bch => CHAR_BULLETS.includes(bch.id))
      .sort((a, b) => {
        if (
          convertToBoolean(a.isclaimedonlabel) !==
          convertToBoolean(b.isclaimedonlabel)
        )
          return b.isclaimedonlabel ? 1 : -1;
        if (
          convertToBoolean(a.isapplicable) !== convertToBoolean(b.isapplicable)
        )
          return b.isapplicable ? 1 : -1;
        return parseId(a.id) - parseId(b.id);
      })
      .map(item =>
        convertToBoolean(item.isclaimedonlabel) ? (
          <li key={item.id}>
            {!convertToBoolean(item.isapplicable)
              ? item.friendlyname.value
              : getTranslationValue(item.translation, locale, item.name.value)}
          </li>
        ) : null,
      );
  };

  const renderPhysiochemicalCharacteristics = () => {
    if (!physiochemicalcharacteristicinfo.length) return null;

    return physiochemicalcharacteristicinfo
      .filter(item => item?.id === ALCOHOL_ID)
      .map(item => (
        <li key={item?.id}>
          {`${item?.valuefrom} ${item?.unitofmeasurename?.value} ${getTranslationValue(item?.translation, locale, item.name.value)}`}
        </li>
      ));
  };

  return (
    <Container id="bulletpoints">
      <ul className={CLASSES.list}>
        {renderIDDSI()}
        {renderCharacteristics()}
        {renderPhysiochemicalCharacteristics()}
      </ul>
    </Container>
  );
});

BulletPoints.displayName = 'BulletPoints';

export default BulletPoints;
