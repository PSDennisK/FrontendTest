import PageFooter from '@/components/common/layout/Footer';
import PageHeader from '@/components/common/layout/Header';
import {Culture} from '@/types';
import React from 'react';

type LocaleParam = {
  locale: keyof typeof Culture;
};

type LayoutProps = {
  params: LocaleParam;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({children, params: {locale}}) => {
  return (
    <>
      <PageHeader locale={locale} />

      {children}

      <PageFooter locale={locale} />
    </>
  );
};

export default Layout;
