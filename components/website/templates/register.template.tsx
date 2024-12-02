import {Container, Section} from '@/components/ui/Layout';

import Form from '@/components/website/form';
import {IntroImage} from '@/components/website/intro';
import {Culture, UmbracoProperties} from '@/types';
import React from 'react';

interface RegisterTemplateProps {
  params: {
    slug: string;
    locale: keyof typeof Culture;
  };
  properties: UmbracoProperties;
}

const FORM_BUTTON_CLASSES = `
  inline-flex mb-2 md:mb-0 mt-4 bg-ps-green-500 text-white 
  border border-ps-green-500 text-md leading-6 rounded-md py-2 px-3 
  transition-all duration-300 ease-in-out transform 
  hover:bg-white hover:border hover:text-ps-green-500 disabled:cursor-not-allowed disabled:opacity-50
`;

const RegisterTemplate: React.FC<RegisterTemplateProps> = ({
  params,
  properties,
}) => {
  return (
    <>
      <IntroImage properties={properties} />

      <Section
        id="colored-banner"
        className="relative left-1/2 right-1/2 -mx-[50vw] mt-12 py-12 w-screen bg-ps-lightblue-400 my-14"
      >
        <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Container className="md:w-1/2">
            <h2 className="text-4xl text-white font-semibold">
              {properties?.contactPhrase}
            </h2>
          </Container>
        </Container>
      </Section>

      <Section id="contact" className="max-w-7xl mx-auto">
        <Container className="flex flex-wrap px-4 md:px-10">
          {properties?.registerForm?.id && (
            <div className="w-full mt-24 z-10">
              <Form
                params={{
                  locale: params.locale,
                  formid: properties?.registerForm?.id,
                }}
                formContainerClass="p-2 md:p-6 bg-ps-lightgray md:-mt-72 rounded-xl"
                formButtonClass={FORM_BUTTON_CLASSES}
                thankYouClass="font-semibold mb-6 mt-4 px-4 text-2xl"
              />
            </div>
          )}
        </Container>
      </Section>
    </>
  );
};

export default React.memo(RegisterTemplate);
