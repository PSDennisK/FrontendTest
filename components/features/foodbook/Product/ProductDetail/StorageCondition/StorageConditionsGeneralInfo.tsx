/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import {useTranslatedValue} from '@/app/hooks/useTranslatedValue';
import type {Culture, Storageconditionset} from '@/types';
import React from 'react';
import {useTranslation} from 'react-i18next';

interface StorageConditionsGeneralInfoProps {
  storageconditionset: Storageconditionset;
  locale: keyof typeof Culture;
}

const StorageConditionsGeneralInfo: React.FC<
  StorageConditionsGeneralInfoProps
> = ({storageconditionset}) => {
  const {t} = useTranslation('common');

  if (!storageconditionset) {
    return null;
  }

  const {
    comment,
    usageinstructionlabel,
    storageinstructionlabel,
    shelflifelocationtext,
    preservationtechniquename,
    schelflife,
  } = storageconditionset;

  const translatedComment = useTranslatedValue(comment);
  const translatedUsageInstruction = useTranslatedValue(usageinstructionlabel);
  const translatedStorageInstruction = useTranslatedValue(
    storageinstructionlabel,
  );
  const translatedShelfLifeLocation = useTranslatedValue(shelflifelocationtext);
  const translatedShelflife = useTranslatedValue(schelflife);

  const infoItems = [
    {label: 'generalComment', value: translatedComment},
    {label: 'preservationMethod', value: preservationtechniquename?.value},
    {label: 'usageInstructions', value: translatedUsageInstruction},
    {label: 'storageInstructions', value: translatedStorageInstruction},
    {label: 'shelfLifeDataType', value: translatedShelflife},
    {label: 'shelfLifeLocation', value: translatedShelfLifeLocation},
  ].filter(item => item.value);

  if (infoItems.length === 0) {
    return null;
  }

  return (
    <table className="w-full text-left text-sm mt-8">
      <tbody>
        {infoItems.map(
          ({label, value}) =>
            value && (
              <tr
                key={label}
                className="border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800"
              >
                <td className="p-2 w-1/3 font-semibold">
                  {t(`product.storagecondition.${label}`)}
                </td>
                <td className="p-2">{value}</td>
              </tr>
            ),
        )}
      </tbody>
    </table>
  );
};

export default React.memo(StorageConditionsGeneralInfo);
