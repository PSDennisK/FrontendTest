import {Container} from '@/components/ui/Layout';

import Breadcrumbs from '@/components/common/layout/BreadCrumbs';
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

      <Container className="max-w-7xl mx-auto pt-40 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          separator={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-3 h-3 ml-2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          }
          activeClasses="text-ps-blue-400"
          capitalizeLinks
          locale={locale}
        />

        {children}
      </Container>

      <PageFooter locale={locale} />
    </>
  );
};

export default Layout;
