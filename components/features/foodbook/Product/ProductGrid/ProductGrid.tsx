import {ProductCard} from '@/components/features/foodbook/Product/ProductCard';
import {Container} from '@/components/ui/Layout';
import {Culture, SearchProduct} from '@/types';
import React from 'react';
import {useTranslation} from 'react-i18next';

interface ProductGridProps {
  locale: keyof typeof Culture;
  products: SearchProduct[];
  className?: string;
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  loading?: boolean;
  onProductClick?: (product: SearchProduct) => void;
}

const DEFAULT_COLUMNS = {
  default: 1,
  md: 2,
  lg: 3,
} as const;

const DEFAULT_GAP = 4;

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const generateGridClasses = (
  columns: ProductGridProps['columns'] = DEFAULT_COLUMNS,
  gap: number = DEFAULT_GAP,
) => {
  const classes = ['grid'];

  classes.push(`grid-cols-${columns.default}`);

  if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
  if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
  if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
  if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);

  classes.push(`gap-${gap}`);

  return classes.join(' ');
};

const ProductGrid: React.FC<ProductGridProps> = ({
  locale,
  products,
  className = '',
  columns = DEFAULT_COLUMNS,
  gap = DEFAULT_GAP,
  loading = false,
  onProductClick,
}) => {
  const {t} = useTranslation('common');

  if (loading) {
    return (
      <Container
        className={`${generateGridClasses(columns, gap)} ${className}`}
        role="alert"
        aria-busy="true"
      >
        {[...Array(6)].map((_, index) => (
          <ProductSkeleton key={`skeleton-${index}`} />
        ))}
      </Container>
    );
  }

  if (!products?.length) {
    return (
      <Container className="text-center py-8" role="alert">
        <p>{t('error.noProductsFound')}</p>
      </Container>
    );
  }

  return (
    <Container
      className={`${generateGridClasses(columns, gap)} ${className}`}
      role="grid"
      aria-label="Product grid"
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          locale={locale}
          product={product}
          brand=""
          onClick={() => onProductClick?.(product)}
        />
      ))}
    </Container>
  );
};

export default React.memo(ProductGrid);
