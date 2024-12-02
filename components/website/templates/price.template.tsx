import {Container, Section} from '@/components/ui/Layout';

import {IntroText} from '@/components/website/intro';
import {PricingTable} from '@/components/website/pricing';
import {UmbracoProperties} from '@/types';

const PriceTemplate = ({properties}: {properties: UmbracoProperties}) => {
  return (
    <>
      <IntroText properties={properties} />

      <Section
        id="pricing"
        className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-ps-darkblue p-0 mt-28 mb-20"
      >
        <Container className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Container className="flex flex-wrap">
            <Container className="column w-full will_animate">
              <Container className="block w-full overflow-auto scrolling-touch bg-slate-50 -mt-24 mb-0 mx-0 px-3 py-5">
                <PricingTable properties={properties} />
                {properties?.pricingFooterText && (
                  <div
                    className="text-sm leading-7 py-0 px-3"
                    dangerouslySetInnerHTML={{
                      __html: properties?.pricingFooterText?.markup,
                    }}
                  ></div>
                )}
              </Container>
            </Container>
          </Container>
        </Container>
      </Section>

      <Section id="costs" className="container mx-auto">
        <Container className="flex flex-wrap">
          {properties?.hTML && (
            <div
              className="column w-full will_animate"
              dangerouslySetInnerHTML={{
                __html: properties?.hTML?.markup,
              }}
            ></div>
          )}
        </Container>
      </Section>
    </>
  );
};

export default PriceTemplate;
