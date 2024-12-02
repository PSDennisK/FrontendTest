import FooterBlockLinks from '@/components/common/layout/Footer/FooterBlockLinks';
import FooterBlockText from '@/components/common/layout/Footer/FooterBlockText';
import {Container} from '@/components/ui/Layout';
import Form from '@/components/website/form';
import {Culture, UmbracoContentItem, UmbracoContentItemContent} from '@/types';
import {type FC, memo} from 'react';

type FooterBlockProps = {
  footerBlock: UmbracoContentItem & {
    content?: UmbracoContentItemContent;
  };
  linkedInUrl?: string;
  locale: keyof typeof Culture;
};

const FORM_BUTTON_CLASSES = `
  inline-flex mb-2 md:mb-0 mt-4 bg-ps-green-500 text-white 
  border border-ps-green-500 text-md leading-6 rounded-md py-2 px-3 
  transition-all duration-300 ease-in-out transform 
  hover:bg-white hover:border hover:text-ps-green-500 disabled:cursor-not-allowed disabled:opacity-50
`;

const FooterBlock: FC<FooterBlockProps> = ({
  footerBlock,
  linkedInUrl,
  locale,
}) => {
  const {content} = footerBlock || {};

  if (!content) {
    return null;
  }

  const {footerBlockTitle, footerBlockText, footerBlockLinks, footerBlockForm} =
    content.properties;

  return (
    <Container className="text-center sm:text-left">
      {footerBlockTitle && (
        <h2 className="text-lg font-medium text-white">{footerBlockTitle}</h2>
      )}

      <FooterBlockText
        footerBlockText={footerBlockText}
        linkedInUrl={linkedInUrl}
        locale={locale}
      />

      <FooterBlockLinks footerBlockLinks={footerBlockLinks} />

      {footerBlockForm?.id && (
        <Form
          params={{
            locale,
            formid: footerBlockForm.id,
          }}
          formButtonClass={FORM_BUTTON_CLASSES}
          thankYouClass="font-semibold mb-6 mt-4 text-white text-lg"
        />
      )}
    </Container>
  );
};

const MemoizedFooterBlock = memo(FooterBlock);

MemoizedFooterBlock.displayName = 'FooterBlock';

export default MemoizedFooterBlock;
