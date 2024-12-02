import Button from '@/components/ui/Button';
import {Container, Section} from '@/components/ui/Layout';
import {umbraco} from '@/foodbook.config';
import {UmbracoProperties} from '@/types';
import {getUrlFromPageLink} from '@/utils/helpers';
import Image from 'next/image';

const Cta = ({properties}: {properties: UmbracoProperties}) => {
  return (
    properties?.footerCtaTitle && (
      <Section id="cta" className="max-w-7xl mx-auto py-6 md:py-24">
        <Container className="bg-yellow-400 py-10 md:py-16 rounded-xl">
          <Container className="container mx-auto px-10 md:px-24 flex flex-col md:flex-row items-center">
            <Container
              className={`mb-8 md:mb-0 ${properties?.footerCtaImage?.length === 1 ? 'md:w-2/3 md:pr-24' : 'w-full'}`}
            >
              {properties?.footerCtaTitle && (
                <h2 className="text-3xl font-bold mb-4">
                  {properties.footerCtaTitle}
                </h2>
              )}

              {properties?.footerCtaSubtitle && (
                <h3 className="text-xl font-bold mb-4">
                  {properties?.footerCtaSubtitle}
                </h3>
              )}

              {properties?.footerCtaText?.markup && (
                <div
                  className="prose prose-lg mb-6"
                  dangerouslySetInnerHTML={{
                    __html: properties?.footerCtaText?.markup,
                  }}
                ></div>
              )}

              {properties?.footerCtaButtonLink &&
                properties?.footerCtaButtonLink.map(link => (
                  <Button
                    key={link?.destinationId}
                    title={link?.title}
                    className="inline-flex mb-2 md:mb-0 bg-ps-green-500 text-white border border-ps-green-500 text-lg leading-6 rounded-md py-3 px-4 mr-2 transition-all duration-300 ease-in-out transform hover:bg-white hover:border hover:text-ps-green-500"
                    href={getUrlFromPageLink(link)}
                    target={link?.target}
                  />
                ))}
            </Container>

            {properties?.footerCtaImage?.map(image => {
              if (!image) {
                return null;
              }

              return (
                <Container key={image?.id} className="md:w-1/3">
                  <p>
                    <Image
                      alt={image?.name ?? ''}
                      src={`${umbraco.site_domain}${image?.url ?? ''}`}
                      width={360}
                      height={360}
                    />
                  </p>
                </Container>
              );
            })}
          </Container>
        </Container>
      </Section>
    )
  );
};

export default Cta;
