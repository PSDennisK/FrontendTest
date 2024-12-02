import {Section} from '@/components/ui/Layout';

import ContentBlocks from '@/components/website/ContentBlocks';
import {Introvideo} from '@/components/website/intro';
import TargetGroups from '@/components/website/target-groups';
import {UmbracoProperties} from '@/types';

const PSImpactScoreTemplate = ({
  properties,
}: {
  properties: UmbracoProperties;
}) => {
  return (
    <Section id="psimpactscore" className="relative mx-auto max-w-7xl">
      <Introvideo properties={properties} />

      <TargetGroups targetgroups={properties?.targetGroups} />

      <ContentBlocks contentBlocks={properties?.contentBlocks} />
    </Section>
  );
};

export default PSImpactScoreTemplate;
