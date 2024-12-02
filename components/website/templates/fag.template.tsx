import {Section} from '@/components/ui/Layout';

import {Faq} from '@/components/website/faq';
import {IntroText} from '@/components/website/intro';
import {Culture, UmbracoProperties} from '@/types';

const FaqTemplate = ({
  params,
  properties,
}: {
  params: {slug: string; locale: keyof typeof Culture};
  properties: UmbracoProperties;
}) => {
  return (
    <Section id="faq" className="relative mx-auto max-w-7xl pb-24">
      <IntroText properties={properties} />

      <Faq params={params} />
    </Section>
  );
};

export default FaqTemplate;
