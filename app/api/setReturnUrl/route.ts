import {getPsReturnUrlCookieName} from '@/utils/helpers';
import {NextResponse} from 'next/server';

export async function POST(request: Request) {
  try {
    const {returnUrl} = await request.json();
    const isLocalhost = request.headers.get('host')?.includes('localhost');

    // Maak een basis cookie string
    const cookieBase = `; Path=/; Max-Age=${365 * 24 * 60 * 60}; HttpOnly; SameSite=Strict`;
    const domain = !isLocalhost ? '; Domain=.psinfoodservice.com' : '';

    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    // Voeg elke cookie apart toe
    headers.append(
      'Set-Cookie',
      `${getPsReturnUrlCookieName()}=${returnUrl}${cookieBase}${domain}`,
    );
    headers.append(
      'Set-Cookie',
      `PSReturnUrlFB=${returnUrl}${cookieBase}${domain}`,
    );

    // Maak de response met de headers
    const response = new NextResponse(JSON.stringify({success: true}), {
      status: 200,
      headers,
    });

    return response;
  } catch (error) {
    console.error('Error in setReturnUrl API:', error);
    return NextResponse.json(
      {success: false, error: error.message},
      {status: 500},
    );
  }
}
