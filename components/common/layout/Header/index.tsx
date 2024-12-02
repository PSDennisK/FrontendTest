import HeaderClient from '@/components/common/layout/Header/HeaderClient';
import {
  getDecodedToken,
  initializeAuthStatus,
  isPsAuthPresent,
} from '@/lib/auth';
import {umbracoService} from '@/services';
import {AuthResponse, Culture} from '@/types';
import {type FC} from 'react';

type PageHeaderProps = {
  locale: keyof typeof Culture;
};

/**
 * Fetches registration page URL from Umbraco
 */
async function fetchRegisterUrl(locale: keyof typeof Culture): Promise<string> {
  const registerId = process.env.NEXT_PUBLIC_REGISTER_ID;

  if (!registerId) {
    return '';
  }

  try {
    const page = await umbracoService.fetchPageBySlug(registerId, locale);
    return page?.route?.path ?? '';
  } catch (error) {
    console.error('Failed to fetch register page:', error);
    return '';
  }
}

/**
 * Gets user authentication data
 */
async function getUserAuthData(): Promise<AuthResponse> {
  await initializeAuthStatus();
  const isAuthenticated = isPsAuthPresent();
  const userData = getDecodedToken();

  return {
    isAuthenticated,
    displayName: userData?.displayname,
    role: userData?.role,
  };
}

/**
 * Server Component that handles header data fetching and initialization
 * Passes data to the client-side HeaderClient component
 */
const PageHeader: FC<PageHeaderProps> = async ({locale}) => {
  try {
    // Parallel data fetching
    const [menuItems, registerUrl, userData] = await Promise.all([
      umbracoService.fetchMenuItems(locale),
      fetchRegisterUrl(locale),
      getUserAuthData(),
    ]);

    if (!menuItems) {
      console.error('Failed to fetch menu items');
      return null;
    }

    return (
      <HeaderClient
        locale={locale}
        menuItems={menuItems}
        registerUrl={registerUrl}
        initialIsAuthenticated={userData.isAuthenticated}
        initialDisplayName={userData.displayName}
        initialRole={userData.role}
      />
    );
  } catch (error) {
    console.error('Failed to initialize header:', error);
    return null;
  }
};

export default PageHeader;
