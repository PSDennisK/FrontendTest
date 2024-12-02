import {Container} from '@/components/ui/Layout';

import {createTranslation} from '@/i18n/server';
import {Culture, Storageconditionset} from '@/types';
import Image from 'next/image';
import React from 'react';

interface StorageConditionLogosProps {
  storageconditionset: Storageconditionset;
  locale: keyof typeof Culture;
}

interface StorageConditionState {
  isFrozen: boolean;
  isCooled: boolean;
}

const checkStorageConditions = (
  storageconditionset: Storageconditionset,
): StorageConditionState => {
  const storageconditionstageinfolist =
    storageconditionset?.storageconditionstageinfolist
      ?.storageconditionstageinfo;

  if (!Array.isArray(storageconditionstageinfolist)) {
    return {isFrozen: false, isCooled: false};
  }

  return {
    isFrozen: storageconditionstageinfolist.some(
      stage =>
        stage.id === '1' &&
        stage.storageconditioninfolist?.storageconditioninfo?.id === '3',
    ),
    isCooled: storageconditionstageinfolist.some(
      stage =>
        stage.id === '1' &&
        stage.storageconditioninfolist?.storageconditioninfo?.id === '2',
    ),
  };
};

const StorageConditionLogos: React.FC<StorageConditionLogosProps> = React.memo(
  async ({storageconditionset, locale}) => {
    const t = await createTranslation(locale, 'common');

    const {isFrozen, isCooled} = checkStorageConditions(storageconditionset);

    if (!isFrozen && !isCooled) return null;

    const preservationTechnique = isFrozen
      ? t('product.storagecondition.frozen')
      : t('product.storagecondition.cooled');

    let imageSrc = '';
    if (isFrozen) {
      imageSrc = `${process.env.NEXT_PUBLIC_CDN_IMAGE_URL}/productsheet/3.png`;
    } else if (isCooled) {
      imageSrc = `${process.env.NEXT_PUBLIC_CDN_IMAGE_URL}/productsheet/2.png`;
    } else {
      return null;
    }

    return (
      <Container className="flex items-center mb-8">
        <Image
          src={imageSrc}
          alt={preservationTechnique}
          title={preservationTechnique}
          width={30}
          height={30}
          className="h-[30px] w-auto mr-4 mb-4"
        />
      </Container>
    );
  },
);

StorageConditionLogos.displayName = 'StorageConditionLogos';

export default StorageConditionLogos;
