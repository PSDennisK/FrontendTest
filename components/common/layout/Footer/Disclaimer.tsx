'use client';

import {Container} from '@/components/ui/Layout';
import {Culture} from '@/types';
import Link from 'next/link';
import {type FC, type PropsWithChildren} from 'react';
import {useTranslation} from 'react-i18next';

interface ExternalLinkProps extends PropsWithChildren {
  href: string;
  className?: string;
}

const ExternalLink: FC<ExternalLinkProps> = ({href, className, children}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`link ${className ?? ''}`}
  >
    {children}
  </Link>
);

interface DisclaimerProps {
  locale: keyof typeof Culture;
}

/**
 * Disclaimer component that displays legal information and external links
 * @param locale - The current locale used for translations and URL construction
 */
const Disclaimer: FC<DisclaimerProps> = ({locale}) => {
  const {t} = useTranslation('common');

  const PS_URL = `https://psinfoodservice.com/${locale}/`;
  const DISCLAIMER_URL =
    'https://permalink.psinfoodservice.nl/prod/documents/standards/DisclaimerEN.pdf';

  return (
    <Container className="space-y-2 text-xs">
      <p>
        {t('product.disclaimer.part1')}{' '}
        <ExternalLink href={PS_URL}>{t('common.psInFoodService')}</ExternalLink>
        .
      </p>
      <p>
        {t('product.disclaimer.part2')}{' '}
        <ExternalLink href={DISCLAIMER_URL} className="ml-1">
          {t('common.disclaimer')}
        </ExternalLink>
      </p>
    </Container>
  );
};

export default Disclaimer;
