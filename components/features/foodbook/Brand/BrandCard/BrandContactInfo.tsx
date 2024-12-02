'use client';

import {Container} from '@/components/ui/Layout';
import {Brand, ContactItem} from '@/types';
import {type FC, memo, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlinePhone,
} from 'react-icons/hi2';

type BrandContactInfoProps = {
  brand: Brand;
};

const CONTAINER_CLASSES = 'mt-4 mb-10';
const LIST_ITEM_CLASSES = 'flex items-center gap-2 mb-2 last:mb-0';
const LINK_BASE_CLASSES =
  'link hover:text-ps-blue-600 transition-colors duration-200';

/**
 * Formats a website URL to ensure it has the proper protocol
 */
const formatWebsiteUrl = (url: string): string => {
  if (!url) return '';
  const trimmedUrl = url.trim();
  return /^(https?:\/\/)/i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;
};

/**
 * Validates contact information
 */
const isValidContact = (value?: string): boolean => {
  return Boolean(value?.trim());
};

/**
 * BrandContactInfo component displays contact information for a brand
 */
const BrandContactInfo: FC<BrandContactInfoProps> = memo(({brand}) => {
  const {t} = useTranslation('common');
  const {phone, email, website} = brand ?? {};

  const contactItems: ContactItem[] = useMemo(() => {
    const items: ContactItem[] = [
      {
        value: phone,
        icon: <HiOutlinePhone className="w-5 h-5" aria-hidden="true" />,
        href: `tel:${phone}`,
        itemProp: 'telephone',
        label: t('product.callPhoneNumber'),
      },
      {
        value: email,
        icon: <HiOutlineEnvelope className="w-5 h-5" aria-hidden="true" />,
        href: `mailto:${email}`,
        itemProp: 'email',
        label: t('product.sendEmail'),
      },
      {
        value: website,
        icon: <HiOutlineGlobeAlt className="w-5 h-5" aria-hidden="true" />,
        href: formatWebsiteUrl(website ?? ''),
        itemProp: 'url',
        label: t('product.visitWebsite'),
      },
    ];

    return items.filter(item => isValidContact(item.value));
  }, [phone, email, website, t]);

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <Container className={CONTAINER_CLASSES}>
      <ol className="space-y-2">
        {contactItems.map(({itemProp, icon, href, value, label}) => (
          <li key={itemProp} itemProp={itemProp} className={LIST_ITEM_CLASSES}>
            {icon}
            <a
              className={LINK_BASE_CLASSES}
              href={href}
              target={itemProp === 'url' ? '_blank' : undefined}
              rel={itemProp === 'url' ? 'noopener noreferrer' : undefined}
              aria-label={label}
            >
              <span className="break-all">{value}</span>
            </a>
          </li>
        ))}
      </ol>
    </Container>
  );
});

BrandContactInfo.displayName = 'BrandContactInfo';

export default BrandContactInfo;
