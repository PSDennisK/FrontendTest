'use client';

import {Container} from '@/components/ui/Layout';

import {LoadingContentItemHolder} from '@/components/ui/Skeleton';

import Pagination from '@/components/features/website/Pagination';
import {umbraco} from '@/foodbook.config';
import {useTranslation} from '@/i18n/client';
import {LocaleTypes} from '@/i18n/settings';
import {umbracoService} from '@/services';
import {Culture, Umbraco, UmbracoItems} from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';

const LatestNews = () => {
  let locale = useParams()?.locale as LocaleTypes;
  const {t} = useTranslation(locale, 'website');
  const [loading, setLoading] = useState<boolean>(false);
  const [newsItems, setNewsItems] = useState(null);

  useEffect(() => {
    const fetchLatestNews = async () => {
      setLoading(true);

      const newsItems = await umbracoService.fetchChildrenBySlug(
        t('home.news'),
        locale,
        5,
      );

      setNewsItems(newsItems);
      setLoading(false);
    };

    fetchLatestNews();
  }, [locale, t]);

  return (
    <>
      <Container className="w-full flex justify-between align-middle">
        <h3 className="flex-1 text-xl font-semibold leading-7 pb-6">
          {t('home.news')}
        </h3>
        <p className="py-6">
          <a href={`/${locale.toLowerCase()}/${t('home.news').toLowerCase()}`}>
            {t('home.allNews')}
          </a>
        </p>
      </Container>
      <Container className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
        {loading ? (
          <LoadingContentItemHolder amount={4} />
        ) : (
          <>
            {newsItems?.items?.map(newsItem => (
              <NewsItem key={newsItem?.id} newsitem={newsItem} />
            ))}
          </>
        )}
      </Container>
    </>
  );
};

const NewsItems = ({
  params,
}: {
  params: {slug: string; locale: keyof typeof Culture};
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newsitems, setNewsitems] = useState<UmbracoItems>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      const newsitems: UmbracoItems = await umbracoService.fetchChildrenBySlug(
        params.slug,
        params.locale,
        999,
      );

      setNewsitems(newsitems);
      setLoading(false);
    };

    fetchNews();
  }, [params.locale, params.slug]);

  return (
    <Container className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 mb-12">
      {loading ? (
        <LoadingContentItemHolder amount={4} />
      ) : (
        <>
          {newsitems?.items?.map(newsitem => (
            <NewsItem key={newsitem.id} newsitem={newsitem} />
          ))}
        </>
      )}

      <Pagination pages={newsitems} total={newsitems?.total} />
    </Container>
  );
};

const NewsItem = ({newsitem}: {newsitem: Umbraco}) => {
  return (
    <Link
      key={newsitem.id}
      href={newsitem?.route.path}
      className="group flex flex-col rounded-xl bg-white shadow-xl"
    >
      {newsitem?.properties?.pageImage &&
        newsitem?.properties?.pageImage?.map(image => (
          <figure
            key={image?.id}
            className="flex min-h-48 justify-center items-center rounded-t-xl overflow-hidden"
          >
            <Image
              key={image?.id}
              src={`${umbraco.site_domain}${image?.url}`}
              alt={image?.name}
              width={image?.width}
              height={image?.height}
              className="rounded-t-xl min-h-48 h-48 w-full transition object-cover duration-200 ease-in-out transform group-hover:scale-105"
            />
          </figure>
        ))}

      <Container className="flex flex-col overflow-hidden p-6">
        <Container className="text-lg font-bold text-[#374151]">
          {newsitem?.properties?.pageTitle}
        </Container>
      </Container>
    </Link>
  );
};

export {LatestNews, NewsItem, NewsItems};
