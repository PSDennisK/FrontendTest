'use client';

import {LocaleTypes, useTranslation} from '@/i18n';
import {useParams} from 'next/navigation';

const FilterButton = () => {
  let locale = useParams()?.locale as LocaleTypes;
  const {t} = useTranslation(locale, 'common');

  const openOffCanvas = () => {
    const offCanvas = document.getElementById('offCanvas');
    offCanvas.style.left = '0';
  };

  return (
    <>
      <button
        className="flex items-center px-4 py-2 text-sm font-semibold transition duration-200 ease-in-out border rounded-md lg:hidden border-border-base focus:outline-none hover:border-brand hover:text-brand"
        id="openButton"
        onClick={openOffCanvas}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
          />
        </svg>
        <span className="pl-2.5">{t('product.filters')}</span>
      </button>
    </>
  );
};

export default FilterButton;
