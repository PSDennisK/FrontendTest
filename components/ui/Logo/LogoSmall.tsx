'use client';

import {Container} from '@/components/ui/Layout';
import {LocaleTypes, useTranslation} from '@/i18n';
import logo from '@/public/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';

const LogoSmall = () => {
  let locale = useParams()?.locale as LocaleTypes;
  const {t} = useTranslation(locale, 'common');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container className="flex h-auto">
      <Link
        href={`/${locale}`}
        aria-label={t('common.goToHome')}
        title={t('common.goToHome')}
      >
        <span className="sr-only">{t('common.foodbookByPsInFoodservice')}</span>
        <Image
          id="logo"
          src={logo}
          alt={t('common.foodbookByPsInFoodservice')}
          className="transition-all duration-300 ease-in-out py-2 w-46 h-46"
          width={46}
          height={46}
          priority={true}
        />
      </Link>
    </Container>
  );
};

export default LogoSmall;
