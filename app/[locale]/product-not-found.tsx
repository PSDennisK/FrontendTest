'use client';

import {getHomeUrl} from '@/utils/helpers';
import {useParams} from 'next/navigation';
import {useTranslation} from 'react-i18next';
import {AiOutlineSearch} from 'react-icons/ai';
import Button from '../../components/ui/Button';
import {Container} from '../../components/ui/Layout';

export default function ProductNotFound() {
  const params = useParams();
  const {t} = useTranslation('common');

  return (
    <Container className="flex flex-col items-center justify-center py-8">
      <AiOutlineSearch
        className="text-ps-blue-500 animate-[pulse_2s_ease-in-out_infinite]"
        size={100}
      />

      <h1 className="text-3xl font-semibold mt-3">
        {t('product.productNotFound')}
      </h1>
      <p className="mt-5">{t('product.productNotFoundDescription')}</p>

      <Button
        href={getHomeUrl(params.locale.toString())}
        className="inline-block bg-ps-blue-500 text-white py-2 px-4 mt-5 rounded hover:bg-ps-blue-600 transition duration-300"
        title={t('common.goToHome')}
      />
    </Container>
  );
}
