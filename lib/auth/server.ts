import {validateToken} from '@/lib/auth/client';
import {getPsFoodbookTokenCookieName} from '@/utils/helpers';
import {cookies} from 'next/headers';

export const getServerAuthStatus = async () => {
  const cookieStore = cookies();
  const cookieName = getPsFoodbookTokenCookieName();
  const token = cookieStore.get(cookieName);

  if (!token?.value) {
    return {
      isAuthenticated: false,
      userName: null,
      token: null,
    };
  }

  const {isValid, payload} = await validateToken(token.value);

  return {
    isAuthenticated: isValid,
    userName: isValid ? payload?.displayname : null,
    token: isValid ? token.value : null,
  };
};
