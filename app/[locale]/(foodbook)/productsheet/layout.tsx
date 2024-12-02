import {Container, Main} from '@/components/ui/Layout';

import PageHeaderSmall from '@/components/common/layout/Header/HeaderSmall';
import {Culture} from '@/types';

type LocaleParam = {
  locale: keyof typeof Culture;
};

type LayoutProps = {
  params: LocaleParam;
  children: React.ReactNode;
};

const Layout = ({children, params: {locale}}: LayoutProps) => {
  return (
    <>
      <PageHeaderSmall locale={locale} />
      <Container className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 print:pt-12">
        <Container className="px-2 pt-2 sm:px-4 lg:px-6">
          <Main className="flex pb-16 pt-7 lg:pt-7 lg:pb-20">{children}</Main>
        </Container>
      </Container>
    </>
  );
};

export default Layout;
