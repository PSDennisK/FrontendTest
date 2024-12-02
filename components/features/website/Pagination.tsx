'use client';

import {Nav} from '@/components/ui/Layout';

import {useTranslation} from '@/i18n/client';
import {LocaleTypes} from '@/i18n/settings';
import useFilterStore from '@/stores/foodbook/filterStore';
import {UmbracoItems} from '@/types';
import {useParams} from 'next/navigation';

const Pagination = ({pages, total}: {pages: UmbracoItems; total: number}) => {
  const {pageIndex, pageSize, setPageIndex} = useFilterStore(state => ({
    pageIndex: state.pageIndex,
    pageSize: state.pageSize,
    setPageIndex: state.setPageIndex,
  }));

  let locale = useParams()?.locale as LocaleTypes;
  const {t} = useTranslation(locale, 'common');

  const totalPages = Math.ceil(total / pageSize);

  const handlePageClick = (index: number) => {
    setPageIndex(index);
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (pageIndex > 0) {
      pages.push(
        <li key="first">
          <button
            className="relative block rounded px-3 py-1.5 text-sm transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
            onClick={() => handlePageClick(0)}
            aria-label={t('paging.first')}
          >
            {t('paging.first')}
          </button>
        </li>,
      );
      pages.push(
        <li key="prev">
          <button
            className="relative block rounded px-3 py-1.5 text-sm transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
            onClick={() => handlePageClick(pageIndex - 1)}
            aria-label={t('paging.previous')}
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>,
      );

      for (
        let i = pageIndex;
        i <= Math.min(pageIndex + 3, totalPages - 1);
        i++
      ) {
        pages.push(
          <li key={i} className={pageIndex === i ? 'active' : ''}>
            <button
              className={`${pageIndex === i ? 'active' : 'text-neutral-600 hover:bg-neutral-100'} relative block rounded bg-transparent px-3 py-1.5 text-sm  transition-all duration-300 active:bg-ps-blue-400 active:text-white  dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white`}
              onClick={() => handlePageClick(i)}
            >
              {i + 1}
            </button>
          </li>,
        );
      }

      if (pageIndex + 3 < totalPages - 4) {
        pages.push(<li key="ellipsis">...</li>);
      }

      for (
        let i = Math.max(totalPages - 4, pageIndex + 4);
        i < totalPages - 1;
        i++
      ) {
        pages.push(
          <li key={i} className={pageIndex === i ? 'active' : ''}>
            <button
              className={`${pageIndex === i ? 'active' : ''} relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 active:bg-ps-blue-400 active:text-white hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white`}
              onClick={() => handlePageClick(i)}
            >
              {i + 1}
            </button>
          </li>,
        );
      }

      if (pageIndex < totalPages - 1) {
        pages.push(
          <li key="next">
            <button
              className="relative block rounded px-3 py-1.5 text-sm transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              onClick={() => handlePageClick(pageIndex + 1)}
              aria-label={t('paging.next')}
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>,
        );
        pages.push(
          <li key="last">
            <button
              className="relative block rounded px-3 py-1.5 text-sm transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              onClick={() => handlePageClick(totalPages - 1)}
              aria-label={t('paging.last')}
            >
              {t('paging.last')}
            </button>
          </li>,
        );
      }
    }

    return pages;
  };

  return (
    <Nav
      className="flex justify-center col-span-4 mt-4"
      aria-label="Product navigation"
    >
      <ul className="list-style-none flex">{renderPageNumbers()}</ul>
    </Nav>
  );
};

export default Pagination;
