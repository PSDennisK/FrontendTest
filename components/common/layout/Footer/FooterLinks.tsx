import {UmbracoLink} from '@/types';
import {getUrlFromPageLink} from '@/utils/helpers';
import Link from 'next/link';
import {type FC, Fragment} from 'react';

type FooterLinksProps = {
  footerLinks?: UmbracoLink[];
};

const LINK_CLASSES =
  'inline-block text-neutral-400 underline transition hover:text-neutral-400/75 focus:outline-none focus:ring-2 focus:ring-neutral-400';
const NAV_CLASSES = 'text-sm text-neutral-400';
const SEPARATOR_CLASSES = 'mx-1';

/**
 * Renders a horizontal list of footer links with dot separators
 * Returns null if no links are provided
 */
const FooterLinks: FC<FooterLinksProps> = ({footerLinks}) => {
  if (!footerLinks?.length) {
    return null;
  }

  return (
    <nav className={NAV_CLASSES} aria-label="Footer quick links">
      {footerLinks.map((link, index) => {
        const isLastLink = index === footerLinks.length - 1;
        const key = link.destinationId || `footer-link-${index}`;
        const showSeparator = !isLastLink;

        return (
          <Fragment key={key}>
            <Link
              className={LINK_CLASSES}
              href={getUrlFromPageLink(link)}
              target={link.target}
              rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {link.title}
            </Link>

            {showSeparator && (
              <span className={SEPARATOR_CLASSES} aria-hidden="true">
                &middot;
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
};

FooterLinks.displayName = 'FooterLinks';

export default FooterLinks;
