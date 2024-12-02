'use client';

import BackButton from '@/components/ui/Button/BackButton';
import {Nav} from '@/components/ui/Layout';
import {locales} from '@/i18n';
import {type BreadCrumb, type BreadCrumbItem} from '@/types';
import {slugToText} from '@/utils/helpers';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {type FC, memo} from 'react';
import {useTranslation} from 'react-i18next';
import {HiHome} from 'react-icons/hi2';

interface BreadcrumbItemProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  position: number;
  isActive?: boolean;
  activeClasses?: string;
  showSeparator: boolean;
  separator?: React.ReactNode;
}

const NAV_CLASSES = 'w-full flex text-sm mb-6 lowercase';
const BREADCRUMB_LIST_CLASSES =
  'inline-flex items-center space-x-1 md:space-x-2';
const LINK_BASE_CLASSES = 'hover:text-ps-blue-400';
const NON_LINKABLE_PATHS = ['product', 'brand'];

/**
 * Individual breadcrumb item component
 */
const BreadcrumbItem: FC<BreadcrumbItemProps> = memo(
  ({
    href,
    label,
    icon,
    position,
    isActive,
    activeClasses = '',
    showSeparator,
    separator,
  }) => {
    const isFirstItem = position === 1;
    const isNonLinkable = NON_LINKABLE_PATHS.some(path =>
      href.endsWith(`/${path}`),
    );

    const labelContent = (
      <span className={isFirstItem ? 'hidden' : ''}>{label}</span>
    );

    return (
      <li
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
        className="inline-flex items-center"
      >
        {isNonLinkable ? (
          <span>
            {icon}
            {labelContent}
          </span>
        ) : (
          <Link
            itemScope
            itemType="https://schema.org/WebPage"
            itemProp="item"
            itemID={href}
            href={href}
            className={`${LINK_BASE_CLASSES} ${isActive ? activeClasses : ''}`}
            title={label}
          >
            {icon}
            <span itemProp="name">{labelContent}</span>
          </Link>
        )}
        <meta itemProp="position" content={position.toString()} />
        {showSeparator && separator}
      </li>
    );
  },
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

/**
 * Function to check if path is a language path
 */
const isLanguagePath = (path: string): boolean => {
  return locales.some(lang => path.endsWith(`/${lang}`));
};

/**
 * Main breadcrumbs component
 */
const BreadCrumbs: FC<BreadCrumb> = memo(
  ({separator, activeClasses, capitalizeLinks, locale}) => {
    const {t} = useTranslation('common');
    const paths = usePathname();

    if (paths === '/') {
      return null;
    }

    const pathNames = paths.split('/').filter(Boolean);

    const breadcrumbs: BreadCrumbItem[] = pathNames.map((link, index) => {
      const href = `/${pathNames.slice(0, index + 1).join('/')}`;
      const label = capitalizeLinks
        ? link.charAt(0).toUpperCase() + link.slice(1)
        : link;

      return {
        href,
        label: decodeURIComponent(label),
        isLast: index === pathNames.length - 1,
      };
    });

    const filteredBreadcrumbs = breadcrumbs.filter(
      item => !isLanguagePath(item.href),
    );

    return (
      <Nav className={NAV_CLASSES} aria-label="Breadcrumb">
        <BackButton />
        <ol
          itemScope
          itemType="http://schema.org/BreadcrumbList"
          className={BREADCRUMB_LIST_CLASSES}
        >
          <BreadcrumbItem
            href={`/${locale}`}
            label={t('common.goToHome')}
            icon={<HiHome />}
            position={1}
            showSeparator={filteredBreadcrumbs.length > 0}
            separator={separator}
          />

          {filteredBreadcrumbs.map((item, index) => (
            <BreadcrumbItem
              key={item.href}
              href={item.href}
              label={slugToText(item.label)}
              position={index + 2}
              isActive={item.isLast}
              activeClasses={activeClasses}
              showSeparator={!item.isLast}
              separator={separator}
            />
          ))}
        </ol>
      </Nav>
    );
  },
);

BreadCrumbs.displayName = 'BreadCrumbs';

export default BreadCrumbs;
