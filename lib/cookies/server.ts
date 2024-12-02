import {cookies} from 'next/headers';
import type {CookieGetter, CookieSetter} from './client';

export const serverCookieGetter: CookieGetter = () => ({
  get: (name: string) => {
    const cookieStore = cookies();
    const cookie = cookieStore.get(name);
    return cookie ? {value: cookie.value} : undefined;
  },
});

type CookieOptions = {
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
};

export const serverCookieSetter: CookieSetter = () => ({
  set: (name: string, value: string, options = {}) => {
    const cookieStore = cookies();
    cookieStore.set(name, value, options);
  },
});

export function setCookie(
  name: string,
  value: string,
  options: Partial<CookieOptions> = {},
) {
  const defaultOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60,
    sameSite: 'strict',
    path: '/',
  };

  const cookieStore = cookies();
  try {
    cookieStore.set(name, value, {...defaultOptions, ...options});
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
}

export function getCookie(name: string): string | undefined {
  const cookieStore = cookies();
  const cookie = cookieStore.get(name);
  return cookie?.value;
}

export function deleteCookie(name: string) {
  const cookieStore = cookies();
  cookieStore.delete(name);
}
