import {IntroImage} from '@/components/website/intro';
import {NewsItems} from '@/components/website/news';
import {Culture, UmbracoProperties} from '@/types';

const NewsTemplate = ({
  params,
  properties,
}: {
  params: {slug: string; locale: keyof typeof Culture};
  properties: UmbracoProperties;
}) => {
  return (
    <>
      <IntroImage properties={properties} />

      <NewsItems params={params} />
    </>
  );
};

export default NewsTemplate;
