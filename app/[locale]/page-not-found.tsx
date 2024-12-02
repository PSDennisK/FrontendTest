'use client';

import Button from '@/components/ui/Button';
import {Container} from '@/components/ui/Layout';
import {getHomeUrl} from '@/utils/helpers';
import {useParams} from 'next/navigation';
import {useTranslation} from 'react-i18next';
import {AiOutlineFileSearch} from 'react-icons/ai';

export default function PageNotFound() {
  const params = useParams();
  const {t} = useTranslation('common');

  return (
    <Container className="flex flex-col items-center justify-center py-8">
      <AiOutlineFileSearch
        className="text-ps-blue-500 animate-[pulse_2s_ease-in-out_infinite]"
        size={100}
      />

      <h1 className="text-3xl font-semibold mt-3">
        {t('common.pageNotFound')}
      </h1>
      <p className="mt-5">{t('common.pageNotFoundDescription')}</p>

      <Button
        href={getHomeUrl(params.locale.toString())}
        className="inline-block bg-ps-blue-500 text-white py-2 px-4 mt-5 rounded hover:bg-ps-blue-600 transition duration-300"
        title={t('common.goToHome')}
      />
    </Container>
  );
}
