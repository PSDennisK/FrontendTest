'use client';

import FallbackImage from '@/components/ui/Image/FallbackImage';
import {Article, Container} from '@/components/ui/Layout';
import {useTranslation} from '@/i18n';
import {
  Culture,
  LatestProduct,
  ProductImageProps,
  ProductLinkProps,
  SearchProduct,
} from '@/types';
import {createSlug, getHighResImageUrl} from '@/utils/helpers';
import Link from 'next/link';
import {FC, memo} from 'react';

const CLASSES = {
  card: {
    base: 'group flex flex-col rounded-xl bg-white shadow-xl transition-transform duration-300 hover:shadow-2xl',
    small: 'h-48 p-8',
    regular: 'h-40 p-4 relative',
  },
  figure: 'flex justify-center items-center overflow-hidden mt-8 min-h-48',
  image: {
    small:
      'rounded-t-xl transition duration-200 ease-in-out transform group-hover:scale-105',
    regular:
      'max-h-48 w-auto origin-center transition-transform duration-300 ease-out will-change-transform group-hover:scale-110',
  },
  text: {
    small: 'text-xl font-bold mb-4',
    regular: 'text-base font-bold line-clamp-3 mb-4',
  },
  brand: 'text-sm absolute right-4 bottom-4 text-right',
} as const;

const ProductLink: FC<ProductLinkProps> = memo(
  ({locale, id, name, children, className}) => (
    <Link
      href={`/${locale}/product/${createSlug(id.toString(), name)}`}
      className={`${CLASSES.card.base} ${className || ''}`}
      title={name}
      itemType="https://schema.org/Product"
      itemScope
    >
      {children}
    </Link>
  ),
);

const ProductImage: FC<ProductImageProps> = memo(
  ({id, image, name, className}) => (
    <figure className={CLASSES.figure}>
      <FallbackImage
        id={id.toString()}
        src={getHighResImageUrl(image)}
        alt={name}
        loading="lazy"
        width={180}
        height={180}
        className={className}
        itemProp="image"
      />
    </figure>
  ),
);

type ProductCardSmallProps = {
  locale: keyof typeof Culture;
  product: LatestProduct;
};

const ProductCardSmall: FC<ProductCardSmallProps> = memo(
  ({locale, product}) => {
    const {t} = useTranslation(locale, 'common');

    if (!product) {
      return <p role="alert">{t('error.noLatestProducts')}</p>;
    }

    return (
      <ProductLink locale={locale} id={product.id} name={product.name}>
        <ProductImage
          id={product.id}
          image={product.image}
          name={product.name}
          className={CLASSES.image.small}
        />
        <Container className={CLASSES.card.small}>
          <Container className={CLASSES.text.small}>
            <span itemProp="name">{product.name}</span>
          </Container>
          <Container className={CLASSES.brand} itemProp="brand">
            {product.brand}
          </Container>
        </Container>
      </ProductLink>
    );
  },
);

type ProductCardProps = {
  locale: keyof typeof Culture;
  product: SearchProduct;
  brand: string;
  onClick?: (product: SearchProduct) => void;
};

const ProductCard: FC<ProductCardProps> = memo(
  ({locale, product, brand, onClick}) => {
    const {t} = useTranslation(locale, 'common');

    if (!product) {
      return <p role="alert">{t('product.noProductFound')}</p>;
    }

    return (
      <Article
        itemType="https://schema.org/Product"
        onClick={() => onClick?.(product)}
        className={
          onClick
            ? 'cursor-pointer hover:shadow-lg transition-shadow duration-300'
            : undefined
        }
      >
        <ProductLink locale={locale} id={product.id} name={product.name}>
          <ProductImage
            id={product.id}
            image={product.image}
            name={product.name}
            className={CLASSES.image.regular}
          />
          <Container className={CLASSES.card.regular}>
            <Container className={CLASSES.text.regular}>
              <span itemProp="name">{product.name}</span>
            </Container>
            <Container className={CLASSES.brand} itemProp="brand">
              {product.brand || brand}
            </Container>
          </Container>
        </ProductLink>
      </Article>
    );
  },
);

ProductLink.displayName = 'ProductLink';
ProductImage.displayName = 'ProductImage';
ProductCardSmall.displayName = 'ProductCardSmall';
ProductCard.displayName = 'ProductCard';

export {ProductCard, ProductCardSmall};
