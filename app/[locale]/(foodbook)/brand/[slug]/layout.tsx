import {foodbook} from '@/foodbook.config';
import {createTranslation} from '@/i18n/server';
import {foodbookService} from '@/services';
import {Culture} from '@/types';
import {splitHandle} from '@/utils/helpers';
import {decode} from 'html-entities';
import {Metadata, ResolvingMetadata} from 'next';

type LocaleParam = keyof typeof Culture;

type MetadataProps = {
  params: {locale: LocaleParam; slug: string};
};

interface LayoutProps extends MetadataProps {
  children: React.ReactNode;
}

function getImageUrl(img: string | URL | {url: string}): string {
  if (typeof img === 'string') return img;
  if (img instanceof URL) return img.toString();
  if (typeof img === 'object' && 'url' in img) return img.url;
  return '';
}

async function getBrandData(slug: string) {
  const brandId = splitHandle(slug);
  return await foodbookService.fetchBrandById(brandId);
}

export async function generateMetadata(
  {params}: MetadataProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const {slug, locale} = params;
  const t = await createTranslation(locale, 'common');

  try {
    const brand = await getBrandData(slug);

    if (!brand) {
      console.warn(`Brand not found for slug: ${slug}`);
      return getDefaultMetadata();
    }

    const previousMetadata = await parent;
    const images = [
      ...(brand.image ? [brand.image] : []),
      ...(previousMetadata.openGraph?.images || []).map(getImageUrl),
    ].filter(Boolean);

    return {
      title: decode(
        t('brand.metaTitle', {
          brandName: brand.name,
          siteName: foodbook.site_name,
        }),
      ),
      description: decode(
        brand.description ||
          t('brand.metaDescription', {
            brandName: brand.name,
            siteName: foodbook.site_name,
          }),
      ),
      openGraph: {
        title: decode(
          t('brand.ogTitle', {
            brandName: brand.name,
            siteName: foodbook.site_name,
          }),
        ),
        description: decode(
          brand.description ||
            t('brand.ogDescription', {
              brandName: brand.name,
              siteName: foodbook.site_name,
            }),
        ),
        images,
        locale,
        type: 'website',
        siteName: foodbook.site_name,
      },
      twitter: {
        card: 'summary_large_image',
        title: decode(
          t('brand.twitterTitle', {
            brandName: brand.name,
            siteName: foodbook.site_name,
          }),
        ),
        description: decode(
          brand.description ||
            t('brand.twitterDescription', {
              brandName: brand.name,
              siteName: foodbook.site_name,
            }),
        ),
        images,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return getDefaultMetadata();
  }
}

function getDefaultMetadata(): Metadata {
  return {
    title: foodbook.site_name,
    description: foodbook.site_description,
  };
}

const Layout: React.FC<LayoutProps> = ({children}) => children;

export default Layout;
