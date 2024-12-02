'use client';

import {Container} from '@/components/ui/Layout';

import {LoadingContentItemHolder} from '@/components/ui/Skeleton';
import {umbraco} from '@/foodbook.config';
import {useTranslation} from '@/i18n/client';
import {LocaleTypes} from '@/i18n/settings';
import {umbracoService} from '@/services';
import {Umbraco} from '@/types';
import {getUrlFromPageLink} from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import {FaArrowRight} from 'react-icons/fa6';

const Highlights = () => {
  let locale = useParams()?.locale as LocaleTypes;
  const {t} = useTranslation(locale, 'website');
  const [loading, setLoading] = useState<boolean>(false);
  const [highlights, setHighlights] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      setLoading(true);

      const highlights = await umbracoService.fetchChildrenBySlug(
        'highlights',
        locale,
        3,
      );

      setHighlights(highlights);
      setLoading(false);
    };

    fetchHighlights();
  }, [locale]);

  return (
    <>
      <Container className="w-full flex justify-between align-middle pt-6">
        <h3 className="flex-1 text-xl font-semibold leading-7 py-6">
          {t('home.whatIsPs')}
        </h3>
      </Container>

      <Container className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-3 md:gap-4">
        {loading ? (
          <LoadingContentItemHolder amount={3} />
        ) : (
          <>
            {highlights?.items?.map(highlight => (
              <HighlightItem key={highlight?.id} highlight={highlight} />
            ))}
          </>
        )}
      </Container>
    </>
  );
};

const HighlightItem = ({highlight}: {highlight: Umbraco | null}) => {
  const link = highlight?.properties?.pageLink[0];

  return (
    <Link
      key={highlight.id}
      href={getUrlFromPageLink(link)}
      className="group flex flex-col rounded-xl bg-white shadow-xl relative"
    >
      {highlight?.properties?.pageImage?.map(image => (
        <figure
          key={image?.id}
          className="flex min-h-96 justify-center items-center overflow-hidden"
        >
          <Image
            key={image?.id}
            src={`${umbraco.site_domain}${image?.url}`}
            alt={image?.name}
            width={image?.width}
            height={image?.height}
            className="rounded-xl min-h-96 h-96 w-full transition object-cover duration-200 ease-in-out transform group-hover:scale-105"
          />
        </figure>
      ))}

      <Container className="absolute text-3xl font-bold text-white bottom-6 left-6 flex w-full">
        {highlight?.properties?.pageTitle}
        <span className="absolute right-10">
          <FaArrowRight />
        </span>
      </Container>
    </Link>
  );
};

export {HighlightItem, Highlights};
