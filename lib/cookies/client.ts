import Cookies from 'js-cookie';

export type CookieGetter = () => {
  get: (name: string) => {value: string} | undefined;
};

export type CookieSetter = () => {
  set: (
    name: string,
    value: string,
    options?: {
      path?: string;
      maxAge?: number;
    },
  ) => void;
};

export const clientCookieGetter: CookieGetter = () => ({
  get: (name: string) => {
    const value = Cookies.get(name);
    return value ? {value} : undefined;
  },
});

export const clientCookieSetter: CookieSetter = () => ({
  set: (name: string, value: string, options?) => {
    const jsOptions = options
      ? {
          ...options,
          expires: options.maxAge ? options.maxAge / (60 * 60 * 24) : undefined,
        }
      : undefined;

    Cookies.set(name, value, jsOptions);
  },
});
