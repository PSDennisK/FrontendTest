'use client';

import {Container} from '@/components/ui/Layout';
import {Labelcontact} from '@/types';
import Link from 'next/link';
import {cloneElement, FC, memo, ReactElement, ReactNode} from 'react';
import {useTranslation} from 'react-i18next';
import {
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlinePhone,
} from 'react-icons/hi2';

const CLASSES = {
  container: 'mb-8 lg:mb-10 xl:mb-12',
  title: 'text-xl font-semibold leading-6 mb-4',
  content: 'print:text-sm',
  address: 'mb-5',
  link: 'flex items-center',
  linkText: 'link ml-3',
} as const;

type ContactLinkProps = {
  href: string;
  icon: ReactElement;
  children: ReactNode;
  label: string;
};

type ContactDetailsProps = {
  contact: Labelcontact;
};

const ContactLink: FC<ContactLinkProps> = memo(
  ({href, icon, children, label}) => (
    <p className={CLASSES.link}>
      {cloneElement(icon, {'aria-hidden': 'true'})}
      <Link className={CLASSES.linkText} href={href} aria-label={label}>
        {children}
      </Link>
    </p>
  ),
);

const ContactDetails: FC<ContactDetailsProps> = memo(({contact}) => {
  const {t} = useTranslation('common');

  if (!contact) return null;

  const channelInfo =
    contact.labelcontactcommunicationchannelinfolist
      ?.labelcontactcommunicationchannelinfo;
  const {labelcontacttypename, website, emailaddress, phonenumber} =
    channelInfo || {};

  const contactLinks = [
    {
      condition: website,
      href: /^(https?:\/\/)/i.test(website ?? '')
        ? website
        : `https://${website?.trim()}`,
      icon: <HiOutlineGlobeAlt />,
      content: website,
      label: t('product.visitWebsite'),
    },
    {
      condition: emailaddress,
      href: `mailto:${emailaddress}`,
      icon: <HiOutlineEnvelope />,
      content: emailaddress,
      label: t('product.sendEmail'),
    },
    {
      condition: phonenumber,
      href: `tel:${phonenumber}`,
      icon: <HiOutlinePhone />,
      content: phonenumber,
      label: t('product.callPhoneNumber'),
    },
  ] as const;

  return (
    <Container id="contactinfo" className={CLASSES.container}>
      <h2 className={CLASSES.title}>{t('product.contactDetails')}</h2>

      <Container className={CLASSES.content}>
        {contact.name && <strong>{contact.name}</strong>}

        {contact.communicationaddress && (
          <p className={CLASSES.address}>{contact.communicationaddress}</p>
        )}

        {labelcontacttypename?.value && (
          <strong>{labelcontacttypename.value}:</strong>
        )}

        {contactLinks.map(
          (link, index) =>
            link.condition && (
              <ContactLink
                key={index}
                href={link.href}
                icon={link.icon}
                label={link.label}
              >
                {link.content}
              </ContactLink>
            ),
        )}
      </Container>
    </Container>
  );
});

ContactLink.displayName = 'ContactLink';
ContactDetails.displayName = 'ContactDetails';

export default ContactDetails;
