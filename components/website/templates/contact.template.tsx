import {Container, Section} from '@/components/ui/Layout';

import Form from '@/components/website/form';

import {IntroImage} from '@/components/website/intro';
import {Culture, UmbracoProperties} from '@/types';

const ContactTemplate = ({
  properties,
  locale,
}: {
  properties: UmbracoProperties;
  locale: keyof typeof Culture;
}) => {
  return (
    <>
      <IntroImage properties={properties} />

      <Section
        id="colored-banner"
        className="relative left-1/2 right-1/2 -mx-[50vw] mt-12 py-12 w-screen bg-ps-lightblue-400 my-14"
      >
        <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Container className="md:w-1/2 px-4">
            <h2 className="text-4xl text-white font-semibold">
              {properties?.contactPhrase}
            </h2>
          </Container>
        </Container>
      </Section>

      <Section id="contact" className="max-w-7xl mx-auto pb-6 md:pb-24">
        <Container className="flex flex-wrap">
          <Container className="w-full md:w-1/2 md:pr-6 order-2 md:order-1">
            {properties?.contactInfo?.markup && (
              <div
                className="leading-7 my-8 [&>p]:mt-3 [&>p]:mb-5 [&>p>a:hover]:text-ps-lightblue-400 [&>p>a]:transition-all [&>p>a]:duration-300"
                dangerouslySetInnerHTML={{
                  __html: properties?.contactInfo?.markup,
                }}
              ></div>
            )}
          </Container>

          {properties?.form?.id && (
            <div className="w-full md:w-1/2 z-10 order-1 md:order-2">
              <Form
                params={{locale: locale, formid: properties?.form?.id}}
                formContainerClass="p-2 md:p-6 bg-ps-lightgray md:-mt-72 rounded-xl"
                formButtonClass="inline-flex mb-2 md:mb-0 bg-ps-green-500 text-white border border-ps-green-500 text-lg leading-6 rounded-md py-3 px-4 transition-all duration-300 ease-in-out transform hover:bg-white hover:border hover:text-ps-green-500"
                thankYouClass="font-semibold mb-6 mt-4 px-4 text-2xl"
              />
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};

export default ContactTemplate;
