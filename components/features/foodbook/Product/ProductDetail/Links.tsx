'use client';

import {Container} from '@/components/ui/Layout';
import {Assetinfo} from '@/types';
import {FC, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {FaLink} from 'react-icons/fa6';

const CLASSES = {
  container: 'mr-6',
  wrapper: 'mx-auto relative mb-8 lg:mb-10 xl:mb-12',
  title: 'flex text-xl font-semibold leading-6 mb-4',
  titleIcon: 'ml-2',
  list: 'space-y-2',
  listItem: 'flex items-center space-x-2',
  link: 'link inline-flex items-center hover:underline',
} as const;

type LinkItemProps = {
  link: Assetinfo;
  t: (key: string) => string;
};

type LinksProps = {
  links: Assetinfo[];
};

const LinkItem: FC<LinkItemProps> = memo(({link, t}) => (
  <li className={CLASSES.listItem}>
    <a
      href={link.hyperlink}
      target="_blank"
      rel="noopener noreferrer"
      className={CLASSES.link}
    >
      <span>{link.title?.value || t('product.untitledLink')}</span>
    </a>
  </li>
));

const Links: FC<LinksProps> = memo(({links}) => {
  const {t} = useTranslation('common');

  if (!links?.length) return null;

  return (
    <Container id="links" className={CLASSES.container}>
      <Container className={CLASSES.wrapper}>
        <h2 className={CLASSES.title}>
          {t('product.links')}
          <FaLink className={CLASSES.titleIcon} aria-hidden="true" />
        </h2>

        <ul className={CLASSES.list}>
          {links.map(link => (
            <LinkItem key={link.id} link={link} t={t} />
          ))}
        </ul>
      </Container>
    </Container>
  );
});

LinkItem.displayName = 'LinkItem';
Links.displayName = 'Links';

export default Links;
