import HeaderSmallClient from '@/components/common/layout/Header/HeaderSmallClient';
import {Culture} from '@/types';
import {FC} from 'react';

type PageHeaderSmallProps = {
  locale: keyof typeof Culture;
};

const PageHeaderSmall: FC<PageHeaderSmallProps> = async ({locale}) => {
  try {
    return <HeaderSmallClient locale={locale} />;
  } catch (error) {
    console.error('Failed to initialize small header:', error);
    return null;
  }
};

export default PageHeaderSmall;
