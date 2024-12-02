'use client';

import {LocaleTypes, useTranslation} from '@/i18n';
import logo from '@/public/images/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useEffect, useState} from 'react';

const Logo = () => {
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
    <Link
      href={`/${locale}`}
      aria-label={t('common.goToHome')}
      title={t('common.goToHome')}
      className="flex items-center z-20"
    >
      <span className="sr-only">{t('common.foodbookByPsInFoodservice')}</span>
      <Image
        id="logo"
        src={logo}
        alt={t('common.foodbookByPsInFoodservice')}
        //className="h-10 w-auto md:h-12 md:w-auto" // Match height with menu button
        className={`h-10 w-auto transition-all duration-300 ease-in-out self-center ${
          isScrolled ? 'md:w-28 md:h-auto' : 'md:w-28 home:md:w-36 md:h-auto'
        }`}
        width={146}
        height={48}
        priority={true}
      />
    </Link>
  );
};

export default Logo;
