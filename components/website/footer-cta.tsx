'use client';

import {Container, Section} from '@/components/ui/Layout';

import {umbraco} from '@/foodbook.config';
import {UmbracoProperties} from '@/types';
import {getUrlFromPageLink} from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';

const FooterCta = ({properties}: {properties: UmbracoProperties}) => {
  let imageUrl = '';

  if (
    properties?.footerCtaBackground &&
    properties.footerCtaBackground[0]?.url
  ) {
    imageUrl = `${umbraco.site_domain}${properties.footerCtaBackground[0].url}`;
  }

  return (
    <Section
      id="footer-cta"
      className="relative left-1/2 right-1/2 -mx-[51vw] w-screen mt-28 will_animate"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: '50% 45%',
        backgroundSize: 'cover',
      }}
    >
      <Container className="container mx-auto sm:px-4">
        <Container className="flex flex-wrap">
          <Container className="md:w-1/2 pr-4 pl-4">
            {properties?.footerCtaImage ? (
              // <div className="-mt-24">
              <Container className="">
                {properties?.footerCtaImage?.map(image => (
                  <p key={image?.id} className="float-right">
                    <Image
                      alt={image?.name}
                      src={`${umbraco.site_domain}${image?.url}`}
                      width={555}
                      height={444}
                    />
                  </p>
                ))}
              </Container>
            ) : (
              properties?.greenTitle && (
                <Container className="bg-green-gradient text-white shadow-xl p-6 mr-0 mb-20 ml-[150px]">
                  <Container className="info">
                    <h2 className="text-3xl font-medium mb-8">
                      {properties?.greenTitle}
                    </h2>
                    {properties?.greenText?.markup && (
                      <div
                        className="[&>p]:mt-3 [&>p]:mb-5 leading-7"
                        dangerouslySetInnerHTML={{
                          __html: properties?.greenText?.markup,
                        }}
                      ></div>
                    )}
                  </Container>
                </Container>
              )
            )}
          </Container>

          <Container className="md:w-1/2 pr-4 pl-4">
            <Container className="title">
              <h3 className="text-xs text-ps-green uppercase font-bold mt-3 mb-5">
                {properties?.footerCtaSubtitle}
              </h3>
              <h2 className="text-3xl font-medium mt-5 mb-8">
                {properties?.footerCtaTitle}
              </h2>
            </Container>

            {properties?.footerCtaText?.markup && (
              <div
                className="[&>p]:mt-3 [&>p]:mb-5"
                dangerouslySetInnerHTML={{
                  __html: properties?.footerCtaText?.markup,
                }}
              ></div>
            )}

            <Container className="flex my-8">
              {properties?.footerCtaButtonLink &&
                properties?.footerCtaButtonLink.map(link => (
                  <Link
                    key={link?.destinationId}
                    className="button bg-ps-green text-white text-lg leading-6 rounded-md border transition-all duration-300 py-3 px-4 mr-2 hover:bg-white hover:text-ps-green hover:border-ps-green"
                    href={getUrlFromPageLink(link)}
                    target={link?.target}
                    title={link?.title}
                  >
                    {link?.title}
                  </Link>
                ))}
            </Container>
          </Container>
        </Container>
      </Container>
    </Section>
  );
};

export default FooterCta;
