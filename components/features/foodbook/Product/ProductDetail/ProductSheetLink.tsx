'use client';

import {createSlug} from '@/utils/helpers';
import Tippy from '@tippyjs/react';
import Link from 'next/link';
import {useTranslation} from 'react-i18next';
import {HiOutlineDocumentText} from 'react-icons/hi';

const ProductSheetLink = ({
  showSheetLink,
  isAuthenticated,
  productsummary,
  params,
}) => {
  const {t} = useTranslation('common');
  const canShowLink =
    isAuthenticated && productsummary.id && productsummary.name?.value;

  const ProductSheetContent = () => (
    <span className="text-sm flex items-center">
      {t('productsheet.productSheet')}{' '}
      <HiOutlineDocumentText className="text-xl font-bold uppercase ml-2" />
    </span>
  );

  if (showSheetLink && canShowLink) {
    return (
      <Link
        href={`/${params.locale}/productsheet/${createSlug(
          productsummary.id,
          productsummary.name.value,
        )}`}
        className="absolute right-0 hover:text-ps-blue-500 flex px-2.5 pt-1 pb-[3px] mx-0.5 mb-2"
        title={t('productsheet.productSheet')}
        target="_blank"
      >
        <ProductSheetContent />
      </Link>
    );
  }

  if (showSheetLink) {
    return (
      <Tippy
        content={t('productsheet.productSheetNotLoggedIn')}
        className="text-gray-700 text-center ml-2 text-xs"
        animation="scale"
        placement="bottom"
      >
        <div className="absolute text-slate-400 hover:cursor-not-allowed right-0 flex px-2.5 pt-1 pb-[3px] mx-0.5 mb-2">
          <ProductSheetContent />
        </div>
      </Tippy>
    );
  }
};

export default ProductSheetLink;
