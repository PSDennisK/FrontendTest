'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {useEffect} from 'react';

export function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({showSpinner: false, color: '#3cbeef'});
  }, []);

  useEffect(() => {
    NProgress.done();
    return () => {
      NProgress.start();
    };
  }, [pathname, searchParams]);

  return null;
}
