import {Layout} from '@/components/ui/Layout';

import {initializeAuth} from '@/components/features/auth/AuthInitializer';
import CookieConsent from '@/components/ui/CookieConsent';
import {ProgressBar} from '@/components/ui/ProgressBar';
import {locales} from '@/i18n';
import {Culture} from '@/types';
import {Inter} from 'next/font/google';
import {headers} from 'next/headers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export async function generateStaticParams() {
  return locales.map(locale => ({locale}));
}

export default async function RootLayout({
  children,
  params: {locale},
}: {
  children: React.ReactNode;
  params: {locale: keyof typeof Culture};
}) {
  await initializeAuth();

  const headersList = headers();
  const pathname = headersList.get('x-invoke-path') || '';

  return (
    <Layout
      locale={locale}
      className={`${inter.className} overflow-x-hidden text-md antialiased dark:bg-slate-900 dark:text-slate-300 ${pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/` ? 'home' : ''}`}
    >
      <ProgressBar />
      {children}
      <CookieConsent />
    </Layout>
  );
}
