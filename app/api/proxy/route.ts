import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  return handleProxyRequest(request);
}

export async function GET(request: NextRequest) {
  return handleProxyRequest(request);
}

async function handleProxyRequest(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({error: 'No target URL provided'}, {status: 400});
  }

  // Validate the target URL
  try {
    new URL(targetUrl);
  } catch (error) {
    console.error('Invalid target URL:', targetUrl);
    return NextResponse.json({error: 'Invalid target URL'}, {status: 400});
  }

  const method = request.method;
  const headers = Object.fromEntries(request.headers);
  let body;

  if (method === 'POST') {
    body = await request.json();
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers: {
        ...headers,
        host: undefined,
        referer: undefined,
      },
      ...(body && {body: JSON.stringify(body)}),
    });

    const responseData = await response.json();
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {error: 'Internal Server Error', details: (error as Error).message},
      {status: 500},
    );
  }
}
