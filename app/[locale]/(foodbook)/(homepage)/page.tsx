import PageNotFound from '@/app/[locale]/page-not-found';
import {Homepage} from '@/components/website/home';
import {umbraco} from '@/foodbook.config';
import {umbracoService} from '@/services';
import {Culture} from '@/types';
import {decode} from 'html-entities';
import {Metadata} from 'next';

type LocaleParam = {
  locale: keyof typeof Culture;
};

type HomepageProps = {
  params: LocaleParam;
};

type PageProperties = {
  seoMetaTitle?: string;
  siteName?: string;
  seoMetaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};

const fetchHomePageData = async (locale: keyof typeof Culture) => {
  try {
    return await umbracoService.fetchPageBySlug('home', locale);
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return null;
  }
};

export async function generateMetadata({
  params,
}: HomepageProps): Promise<Metadata> {
  const page = await fetchHomePageData(params.locale);
  const properties: PageProperties = page?.properties || {};
  const title = decode(properties.seoMetaTitle || page.name);

  return {
    title: `${title} | ${umbraco.site_name}`,
    description: decode(
      properties.seoMetaDescription || umbraco.site_description,
    ),
    authors: umbraco.authors,
    metadataBase: new URL(umbraco.site_domain),
    openGraph: {
      title: decode(
        properties.ogTitle || properties.seoMetaTitle || umbraco.site_name,
      ),
      description: decode(
        properties.ogDescription ||
          properties.seoMetaDescription ||
          umbraco.site_description,
      ),
      images: properties.ogImage ? [properties.ogImage] : [],
    },
  };
}

const IndexPage: React.FC<HomepageProps> = async ({params: {locale}}) => {
  const page = await fetchHomePageData(locale);

  if (!page) return PageNotFound();

  return <Homepage initialPage={page} locale={locale} />;
};

export default IndexPage;
