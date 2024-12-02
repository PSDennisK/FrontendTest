'use client';

import {useTranslatedValue} from '@/app/hooks/useTranslatedValue';
import type {
  Culture,
  Storageconditioninfo,
  Storageconditionstageinfo,
} from '@/types';
import {useTranslation} from 'react-i18next';

interface StorageConditionInfoProps {
  storageconditionstageinfo: Storageconditionstageinfo;
  locale: keyof typeof Culture;
}

const Temperature = ({
  storagecondition,
}: {
  storagecondition: Storageconditioninfo;
}) => {
  const {mintemperature, maxtemperature} = storagecondition;

  const hasMin = mintemperature != null;
  const hasMax = maxtemperature != null;

  if (!hasMin && !hasMax) return null;

  return (
    <td className="p-2">
      {hasMin && mintemperature}
      {hasMin && hasMax && ' - '}
      {hasMax && `${maxtemperature}°C`}
    </td>
  );
};

const StorageConditionInfo = ({
  storageconditionstageinfo,
}: StorageConditionInfoProps) => {
  const {t} = useTranslation('common');
  const storageconditioninfo =
    storageconditionstageinfo?.storageconditioninfolist?.storageconditioninfo;

  const comment = useTranslatedValue(storageconditioninfo?.comment);
  const stageName = useTranslatedValue(storageconditionstageinfo?.name);
  const conditionName = useTranslatedValue(storageconditioninfo?.name);
  const periodName = useTranslatedValue(storageconditioninfo?.periodname);

  if (!storageconditioninfo) {
    return null;
  }

  const baseRowClasses =
    'border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800';

  return (
    <>
      <tr className={baseRowClasses}>
        <td className="p-2">{stageName}</td>
        <td className="p-2">{conditionName}</td>
        <Temperature storagecondition={storageconditioninfo} />
        <td className="p-2">
          {storageconditioninfo.periodvalue} {periodName}
        </td>
      </tr>
      {comment && (
        <tr className={baseRowClasses}>
          <td colSpan={4} className="p-2 italic">
            {t('product.storagecondition.comment')}: {comment}
          </td>
        </tr>
      )}
    </>
  );
};

export default StorageConditionInfo;
