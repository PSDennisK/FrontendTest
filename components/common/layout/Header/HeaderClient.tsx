'use client';

import LanguageSwitcher from '@/components/common/layout/Header/LanguageSwitcher';
import {LoginClient} from '@/components/common/layout/Header/LoginClient';
import {
  MenuItem,
  Navigation,
} from '@/components/common/layout/Header/Navigation';
import SearchForm from '@/components/features/foodbook/Product/ProductSearch/SearchForm';
import {Container, Header} from '@/components/ui/Layout';
import Logo from '@/components/ui/Logo';
import {Culture, Umbraco} from '@/types';
import {useState, type FC} from 'react';
import {useTranslation} from 'react-i18next';
import {FaBars, FaPlus} from 'react-icons/fa6';

type HeaderClientProps = {
  locale: keyof typeof Culture;
  menuItems: Umbraco[];
  registerUrl: string;
  initialIsAuthenticated: boolean;
  initialDisplayName?: string;
  initialRole?: string[];
};

const HEADER_CLASSES =
  'w-full fixed h-auto px-3 antialiased bg-ps-blue-100 lg:px-6 z-30';
const NAV_CLASSES =
  'bg-ps-blue-100 border-gray-200 border-b fixed w-full z-20 top-0 start-0 dark:bg-gray-900 dark:border-gray-600';
const NAV_CONTAINER_CLASSES = 'max-w-screen-xl mx-auto p-2 md:min-h-32';
const MOBILE_BUTTON_CLASSES =
  'inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden dark:text-gray-400';
const MOBILE_MENU_BASE_CLASSES =
  'md:hidden transition-all duration-300 ease-in-out';
const MOBILE_MENU_LIST_CLASSES = 'flex flex-col space-y-4 pt-4 bg-ps-blue-100';

const HeaderClient: FC<HeaderClientProps> = ({
  locale,
  menuItems,
  registerUrl,
  initialIsAuthenticated,
  initialDisplayName,
  initialRole,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {t} = useTranslation('website');

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const getMobileMenuClasses = (isOpen: boolean) =>
    `${MOBILE_MENU_BASE_CLASSES} ${
      isOpen
        ? 'max-h-screen opacity-100 visible'
        : 'max-h-0 opacity-0 invisible'
    }`;

  const getIconClasses = (isVisible: boolean) =>
    `w-6 h-6 transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`;

  return (
    <Header className={HEADER_CLASSES} id="header">
      <Container className="mx-auto max-w-7xl">
        <nav className={NAV_CLASSES}>
          <Container className={NAV_CONTAINER_CLASSES}>
            <Container className="flex items-top justify-between">
              <Logo />

              <Navigation
                locale={locale}
                menuItems={menuItems}
                registerUrl={registerUrl}
                initialIsAuthenticated={initialIsAuthenticated}
                initialDisplayName={initialDisplayName}
                initialRole={initialRole}
              />

              <button
                type="button"
                onClick={toggleMenu}
                className={MOBILE_BUTTON_CLASSES}
                aria-controls="main-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">{t('common.openMainMenu')}</span>
                <FaBars className={getIconClasses(!isMenuOpen)} />
                <FaPlus
                  className={`${getIconClasses(isMenuOpen)} rotate-45 absolute`}
                />
              </button>
            </Container>

            <Container className="w-full md:-mt-14">
              <Container className="relative w-full mx-auto">
                <SearchForm locale={locale} isHeaderSearch={true} />
              </Container>
            </Container>

            <Container
              id="mobile-menu"
              className={getMobileMenuClasses(isMenuOpen)}
            >
              <ul className={MOBILE_MENU_LIST_CLASSES}>
                {menuItems?.map(item => (
                  <MenuItem
                    key={item.id}
                    menuitem={item}
                    onItemClick={toggleMenu}
                  />
                ))}
              </ul>

              <Container className="relative flex flex-col space-y-4 pt-4 bg-ps-blue-100">
                <LanguageSwitcher locale={locale} />
                <LoginClient
                  registerUrl={registerUrl}
                  initialIsAuthenticated={initialIsAuthenticated}
                  initialDisplayName={initialDisplayName}
                />
              </Container>
            </Container>
          </Container>
        </nav>
      </Container>
    </Header>
  );
};

export default HeaderClient;
