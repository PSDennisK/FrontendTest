import PageNotFound from '@/app/[locale]/page-not-found';
import Cta from '@/components/website/custom/cta';
import {umbracoService} from '@/services';
import {Culture} from '@/types';
import {generatePageMetadata, PageData} from '@/utils/metadata';
import {Metadata} from 'next';
import dynamic from 'next/dynamic';

// Dynamically import templates
const templates = {
  psImpactScore: dynamic(
    () => import('@/components/website/templates/psimpactscore.template'),
  ),
  targetGroupPage: dynamic(
    () => import('@/components/website/templates/targetgroup.template'),
  ),
  partnersPage: dynamic(
    () => import('@/components/website/templates/partners.template'),
  ),
  register: dynamic(
    () => import('@/components/website/templates/register.template'),
  ),
  team: dynamic(() => import('@/components/website/templates/team.template')),
  news: dynamic(() => import('@/components/website/templates/news.template')),
  newsItem: dynamic(
    () => import('@/components/website/templates/content.template'),
  ),
  faqPage: dynamic(() => import('@/components/website/templates/fag.template')),
  pricePage: dynamic(
    () => import('@/components/website/templates/price.template'),
  ),
  contact: dynamic(
    () => import('@/components/website/templates/contact.template'),
  ),
  calendar: dynamic(
    () => import('@/components/website/templates/calendar.template'),
  ),
};

interface PageProps {
  params: {
    slug: string;
    locale: keyof typeof Culture;
  };
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const page: PageData = await umbracoService.fetchPageBySlug(
    params.slug,
    params.locale,
  );
  return generatePageMetadata({params}, page);
};

const ContentPage = async ({params}: PageProps) => {
  const page = await umbracoService.fetchPageBySlug(params.slug, params.locale);

  if (page === null) {
    return <PageNotFound />;
  }

  const pageProperties = page?.properties;
  if (pageProperties?.hide) {
    return null;
  }

  const Template = templates[page?.contentType as keyof typeof templates];
  if (!Template) {
    return null;
  }

  return (
    <>
      <Template
        properties={pageProperties}
        params={params}
        locale={params.locale}
      />
      <Cta properties={pageProperties} />
    </>
  );
};

export default ContentPage;
