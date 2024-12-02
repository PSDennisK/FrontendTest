import {Section} from '@/components/ui/Layout';

import ContentBlocks from '@/components/website/ContentBlocks';
import {IntroImage} from '@/components/website/intro';
import {Qoutes} from '@/components/website/quote';
import {UmbracoProperties} from '@/types';
import React from 'react';

interface TargetGroupTemplateProps {
  properties: UmbracoProperties;
}

const TargetGroupTemplate: React.FC<TargetGroupTemplateProps> = ({
  properties,
}) => {
  return (
    <Section id="target-group" className="relative mx-auto max-w-7xl">
      <IntroImage properties={properties} />
      <ContentBlocks contentBlocks={properties.contentBlocks} />
      <Qoutes quotes={properties.quotes} />
    </Section>
  );
};

export default React.memo(TargetGroupTemplate);
