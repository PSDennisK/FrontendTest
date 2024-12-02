'use client';

import {getConsentStatus} from '@/lib/consent';
import Script from 'next/script';
import {useEffect, useRef} from 'react';

interface Props {
  gtmId: string;
}

export default function GoogleTagManager({gtmId}: Props) {
  const hasConsent = getConsentStatus();
  const noscriptRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (hasConsent) {
      // Update dataLayer when consent changes
      if (window.dataLayer) {
        window.dataLayer.push({
          event: 'consent_updated',
          analytics_consent: true,
        });
      }

      // Add noscript iframe
      if (!noscriptRef.current) {
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.appendChild(noscript);
        noscriptRef.current = noscript;
      }

      // Cleanup
      return () => {
        if (
          noscriptRef.current &&
          document.body.contains(noscriptRef.current)
        ) {
          document.body.removeChild(noscriptRef.current);
          noscriptRef.current = null;
        }
      };
    }
  }, [hasConsent, gtmId]);

  if (!hasConsent) return null;

  return (
    <Script id="gtm-script" strategy="afterInteractive">
      {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `}
    </Script>
  );
}
