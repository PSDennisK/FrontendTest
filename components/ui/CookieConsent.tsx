'use client';

import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Trans, useTranslation} from 'react-i18next';

export default function CookieConsent() {
  const {t} = useTranslation('common');
  const [showConsent, setShowConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('analytics', 'true');
    //localStorage.setItem('marketing', 'true'); only in case of Adwords or similar
    setShowConsent(false);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'consent_updated',
        analytics_consent: true,
      });
    }

    router.refresh();
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('analytics', 'false');
    //localStorage.setItem('marketing', 'false'); only in case of Adwords or similar
    setShowConsent(false);

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'consent_updated',
        analytics_consent: false,
      });
    }

    router.refresh();
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white rounded-lg shadow-xl p-6 animate-fade-up max-w-md">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t('cookieConsent.title')}</h2>
        <p className="text-sm text-gray-600">
          {t('cookieConsent.description')}
        </p>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-ps-blue-600 hover:underline"
        >
          {showDetails
            ? t('cookieConsent.hideDetails')
            : t('cookieConsent.showDetails')}
        </button>

        {showDetails && (
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold">
                {t('cookieConsent.functionalCookies')}
              </h3>
              <p>{t('cookieConsent.functionalCookiesDescription')}</p>
              <p className="text-xs mt-1">
                {t('cookieConsent.functionalCookiesLifetime')}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                {t('cookieConsent.functionalCookies')}
              </h3>
              <p>{t('cookieConsent.analyticalCookiesDescription')}</p>
              <p className="text-xs mt-1">
                {t('cookieConsent.analyticalCookiesLifetime')}
              </p>
              <p className="text-xs">
                {t('cookieConsent.analyticalCookiesUsage')}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAcceptNecessary}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
          >
            {t('cookieConsent.acceptNecessary')}
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-2 bg-ps-blue-600 text-white rounded hover:bg-ps-blue-700 transition-colors text-sm"
          >
            {t('cookieConsent.acceptAll')}
          </button>
        </div>

        <p className="text-xs text-gray-500">
          <Trans i18nKey="cookieConsent.disclaimer">
            Voor meer informatie, zie onze
            <a
              href={process.env.NEXT_PUBLIC_PRIVACY_URL}
              className="text-ps-blue-600 hover:underline"
              target="_blank"
            >
              privacyverklaring
            </a>
          </Trans>
          .
        </p>
      </div>
    </div>
  );
}
