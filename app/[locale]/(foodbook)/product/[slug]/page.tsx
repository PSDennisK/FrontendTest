import ProductNotFound from '@/app/[locale]/product-not-found';
import ProductView from '@/components/features/foodbook/Product/Product';
import {foodbook} from '@/foodbook.config';
import {createTranslation} from '@/i18n';
import {foodbookService} from '@/services';
import {Culture, Product} from '@/types';
import {getTranslationValue, splitHandle} from '@/utils/helpers';
import {decode} from 'html-entities';
import {Metadata} from 'next';

interface PageProps {
  params: {
    slug: string;
    locale: keyof typeof Culture;
  };
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const productId = splitHandle(slug);
  return await foodbookService.fetchProductById(productId);
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const t = await createTranslation(params.locale, 'common');
  const productClass = await fetchProductBySlug(params.slug);

  if (!productClass) {
    return {
      title: t('product.productNotFound'),
      description: t('product.productNotFoundDescription'),
    };
  }

  const product = productClass?.product;

  const productName = getTranslationValue(
    product.productinfolist?.productinfo?.name,
    params.locale,
    product.productinfolist?.productinfo?.name?.value,
  );

  const productDescription = getTranslationValue(
    product.commercialinfolist?.commercialinfo?.description,
    params.locale,
    `${product.summary.brandname} ${product.summary.name.value}`,
  );

  const productPackShot = product.summary?.packshot;
  const indexable: boolean = product.summary.publiclyvisible === '1';

  const metadata: Metadata = {
    title: decode(`${productName} | ${foodbook.site_name}`),
    description: decode(productDescription),
    openGraph: {
      title: decode(productName),
      description: decode(productDescription),
      locale: params.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: decode(productName),
    },
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
  };

  if (productPackShot) {
    const image = {
      url: productPackShot,
      width: 800,
      height: 600,
      alt: decode(productName),
    };
    metadata.openGraph!.images = [image];
    metadata.twitter!.images = [productPackShot];
  }

  return metadata;
}

const ProductPage: React.FC<PageProps> = async ({params}: PageProps) => {
  const productClass = await fetchProductBySlug(params.slug);

  if (!productClass) {
    return <ProductNotFound />;
  }

  const product = productClass?.product;

  if (!product) return <ProductNotFound />;

  return <ProductView params={params} product={product} />;
};

export default ProductPage;
