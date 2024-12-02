import {Container, Section} from '@/components/ui/Layout';

import {umbraco} from '@/foodbook.config';
import QuoteDown from '@/public/images/quote-down.png';
import QuoteUp from '@/public/images/quote-up.png';
import {UmbracoContent, UmbracoContentItem} from '@/types';
import Image from 'next/image';

const Qoutes = ({quotes}: {quotes: UmbracoContent}) => {
  return (
    <>
      {quotes?.items && (
        <Section id="quotes" className="relative max-w-7xl -mx-4">
          <Container className="box-border flex flex-col items-center content-center mx-auto mt-24 leading-6 text-black border-0 border-gray-300 border-solid md:flex-row max-w-7xl">
            {quotes?.items.map(quote => (
              <Quote key={quote?.content?.id} quote={quote} />
            ))}
          </Container>
        </Section>
      )}
    </>
  );
};

const Quote = ({quote}: {quote: UmbracoContentItem}) => {
  if (!quote) return null;

  const isRightAligned =
    quote.content?.properties.quoteAlign.toLowerCase() === 'right';

  return (
    <>
      <Container
        className={`box-border relative w-full px-4 mt-5 mb-4 text-center bg-no-repeat bg-contain border-solid md:ml-0 md:mt-0 md:max-w-none lg:mb-0 md:w-1/2 ${isRightAligned ? 'md:order-1' : 'md:order-2'}`}
      >
        {quote?.content?.properties?.quoteImage?.map(
          image =>
            image && (
              <Image
                key={image.id}
                src={`${umbraco.site_domain}${image?.url}`}
                alt={image?.name}
                width={555}
                height={315}
              />
            ),
        )}

        {quote?.content?.properties?.quoteVideoURL?.markup && (
          <div
            className="[&>div]:aspect-video [&>div>iframe]:rounded-xl [&>div>iframe]:w-full [&>div>iframe]:h-full"
            dangerouslySetInnerHTML={{
              __html: quote?.content?.properties?.quoteVideoURL.markup,
            }}
          ></div>
        )}
      </Container>

      <Container
        className={`box-border w-full text-black border-solid px-4 md:w-1/2 md:pl-4 ${isRightAligned ? 'md:order-2' : 'md:order-1'}`}
      >
        <p className="flex justify-start">
          <Image alt="Quote" src={QuoteUp} width={64} height={64} />
        </p>

        <h3 className="leading-3 text-xs font-bold text-ps-blue-400 mt-5 mb-3">
          {quote?.content?.properties?.personFunction}
        </h3>

        <h2 className="text-3xl font-bold mt-5 mb-3">
          {quote?.content?.properties?.personName}
        </h2>

        {quote?.content?.properties?.quoteText.markup && (
          <div
            className="mt-5 mb-3 [&>p]:mt-3 [&>p]:mb-5 [&>p>a:hover]:text-ps-blue-400 [&>p>a]:transition-all [&>p>a]:duration-300"
            dangerouslySetInnerHTML={{
              __html: quote?.content?.properties?.quoteText.markup,
            }}
          ></div>
        )}

        <p className="flex justify-end">
          <Image alt="Quote" src={QuoteDown} width={64} height={64} />
        </p>
      </Container>
    </>
  );
};

export {Qoutes, Quote};
