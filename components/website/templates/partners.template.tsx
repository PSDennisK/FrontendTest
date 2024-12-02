import {Container, Section} from '@/components/ui/Layout';

import {IntroImage} from '@/components/website/intro';
import {UmbracoProperties} from '@/types';

const PartnersTemplate = ({properties}: {properties: UmbracoProperties}) => {
  return (
    <>
      <IntroImage properties={properties} />

      <Section id="partners" className="mx-auto sm:px-4">
        <Container className="flex flex-wrap">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{
              __html: properties?.hTML?.markup,
            }}
          ></div>
        </Container>
      </Section>
    </>
  );
};

export default PartnersTemplate;
