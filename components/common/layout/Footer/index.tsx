import Copyright from '@/components/common/layout/Footer/Copyright';
import FooterBlock from '@/components/common/layout/Footer/FooterBlock';
import FooterLinks from '@/components/common/layout/Footer/FooterLinks';
import {Container, Footer} from '@/components/ui/Layout';
import {umbracoService} from '@/services';
import {Culture, Umbraco} from '@/types';
import {type FC} from 'react';

type PageFooterProps = {
  locale: keyof typeof Culture;
};

const FOOTER_CLASSES = 'bg-ps-gray';
const MAIN_CONTAINER_CLASSES =
  'mx-auto max-w-7xl px-4 pb-6 pt-16 sm:px-6 lg:pt-24';
const BLOCKS_GRID_CLASSES =
  'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2';
const SEPARATOR_CLASSES = 'h-[1px] bg-ps-darkgray/75';
const BOTTOM_CONTAINER_CLASSES = 'py-4 px-4';
const BOTTOM_CONTENT_CLASSES =
  'text-center sm:flex sm:justify-between sm:text-left';

/**
 * Main footer component that fetches and displays footer content
 * Includes footer blocks, links and copyright information
 */
const PageFooter: FC<PageFooterProps> = async ({locale}) => {
  try {
    const footer: Umbraco | null = await umbracoService.fetchFooter(locale);

    if (!footer?.properties) {
      return null;
    }

    const {footerBlocks, footerLinks} = footer.properties;
    const linkedInUrl = process.env.NEXT_PUBLIC_LINKEDIN_URL;

    return (
      <Footer className={FOOTER_CLASSES}>
        <Container className={MAIN_CONTAINER_CLASSES}>
          <Container className={BLOCKS_GRID_CLASSES}>
            {footerBlocks?.items?.map((block, index) => (
              <FooterBlock
                key={block?.content?.id ?? `footer-block-${index}`}
                footerBlock={block}
                linkedInUrl={index === 0 ? linkedInUrl : undefined}
                locale={locale}
              />
            ))}
          </Container>
        </Container>

        <div
          className={SEPARATOR_CLASSES}
          role="separator"
          aria-hidden="true"
        />

        <Container className={BOTTOM_CONTAINER_CLASSES}>
          <Container className={BOTTOM_CONTENT_CLASSES}>
            <FooterLinks footerLinks={footerLinks} />
            <Copyright locale={locale} />
          </Container>
        </Container>
      </Footer>
    );
  } catch (error) {
    console.error('Failed to fetch footer data:', error);
    return null;
  }
};

export default PageFooter;
