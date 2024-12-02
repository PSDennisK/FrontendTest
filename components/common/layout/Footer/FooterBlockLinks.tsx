import {UmbracoLink} from '@/types';
import {getUrlFromPageLink} from '@/utils/helpers';
import Link from 'next/link';
import {type FC} from 'react';

type FooterBlockLinksProps = {
  footerBlockLinks?: UmbracoLink[];
};

const LINK_CLASSES =
  'text-neutral-200 transition hover:text-neutral-200/75 focus:outline-none focus:ring-2 focus:ring-neutral-200';

/**
 * Renders a list of footer navigation links
 * Returns null if no links are provided
 */
const FooterBlockLinks: FC<FooterBlockLinksProps> = ({footerBlockLinks}) => {
  if (!footerBlockLinks?.length) {
    return null;
  }

  return (
    <nav aria-label="Footer navigation">
      <ul className="mt-8 space-y-4 text-sm">
        {footerBlockLinks.map(link => (
          <li key={`${link.title}-${link.url ?? ''}`}>
            <Link
              className={LINK_CLASSES}
              href={getUrlFromPageLink(link)}
              target={link.target}
              rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

FooterBlockLinks.displayName = 'FooterBlockLinks';

export default FooterBlockLinks;
