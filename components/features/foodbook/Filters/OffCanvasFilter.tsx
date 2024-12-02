'use client';

import {Container} from '@/components/ui/Layout';
import {FC, ReactNode, memo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FaX} from 'react-icons/fa6';

type OffCanvasFilterProps = {
  children: ReactNode;
};

const CLASSES = {
  filterButton: `
    md:hidden fixed bottom-4 right-4 z-40 
    bg-ps-blue-700 text-white px-4 py-2 
    rounded-lg shadow-lg flex items-center gap-2
    hover:bg-ps-blue-800 transition-colors duration-300
  `,
  overlay: `
    fixed inset-0 z-50 md:hidden
    transition-transform duration-300 ease-in-out
  `,
  backdrop: `
    absolute inset-0 bg-black/50 
    transition-opacity duration-300
  `,
  panel: `
    absolute right-0 top-0 h-full w-4/5 
    bg-white shadow-xl
  `,
  closeButton: `
    p-1 rounded-full hover:bg-gray-100
    transition-colors duration-300
  `,
  content: `
    h-[calc(100vh-5rem)] overflow-y-auto 
    overflow-x-hidden pb-20 pr-2
  `,
};

const FilterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    />
  </svg>
);

const OffCanvasFilter: FC<OffCanvasFilterProps> = memo(({children}) => {
  const {t} = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={handleOpen}
        className={CLASSES.filterButton}
        aria-label={t('product.filters')}
        aria-expanded={isOpen}
        aria-controls="filter-panel"
      >
        <FilterIcon aria-hidden="true" />
        <span>{t('product.filters')}</span>
      </button>

      <Container
        className={`${CLASSES.overlay} ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label={t('product.filters')}
      >
        <div
          className={`${CLASSES.backdrop} ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={handleClose}
          aria-hidden="true"
        />

        <Container id="filter-panel" className={CLASSES.panel}>
          <Container className="p-4">
            <Container className="flex items-center justify-end mb-4">
              <button
                onClick={handleClose}
                className={CLASSES.closeButton}
                aria-label={t('product.closeFilters')}
              >
                <FaX className="w-6 h-6" aria-hidden="true" />
              </button>
            </Container>

            <Container className={CLASSES.content}>{children}</Container>
          </Container>
        </Container>
      </Container>
    </>
  );
});

OffCanvasFilter.displayName = 'OffCanvasFilter';

export default OffCanvasFilter;
