import {umbraco} from '@/foodbook.config';
import {createTranslation} from '@/i18n';
import {Culture} from '@/types';
import {Metadata} from 'next';

export type PageData = {
  name: string;
  pageTitle: string;
  description: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
    altText: string;
  }>;
  seoMetaDescription: string;
};

export type SiteConfig = {
  siteName: string;
  defaultImage: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
};

/**
 * Creates a metadata generator function that takes in a site configuration and a function to retrieve page data.
 *
 */
export const createMetadataGenerator = (siteConfig: SiteConfig) => {
  return async function generateMetadata(
    {params}: {params: {slug: string; locale: keyof typeof Culture}},
    pageData: PageData,
  ): Promise<Metadata> {
    const t = await createTranslation(params.locale, 'common');

    let title = pageData?.pageTitle ?? pageData?.name;
    let description = pageData?.seoMetaDescription || pageData?.description;

    if (!pageData) {
      title = t('common.pageNotFound');
      description = t('common.pageNotFoundDescription');
    }

    const image = siteConfig.defaultImage;

    return {
      title: `${title} | ${siteConfig.siteName}`,
      description: description,
      openGraph: {
        title,
        description: description,
        images: [{...image}],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description,
        images: [image.url],
      },
    };
  };
};

/**
 * Generates metadata for a content page.
 *
 */
export const generatePageMetadata = createMetadataGenerator({
  siteName: `${umbraco.site_name}`,
  defaultImage: {
    url: `${umbraco.default_image}`,
    width: 800,
    height: 600,
    alt: `${umbraco.site_name}`,
  },
});
