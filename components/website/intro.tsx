import {Container, Section} from '@/components/ui/Layout';

import Button from '@/components/ui/Button';

import {umbraco} from '@/foodbook.config';
import {UmbracoProperties} from '@/types';
import {getUrlFromPageLink} from '@/utils/helpers';
import Image from 'next/image';

const IntroImage = ({properties}: {properties: UmbracoProperties}) => {
  return (
    <Section id="intro-image" className="w-full">
      <Container className="md:flex gap-8">
        <Container className={`w-full ${properties?.pageImage && 'md:w-3/5'}`}>
          <Container className="title">
            <h1 className="leading-10 font-medium text-3xl text-ps-blue-600 mb-3">
              {properties?.pageTitle}
            </h1>
          </Container>
          {properties?.bodyText?.markup && (
            <div
              className="mt-3 mb-5 [&>p]:mt-3 [&>p]:mb-5 [&>p>a:hover]:text-ps-blue-400 [&>p>a]:transition-all [&>p>a]:duration-300"
              dangerouslySetInnerHTML={{
                __html: properties?.bodyText?.markup,
              }}
            ></div>
          )}
          {properties?.pageLinks && (
            <Container className="flex my-8">
              <p>
                {properties.pageLinks.map(pageLink => (
                  <Button
                    key={pageLink?.destinationId}
                    className="inline-flex mb-2 md:mb-0 bg-ps-green-500 text-white border border-ps-green-500 text-lg leading-6 rounded-md py-3 px-4 mr-2 transition-all duration-300 ease-in-out transform hover:bg-white hover:border hover:text-ps-green-500"
                    href={getUrlFromPageLink(pageLink)}
                    target={pageLink?.target}
                    title={pageLink?.title}
                  />
                ))}
              </p>
            </Container>
          )}
        </Container>

        {properties?.pageImage && (
          <Container className="w-full md:w-2/5">
            {properties?.pageImage.map(image => (
              <p key={image?.id}>
                <Image
                  className="-mt-8 mx-auto"
                  src={`${umbraco.site_domain}${image?.url}`}
                  alt={image?.name}
                  width={458}
                  height={484}
                />
              </p>
            ))}
          </Container>
        )}
      </Container>
    </Section>
  );
};

const IntroText = ({properties}: {properties: UmbracoProperties}) => {
  return (
    <Container className="w-full">
      <h1 className="leading-10 font-medium text-3xl text-ps-blue-600 mb-3">
        {properties?.pageTitle}
      </h1>

      {properties?.bodyText?.markup && (
        <div
          className="leading-7 my-8 [&>p]:mt-3 [&>p]:mb-5 [&>p>a:hover]:text-ps-lightblue-400 [&>p>a]:transition-all [&>p>a]:duration-300"
          dangerouslySetInnerHTML={{
            __html: properties?.bodyText?.markup,
          }}
        ></div>
      )}

      <h2 className="relative mt-10 mb-10 text-3xl text-center font-semibold lg:text-4xl">
        {properties?.employeesTitle}
      </h2>
    </Container>
  );
};

const Introvideo = ({properties}: {properties: UmbracoProperties}) => {
  return (
    <Section id="intro-video" className="w-full">
      <Container className="container mx-auto">
        <Container className="flex flex-wrap">
          <Container className="w-full md:w-1/2 md:pr-4">
            <Container className="title">
              <h1 className="leading-10 font-medium text-3xl text-ps-blue-600 mb-3">
                {properties?.heroHeader}
              </h1>
            </Container>

            {properties?.heroDescription?.markup && (
              <div
                className="leading-7 my-8 [&>p]:mt-3 [&>p]:mb-5 [&>p>a:hover]:text-ps-blue-400 [&>p>a]:transition-all [&>p>a]:duration-300"
                dangerouslySetInnerHTML={{
                  __html: properties?.heroDescription?.markup,
                }}
              ></div>
            )}

            {properties?.heroCtalink?.map(link => (
              <Button
                key={link?.destinationId}
                title={link?.title}
                className="inline-flex mb-2 md:mb-0 bg-ps-green-500 text-white border border-ps-green-500 text-lg leading-6 rounded-md py-3 px-4 mr-2 transition-all duration-300 ease-in-out transform hover:bg-white hover:border hover:text-ps-green-500"
                href={link?.url || link?.route?.path || ''}
                target={link?.target}
              />
            ))}
          </Container>

          <Container className="w-full md:w-1/2 md:pl-4">
            {properties?.heroMedia && properties?.heroMedia[0] && (
              <Container className="video">
                <video
                  className="w-auto min-w-full max-w-full rounded-xl mb-5"
                  autoPlay
                  controls
                  loop
                  muted
                  src={`${umbraco.site_domain}${properties?.heroMedia[0].url}`}
                ></video>
              </Container>
            )}
          </Container>
        </Container>

        <Container className="flex flex-wrap">
          <Container className="md:w-3/5 md:pr-4 md:pl-28 md:col-md-offset-1">
            <Container className="bg-green-gradient text-white leading-7 shadow-xl rounded-xl p-6 md:-mt-10">
              <Container className="info">
                <h2 className="leading-9 text-3xl mb-3">
                  {properties?.greenBlockHeader}
                </h2>
                {properties?.greenBlockText?.markup && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: properties?.greenBlockText?.markup,
                    }}
                  ></div>
                )}
              </Container>
            </Container>
          </Container>
        </Container>
      </Container>
    </Section>
  );
};

export {IntroImage, IntroText, Introvideo};
