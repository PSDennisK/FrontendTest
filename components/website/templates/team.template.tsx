import {Section} from '@/components/ui/Layout';

import {Employees} from '@/components/website/Employees';
import {IntroText} from '@/components/website/intro';
import {Culture, UmbracoProperties} from '@/types';
import React from 'react';

interface TeamTemplateProps {
  params: {
    slug: string;
    locale: keyof typeof Culture;
  };
  properties: UmbracoProperties;
}

const TeamTemplate: React.FC<TeamTemplateProps> = ({params, properties}) => {
  return (
    <Section id="team" className="relative mx-auto max-w-7xl pb-24">
      <IntroText properties={properties} />
      <Employees params={params} />
    </Section>
  );
};

export default React.memo(TeamTemplate);
