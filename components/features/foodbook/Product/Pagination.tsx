import React from 'react';
import {FaChevronLeft, FaChevronRight} from 'react-icons/fa6';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
}

const ELLIPSIS = -1;
const MAX_VISIBLE_PAGES = 3;

const STYLES = {
  container: 'flex items-center justify-center mt-8 gap-1',
  button: {
    base: 'px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-ps-blue-400 focus:ring-offset-2 transition-colors',
    navigation:
      'mx-1 bg-gray-200 hover:bg-gray-300 disabled:hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed',
    page: 'mx-1 bg-gray-200 hover:bg-gray-300',
    active: 'bg-ps-blue-400 text-white hover:bg-ps-blue-500',
  },
  ellipsis: 'mx-1 px-2',
} as const;

const PaginationButton = ({
  onClick,
  disabled = false,
  active = false,
  children,
  ariaLabel,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
  ariaLabel?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    aria-current={active ? 'page' : undefined}
    className={`
      ${STYLES.button.base}
      ${active ? STYLES.button.active : STYLES.button.page}
      ${disabled ? STYLES.button.navigation : ''}
    `}
  >
    {children}
  </button>
);

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = 'Pagination navigation',
}: PaginationProps) => {
  const getPageNumbers = React.useCallback(() => {
    if (totalPages <= 0) return [];

    if (totalPages <= MAX_VISIBLE_PAGES + 2) {
      return Array.from({length: totalPages}, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, ELLIPSIS, totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        ELLIPSIS,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      ELLIPSIS,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      ELLIPSIS,
      totalPages,
    ];
  }, [currentPage, totalPages]);

  const pageNumbers = React.useMemo(() => getPageNumbers(), [getPageNumbers]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <nav aria-label={ariaLabel}>
      <div className={STYLES.container}>
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          ariaLabel="Previous page"
        >
          <FaChevronLeft className="h-6 w-auto py-1" />
        </PaginationButton>

        {pageNumbers.map((number, index) => (
          <React.Fragment key={`page-${index}-${number}`}>
            {number === ELLIPSIS ? (
              <span className={STYLES.ellipsis} aria-hidden="true">
                &hellip;
              </span>
            ) : (
              <PaginationButton
                onClick={() => handlePageChange(number)}
                active={currentPage === number}
                ariaLabel={`Page ${number}`}
              >
                {number}
              </PaginationButton>
            )}
          </React.Fragment>
        ))}

        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          ariaLabel="Next page"
        >
          <FaChevronRight className="h-6 w-auto py-1 " />
        </PaginationButton>
      </div>
    </nav>
  );
};

export default Pagination;
