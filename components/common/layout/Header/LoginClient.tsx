'use client';

import {useInitializeAuth} from '@/app/hooks/useInitializeAuth';
import {Container} from '@/components/ui/Layout';
import {setReturnUrlCookie} from '@/lib/auth/client';
import {AuthResponse} from '@/types';
import Link from 'next/link';
import {type FC, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FaArrowRightFromBracket, FaChevronDown} from 'react-icons/fa6';

type LoginClientProps = {
  initialIsAuthenticated: boolean;
  initialDisplayName?: string;
  initialUserName?: string;
  registerUrl: string;
  initialRole?: string[];
};

const MENU_LINK_CLASSES = `
  inline-flex w-full items-center whitespace-nowrap bg-transparent px-3 py-3 
  text-sm font-normal text-neutral-700 hover:bg-neutral-100 
  active:text-neutral-800 active:no-underline 
  disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 
  dark:text-neutral-200 dark:hover:bg-neutral-600 print:hidden
`;

const DROPDOWN_MENU_CLASSES = `
  absolute z-40 float-left left-0 top-4 md:top-6 m-0 mt-2 
  min-w-max list-none overflow-hidden border-none bg-neutral-50 
  text-left text-base shadow-lg dark:bg-neutral-700
`;

const REGISTER_BUTTON_CLASSES = `
  block max-w-60 mx-auto md:m-0 md:max-w-full text-center md:text-left 
  py-2 px-3 items-center justify-center text-base leading-6 
  text-ps-blue-900 whitespace-no-wrap bg-white border border-transparent 
  rounded-full hover:bg-white focus:outline-none active:bg-ps-blue-900 
  active:text-white transition-all duration-300 ease-in-out transform 
  hover:-translate-y-1 hover:shadow-lg
`;

export const LoginClient: FC<LoginClientProps> = ({
  initialIsAuthenticated,
  initialDisplayName,
  registerUrl,
  initialRole,
}) => {
  const [authState, setAuthState] = useState<AuthResponse>({
    isAuthenticated: initialIsAuthenticated,
    displayName: initialDisplayName,
    role: initialRole,
  });
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const loginMenuRef = useRef<HTMLUListElement>(null);
  const toggleLoginRef = useRef<HTMLButtonElement>(null);
  const {t} = useTranslation('common');

  const ENV = {
    loginUrl: process.env.NEXT_PUBLIC_LOGIN_URL || '',
    logoutUrl: process.env.NEXT_PUBLIC_LOGOUT_URL || '',
    mijnPSUrl: process.env.NEXT_PUBLIC_MIJN_PS_URL || '',
    dataEntryUrl: process.env.NEXT_PUBLIC_DATA_ENTRY_URL || '',
  };

  useInitializeAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setAuthState({
          isAuthenticated: data.isAuthenticated,
          displayName: data.displayName,
          role: data.role,
        });
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthState({isAuthenticated: false});
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !loginMenuRef.current?.contains(event.target as Node) &&
        !toggleLoginRef.current?.contains(event.target as Node)
      ) {
        setIsLoginMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLoginClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (await setReturnUrlCookie()) {
      window.location.href = ENV.loginUrl;
    }
  };

  const checkRole = (roleToCheck: string): boolean => {
    if (!authState.role) return false;
    return Array.isArray(authState.role)
      ? authState.role.includes(roleToCheck)
      : authState.role === roleToCheck;
  };

  const hasMyPSAccess = checkRole('MyPS_HasAccess');
  const hasDataEntryAccess =
    checkRole('User_DataEntry_HasAccess') ||
    checkRole('Relation_DataEntry_HasAccess');
  const showDivider = hasMyPSAccess || hasDataEntryAccess;

  if (authState.isAuthenticated) {
    return (
      <Container className="relative">
        <button
          className="w-full inline-flex items-center gap-1 px-3 mr-0 font-semibold text-ps-blue-900 hover:text-ps-blue-700 md:mr-3 lg:mr-5 md:w-auto"
          ref={toggleLoginRef}
          onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
          aria-expanded={isLoginMenuOpen}
          aria-controls="login-menu"
          type="button"
        >
          <span className="flex items-center gap-1">
            {authState.displayName}
            <FaChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${
                isLoginMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>

        {isLoginMenuOpen && (
          <ul
            ref={loginMenuRef}
            id="login-menu"
            className={DROPDOWN_MENU_CLASSES}
            role="menu"
            aria-label={t('common.userMenu')}
          >
            {hasMyPSAccess && (
              <li role="menuitem">
                <Link
                  href={ENV.mijnPSUrl}
                  target="_blank"
                  title={t('common.myPS')}
                  className={MENU_LINK_CLASSES}
                >
                  {t('common.myPS')}
                </Link>
              </li>
            )}

            {hasDataEntryAccess && (
              <li role="menuitem">
                <Link
                  href={ENV.dataEntryUrl}
                  target="_blank"
                  title={t('common.dataEntry')}
                  className={MENU_LINK_CLASSES}
                >
                  {t('common.dataEntry')}
                </Link>
              </li>
            )}

            <li
              role="menuitem"
              className={
                showDivider
                  ? 'border-t border-neutral-200 dark:border-neutral-600 mt-2 pt-2'
                  : ''
              }
            >
              <Link
                href={ENV.logoutUrl}
                title={t('common.logout')}
                className={MENU_LINK_CLASSES}
              >
                <FaArrowRightFromBracket className="mr-2" aria-hidden="true" />
                {t('common.logout')}
              </Link>
            </li>
          </ul>
        )}
      </Container>
    );
  }

  return (
    <>
      <Link
        href={ENV.loginUrl}
        onClick={handleLoginClick}
        className="block py-2 px-3 text-ps-blue-900 hover:text-ps-blue-700"
      >
        {t('common.login')}
      </Link>

      <Link
        href={registerUrl}
        target="_blank"
        className={REGISTER_BUTTON_CLASSES}
      >
        {t('common.register')}
      </Link>
    </>
  );
};
