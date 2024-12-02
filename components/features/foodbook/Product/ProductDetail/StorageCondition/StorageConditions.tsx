import StorageConditionInfo from '@/components/features/foodbook/Product/ProductDetail/StorageCondition/StorageConditionInfo';
import StorageConditionsGeneralInfo from '@/components/features/foodbook/Product/ProductDetail/StorageCondition/StorageConditionsGeneralInfo';
import {Container} from '@/components/ui/Layout';
import {createTranslation} from '@/i18n';
import type {
  Culture,
  Storageconditionset,
  Storageconditionstageinfo,
} from '@/types';
import React from 'react';

interface StorageConditionsProps {
  storageconditionset: Storageconditionset;
  locale: keyof typeof Culture;
}

const tableHeaders = [
  'product.storagecondition.stage',
  'product.storagecondition.storageCondition',
  'product.storagecondition.temperature',
  'product.storagecondition.period',
] as const;

const StorageConditions: React.FC<StorageConditionsProps> = async ({
  storageconditionset,
  locale,
}) => {
  const t = await createTranslation(locale, 'common');

  if (
    !storageconditionset?.storageconditionstageinfolist
      ?.storageconditionstageinfo
  ) {
    return null;
  }

  const storageconditionstageinfo = Array.isArray(
    storageconditionset.storageconditionstageinfolist.storageconditionstageinfo,
  )
    ? storageconditionset.storageconditionstageinfolist
        .storageconditionstageinfo
    : [
        storageconditionset.storageconditionstageinfolist
          .storageconditionstageinfo,
      ];

  return (
    <Container id="storage-conditions" className="mb-8 lg:mb-10 xl:mb-12">
      <h2 className="text-xl font-semibold leading-6 mb-4">
        {t('product.storageConditions')}
      </h2>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr className="border-b">
            {tableHeaders.map(header => (
              <th key={header} className="p-2">
                {t(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {storageconditionstageinfo.map((item: Storageconditionstageinfo) => (
            <StorageConditionInfo
              key={item.id}
              storageconditionstageinfo={item}
              locale={locale}
            />
          ))}
        </tbody>
      </table>

      <StorageConditionsGeneralInfo
        storageconditionset={storageconditionset}
        locale={locale}
      />
    </Container>
  );
};

export default React.memo(StorageConditions);
