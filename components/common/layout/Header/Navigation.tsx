//import DarkmodeSwitcher from '@/components/common/layout/Header/DarkmodeSwitcher';
import LanguageSwitcher from '@/components/common/layout/Header/LanguageSwitcher';
import {LoginClient} from '@/components/common/layout/Header/LoginClient';
import {Container} from '@/components/ui/Layout';
import {Culture, Umbraco} from '@/types';
import Link from 'next/link';
import {type FC, memo} from 'react';

type MenuItemProps = {
  menuitem: Umbraco;
  onItemClick?: () => void;
};

interface NavigationProps {
  locale: keyof typeof Culture;
  menuItems: Umbraco[];
  registerUrl: string;
  initialIsAuthenticated: boolean;
  initialDisplayName?: string;
  initialRole?: string[];
}

const MENU_ITEM_CLASSES = `
  block py-2 px-3 font-semibold text-ps-blue-900 rounded 
  md:hover:text-ps-blue-600 md:p-0 
  md:dark:hover:text-ps-blue-500 
  dark:text-white dark:hover:bg-gray-700 
  dark:hover:text-white md:dark:hover:bg-transparent 
  dark:border-gray-700
`;

const MenuItem: FC<MenuItemProps> = memo(
  ({menuitem, onItemClick}) => {
    if (!menuitem?.id || !menuitem?.name) {
      return null;
    }

    return (
      <li className="md:last:mr-5">
        <Link
          href={menuitem.route?.path ?? '#'}
          itemProp="url"
          onClick={onItemClick}
          className={MENU_ITEM_CLASSES}
        >
          {menuitem.name}
        </Link>
      </li>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.menuitem.id === nextProps.menuitem.id &&
      prevProps.menuitem.name === nextProps.menuitem.name &&
      prevProps.menuitem.route?.path === nextProps.menuitem.route?.path
    );
  },
);

MenuItem.displayName = 'MenuItem';

interface MainNavigationProps {
  menuItems: Umbraco[];
}

const MainNavigation: FC<MainNavigationProps> = memo(
  ({menuItems}) => {
    if (!menuItems?.length) {
      return null;
    }

    return (
      <ul className="flex items-center space-x-8" role="menubar">
        {menuItems.map(item => (
          <MenuItem key={item.id} menuitem={item} />
        ))}
      </ul>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.menuItems.length !== nextProps.menuItems.length) {
      return false;
    }

    return prevProps.menuItems.every((item, index) => {
      const nextItem = nextProps.menuItems[index];
      return (
        item.id === nextItem.id &&
        item.name === nextItem.name &&
        item.route?.path === nextItem.route?.path
      );
    });
  },
);

MainNavigation.displayName = 'MainNavigation';

type NavControlsProps = Omit<NavigationProps, 'menuItems'>;

const NavControls: FC<NavControlsProps> = memo(
  ({
    locale,
    registerUrl,
    initialIsAuthenticated,
    initialDisplayName,
    initialRole,
  }) => (
    <Container className="relative flex items-center gap-4">
      {/* Darkmode Switcher */}
      {/* <DarkmodeSwitcher /> */}

      {/* Language Switcher */}
      <LanguageSwitcher locale={locale} />

      {/* Login and Logout */}
      <LoginClient
        registerUrl={registerUrl}
        initialIsAuthenticated={initialIsAuthenticated}
        initialDisplayName={initialDisplayName}
        initialRole={initialRole}
      />
    </Container>
  ),
);

NavControls.displayName = 'NavControls';

const Navigation: FC<NavigationProps> = memo(
  ({
    locale,
    menuItems,
    registerUrl,
    initialIsAuthenticated,
    initialDisplayName,
    initialRole,
  }) => (
    <Container
      id="main-menu"
      className="hidden items-baseline gap-8 md:flex"
      itemType="http://schema.org/SiteNavigationElement"
      role="navigation"
      aria-label="Main navigation"
    >
      <MainNavigation menuItems={menuItems} />

      <NavControls
        locale={locale}
        registerUrl={registerUrl}
        initialIsAuthenticated={initialIsAuthenticated}
        initialDisplayName={initialDisplayName}
        initialRole={initialRole}
      />
    </Container>
  ),
  (prevProps, nextProps) => {
    const basicPropsEqual =
      prevProps.locale === nextProps.locale &&
      prevProps.registerUrl === nextProps.registerUrl &&
      prevProps.initialIsAuthenticated === nextProps.initialIsAuthenticated &&
      prevProps.initialDisplayName === nextProps.initialDisplayName;

    const roleArrayEqual =
      Array.isArray(prevProps.initialRole) &&
      Array.isArray(nextProps.initialRole)
        ? prevProps.initialRole.every(
            (role, index) => role === nextProps.initialRole?.[index],
          )
        : prevProps.initialRole === nextProps.initialRole;

    const menuItemsEqual =
      prevProps.menuItems.length === nextProps.menuItems.length &&
      prevProps.menuItems.every((item, index) => {
        const nextItem = nextProps.menuItems[index];
        return (
          item.id === nextItem.id &&
          item.name === nextItem.name &&
          item.route?.path === nextItem.route?.path
        );
      });

    return basicPropsEqual && roleArrayEqual && menuItemsEqual;
  },
);

Navigation.displayName = 'Navigation';

export {MenuItem, Navigation};
