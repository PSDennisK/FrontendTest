'use client';

import {useTranslatedValue} from '@/app/hooks/useTranslatedValue';
import {Container} from '@/components/ui/Layout';
import {Preparationinformationinfo} from '@/types';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  infoContainer: 'mb-4 print:text-sm',
  typeText: 'block mb-2',
} as const;

type PreparationInfoProps = {
  preparationinfo: Preparationinformationinfo;
};

type PreparationProps = {
  preparationInformationInfo:
    | Preparationinformationinfo
    | Preparationinformationinfo[];
};

const PreparationInfo: FC<PreparationInfoProps> = memo(({preparationinfo}) => {
  const preparationdescription = useTranslatedValue(
    preparationinfo?.preparationdescription,
  );

  if (!preparationinfo) return null;

  return (
    <Container className={CLASSES.infoContainer}>
      {preparationinfo?.preparationtypeid !== '99999' && (
        <p className={CLASSES.typeText}>
          {preparationinfo?.preparationtypename?.value}
        </p>
      )}
      <p>{preparationdescription}</p>
    </Container>
  );
});

const Preparation: FC<PreparationProps> = memo(
  ({preparationInformationInfo}) => {
    const {t} = useTranslation('common');

    if (!preparationInformationInfo) return null;

    const preparationInfoArray = Array.isArray(preparationInformationInfo)
      ? preparationInformationInfo
      : [preparationInformationInfo];

    return (
      <Container id="preparation" className={CLASSES.container}>
        <h2 className={CLASSES.title}>{t('product.preparation')}</h2>
        {preparationInfoArray.map(info => (
          <PreparationInfo key={info.id} preparationinfo={info} />
        ))}
      </Container>
    );
  },
);

PreparationInfo.displayName = 'PreparationInfo';
Preparation.displayName = 'Preparation';

export default Preparation;
