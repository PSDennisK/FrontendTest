'use client';

import {Container, Section} from '@/components/ui/Layout';

import SearchForm from '@/components/features/foodbook/Product/ProductSearch/SearchForm';
import HtmlContent from '@/components/ui/HtmlContent';
import ContentBlocks from '@/components/website/ContentBlocks';
import StatsCounter from '@/components/website/custom/counters';
import Cta from '@/components/website/custom/cta';
import {Culture, Umbraco, UmbracoProperties} from '@/types';
import React, {useMemo, useState} from 'react';
import {FaChevronDown} from 'react-icons/fa6';

type ClientIndexPageProps = {
  initialPage: Umbraco;
  locale: keyof typeof Culture;
};

interface HeroProps {
  properties: UmbracoProperties;
  locale: keyof typeof Culture;
}

const Hero: React.FC<HeroProps> = React.memo(({properties, locale}) => {
  const scrollToContent = e => {
    e.preventDefault();
    const element = document.querySelector('#contentblocks');
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - 120,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Section className="bg-ps-blue-100 min-h-screen flex flex-col items-center justify-center mb-10 md:mb-36">
      <Container className="flex-grow flex flex-col items-center justify-center px-10 py-32">
        <Container className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold leading-10 tracking-tight text-ps-blue-900 sm:text-5xl sm:leading-none md:text-6xl xl:text-7xl">
            <span className="block">{properties?.heroHeader}</span>
          </h1>
          <HtmlContent
            content={properties?.heroDescription?.markup}
            className="prose prose-sm max-w-2xl mx-auto mt-6 mb-6 text-center text-ps-blue-800 md:mt-12 md:mb-12 sm:text-base md:max-w-2xl md:text-lg xl:text-xl"
            tag="div"
          />
          <Container className="relative max-w-xl mx-auto hero-search-form">
            <SearchForm locale={locale} isHeaderSearch={false} />
          </Container>
        </Container>
      </Container>

      <button
        onClick={scrollToContent}
        className="mb-14 -mt-14 cursor-pointer hover:opacity-75 transition-opacity focus:outline-none"
        aria-label="Scroll to content"
      >
        <FaChevronDown className="w-6 h-6 text-ps-blue-800 animate-bounce" />
      </button>

      <StatsCounter properties={properties} />
    </Section>
  );
});

Hero.displayName = 'Hero';

const Homepage: React.FC<ClientIndexPageProps> = ({initialPage, locale}) => {
  const [currentPage] = useState<Umbraco>(initialPage);

  const memoizedContentBlocks = useMemo(
    () => (
      <ContentBlocks contentBlocks={currentPage?.properties?.contentBlocks} />
    ),
    [currentPage?.properties?.contentBlocks],
  );

  return (
    <>
      <Hero properties={currentPage?.properties} locale={locale} />

      <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {memoizedContentBlocks}

        <Cta properties={currentPage?.properties} />
      </Container>
    </>
  );
};

export {Hero, Homepage};
