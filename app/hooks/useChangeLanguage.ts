import {fallbackLng, locales} from '@/i18n/settings';
import {umbracoService} from '@/services';
import {Culture} from '@/types';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useTranslation} from 'react-i18next';

const EXCLUDED_PATHS = ['brand', 'product'];

const createUrl = (pathname: string, searchParams: URLSearchParams): string => {
  const query = searchParams.toString();
  return pathname + (query ? `?${query}` : '');
};

const getSimpleLanguageUrl = (
  currentSlug: string,
  newLang: keyof typeof Culture,
  searchParams: URLSearchParams,
): string => {
  const newPathname =
    newLang === fallbackLng ? `/${currentSlug}` : `/${newLang}/${currentSlug}`;

  return createUrl(newPathname, searchParams);
};

export function useChangeLanguage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {i18n} = useTranslation();

  const changeLanguage = async (newLang: keyof typeof Culture) => {
    i18n.changeLanguage(newLang);

    const segments = pathname.split('/').filter(Boolean);
    const currentLang = locales.find(lang => segments[0] === lang);
    const currentSlug = currentLang
      ? segments.slice(1).join('/')
      : segments.join('/');

    // Check if the path is excluded (brand or product pages)
    const isExcludedPath = EXCLUDED_PATHS.some(path =>
      pathname.includes(`/${path}/`),
    );

    if (isExcludedPath) {
      const newUrl = getSimpleLanguageUrl(currentSlug, newLang, searchParams);
      router.push(newUrl);
      return;
    }

    try {
      const pageData = await umbracoService.fetchPageBySlug(
        currentSlug,
        newLang,
      );
      const culturePath =
        pageData.cultures?.[newLang === 'en' ? 'en-US' : newLang]?.path;

      const newPathname =
        culturePath ?? getSimpleLanguageUrl(currentSlug, newLang, searchParams);
      const newUrl = createUrl(newPathname, searchParams);

      router.push(newUrl);
    } catch (error) {
      console.error('Error fetching translated page:', error);

      // Fallback to simple language prefix change
      const fallbackUrl = getSimpleLanguageUrl(
        currentSlug,
        newLang,
        searchParams,
      );
      router.push(fallbackUrl);
    }
  };

  return changeLanguage;
}
