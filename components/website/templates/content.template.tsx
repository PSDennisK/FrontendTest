import {IntroImage} from '@/components/website/intro';
import {UmbracoProperties} from '@/types';

const ContentTemplate = ({properties}: {properties: UmbracoProperties}) => {
  return (
    <>
      <IntroImage properties={properties} />

      <div id="news" className="mb-12"></div>
    </>
  );
};

export default ContentTemplate;
