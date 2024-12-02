'use client';

import {useRouter} from 'next/navigation';
import {useTranslation} from 'react-i18next';
import {FaAngleLeft} from 'react-icons/fa6';

const BackButton = () => {
  const router = useRouter();
  const {t} = useTranslation('common');

  const handleBack = async () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="text-ps-blue-400 hover:text-ps-blue-600 inline-flex items-center mr-3"
      title={t('common:back')}
    >
      <FaAngleLeft className="mr-1" /> {t('common.back')}
    </button>
  );
};

export default BackButton;
