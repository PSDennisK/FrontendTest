import {validateToken} from '@/lib/auth/client';
import {getPsFoodbookTokenCookieName} from '@/utils/helpers';
import {cookies} from 'next/headers';
import {NextResponse} from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const cookieName = getPsFoodbookTokenCookieName();
  const token = cookieStore.get(cookieName);

  if (!token?.value) {
    return NextResponse.json({
      isAuthenticated: false,
      userId: null,
      userName: null,
      displayName: null,
      relationId: null,
      relationName: null,
      token: null,
      role: null,
    });
  }

  const {isValid, payload} = await validateToken(token.value);

  return NextResponse.json({
    isAuthenticated: isValid,
    userId: isValid ? payload?.userid : null,
    userName: isValid ? payload?.username : null,
    displayName: isValid ? payload?.displayname : null,
    relationId: isValid ? payload?.relationid : null,
    relationName: isValid ? payload?.relationname : null,
    token: isValid ? token.value : null,
    role: isValid ? payload?.role : null,
  });
}
