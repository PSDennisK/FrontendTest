import HtmlContent from '@/components/ui/HtmlContent';
import {createTranslation} from '@/i18n';
import {Culture, UmbracoText} from '@/types';
import {type FC} from 'react';
import {AiFillLinkedin} from 'react-icons/ai';

type FooterBlockTextProps = {
  footerBlockText?: UmbracoText;
  linkedInUrl?: string;
  locale: keyof typeof Culture;
};

const HTML_CONTENT_CLASSES =
  'text-sm mt-7 max-w-md text-center leading-7 text-neutral-200 sm:max-w-xs sm:text-left [&>p>a:hover]:text-neutral-200/75';

const LINKEDIN_LINK_CLASSES =
  'inline-flex text-ps-blue-400 transition hover:text-ps-blue-400/75';

const LINKEDIN_ICON_CLASSES = 'h-8 w-8 -ml-2 mt-1';

/**
 * Renders footer text content and optional LinkedIn link
 * Uses server-side translation for LinkedIn link labels
 */
const FooterBlockText: FC<FooterBlockTextProps> = async ({
  footerBlockText,
  linkedInUrl,
  locale,
}) => {
  const t = await createTranslation(locale, 'website');

  if (!footerBlockText?.markup && !linkedInUrl) {
    return null;
  }

  const linkedInLabel = t('home.followUsOnLinkedIn');

  return (
    <>
      {footerBlockText?.markup && (
        <HtmlContent
          content={footerBlockText.markup}
          className={HTML_CONTENT_CLASSES}
          tag="div"
        />
      )}

      {linkedInUrl && (
        <a
          href={linkedInUrl}
          rel="noreferrer noopener"
          target="_blank"
          className={LINKEDIN_LINK_CLASSES}
          aria-label={linkedInLabel}
          title={linkedInLabel}
        >
          <AiFillLinkedin
            className={LINKEDIN_ICON_CLASSES}
            aria-hidden="true"
          />
        </a>
      )}
    </>
  );
};

FooterBlockText.displayName = 'FooterBlockText';

export default FooterBlockText;
