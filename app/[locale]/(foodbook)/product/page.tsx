import ProductSearch from '@/components/features/foodbook/Product/ProductSearch';
import {foodbook} from '@/foodbook.config';
import {createTranslation} from '@/i18n';
import {Culture} from '@/types';
import {Metadata} from 'next';
import React from 'react';

type LocaleParam = keyof typeof Culture;

type PageProps = {
  params: {locale: LocaleParam; slug: string};
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = params;
  const t = await createTranslation(locale, 'common');

  const title = t('product.search.metaTitle', {siteName: foodbook.site_name});
  const description = t('product.search.metaDescription');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale,
      siteName: foodbook.site_name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

const Page: React.FC<PageProps> = ({params}) => {
  return <ProductSearch params={params} />;
};

export default Page;
