import {NextRequest, NextResponse} from 'next/server';

interface UmbracoFormData {
  values: {
    [key: string]: string | string[];
  };
  formId: string;
  reCaptchaToken: string;
  culture: string;
}

export async function POST(request: NextRequest) {
  try {
    //const formid = '69c8e60c-5a71-4b7c-8457-1b933eaef624';
    const body: UmbracoFormData = await request.json();
    const {formId, reCaptchaToken, ...restBody} = body;

    if (!formId) {
      return NextResponse.json(
        {error: 'Form ID (contentId) is required'},
        {status: 400},
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FORMS_DELIVERY_API_URL}/delivery/api/v1/entries/${formId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.NEXT_PUBLIC_FORMS_DELIVERY_API_KEY,
        },
        body: JSON.stringify(restBody),
      },
    );

    if (!response.ok) {
      throw new Error(`Umbraco API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {status: response.status});
  } catch (error) {
    console.error('Error in umbraco-form-proxy:', error);
    return NextResponse.json(
      {
        error: 'Error submitting form',
        details: error instanceof Error ? error.message : String(error),
      },
      {status: 500},
    );
  }
}

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const formId = searchParams.get('formId');
  const culture = searchParams.get('culture');

  if (!formId) {
    return NextResponse.json({error: 'Missing formId'}, {status: 400});
  }

  const url = `${process.env.NEXT_PUBLIC_FORMS_DELIVERY_API_URL}/delivery/api/v1/definitions/${formId}?culture=${culture}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        revalidate: process.env.NEXT_PUBLIC_REVALIDATE,
        'Api-Key': process.env.NEXT_PUBLIC_FORMS_DELIVERY_API_KEY,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Full response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText,
      });

      return NextResponse.json(
        {error: 'External API error', details: errorText},
        {status: response.status},
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {status: 200});
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      {error: 'Internal Server Error', message: error.message},
      {status: 500},
    );
  }
}
