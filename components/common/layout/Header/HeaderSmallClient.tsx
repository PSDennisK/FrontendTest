'use client';

import LanguageSwitcher from '@/components/common/layout/Header/LanguageSwitcher';
import {Container, Header} from '@/components/ui/Layout';
import LogoSmall from '@/components/ui/Logo/LogoSmall';
import {useTranslation} from '@/i18n/client';
import {getConsentTypes} from '@/lib/consent';
import {pushToDataLayer} from '@/lib/gtm';
import {Culture} from '@/types';
import {FC, useEffect, useState} from 'react';
import {HiOutlineDownload} from 'react-icons/hi';

type HeaderSmallClientProps = {
  locale: keyof typeof Culture;
};

const HEADER_CLASSES =
  'w-full fixed h-16 antialiased bg-ps-blue-100 lg:px-6 z-30 print:relative';
const NAV_CLASSES =
  'relative flex flex-wrap items-center justify-between w-full mx-auto';

const HeaderSmallClient: FC<HeaderSmallClientProps> = ({locale}) => {
  const {t} = useTranslation(locale, 'common');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  }, []);

  const handleDownloadPdfClick = () => {
    const {functional, analytics} = getConsentTypes();

    // Download - always when functional consent
    if (functional) {
      window.print();
    }

    // Analytics tracking - only when analytics consent
    if (analytics) {
      try {
        const eventData = {
          event: 'download_productsheet',
          eventCategory: 'Document',
          eventAction: 'Download PDF Click',
          eventLabel: t('productsheet.pageTitle'),
          userid: userData?.userId || 'unknown',
          username: userData?.userName || 'unknown',
          relationid: userData?.relationId || 'unknown',
          relationname: userData?.relationName || 'unknown',
          locale: locale,
          timestamp: new Date().toISOString(),
        };

        pushToDataLayer(eventData);
      } catch (error) {
        console.error('Failed to push to dataLayer:', error);
      }
    }
  };

  return (
    <>
      <Header className={HEADER_CLASSES} id="header">
        <Container className="mx-auto max-w-7xl">
          <nav className={NAV_CLASSES}>
            <Container className="relative flex flex-wrap items-center justify-between w-full mx-auto">
              <Container className="flex w-3/4 py-4 md:py-0 items-center">
                <LogoSmall />
                <Container className="flex items-center ml-4">
                  <h1 className="text-lg font-semibold text-ps-blue-700">
                    {t('productsheet.pageTitle')}
                  </h1>
                </Container>
              </Container>

              <Container className="relative flex items-center justify-end gap-4 text-ps-blue-700">
                <div className="hidden print:block text-xs">
                  {t('common.date')}: {new Date().toLocaleDateString()}
                </div>
                <button
                  onClick={handleDownloadPdfClick}
                  className="flex items-center gap-2 print:hidden"
                  title={t('common.print')}
                >
                  <HiOutlineDownload className="h-6 w-6" />
                </button>
                <LanguageSwitcher locale={locale} />
              </Container>
            </Container>
          </nav>
        </Container>
      </Header>
    </>
  );
};

export default HeaderSmallClient;
