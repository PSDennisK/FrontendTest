import UMBRACO_CONFIG from '@/app/constants/umbraco';
import {fallbackLng} from '@/i18n';
import {FetchApiOptions} from '@/types';
import {RequestInit} from 'next/dist/server/web/spec-extension/request';

const localeMap: {[key: string]: string} = {
  en: 'en-US',
  nl: 'nl',
  de: 'de',
  fr: 'fr',
};

export const getEndpointUrl = (
  endpoint: string,
  params: Record<string, string> = {},
): string => {
  try {
    const [category, action] = endpoint.split('.');
    if (
      !UMBRACO_CONFIG.ENDPOINTS[category] ||
      !UMBRACO_CONFIG.ENDPOINTS[category][action]
    ) {
      throw new Error(`Invalid endpoint: ${endpoint}`);
    }

    let url = `${UMBRACO_CONFIG.BASE_URL}${UMBRACO_CONFIG.ENDPOINTS[category][action]}`;

    if (params.formid) {
      url = `${UMBRACO_CONFIG.FORM_URL}${UMBRACO_CONFIG.ENDPOINTS[category][action]}`;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (key === 'locale' && value === 'en') {
        value = localeMap[value];
      }
      url = url.replace(`:${key}`, encodeURIComponent(value));
    });

    return url;
  } catch (error) {
    console.error('Error in getEndpointUrl:', error);
    throw error;
  }
};

export const apiHandler = async (
  endpoint: string,
  options: FetchApiOptions = {},
  params: Record<string, string> = {},
): Promise<any> => {
  const {
    uFetch = '',
    filter = '',
    sort = '',
    take = 10,
    skip = 0,
    expand = '',
    fields = '',
    preview = false,
    method = 'GET',
    revalidate = 600,
    locale = fallbackLng,
  } = options;

  const searchParams = new URLSearchParams({
    ...(uFetch && {fetch: uFetch}),
    ...(filter && {filter: `contentType:${filter}`}),
    ...(sort && {sort}),
    ...(take > 0 && {take: take.toString()}),
    ...(skip > 0 && {skip: skip.toString()}),
    ...(expand && {expand: `properties${expand}`}),
    ...(fields && {fields: `properties${fields}`}),
  });

  const mappedLocale = localeMap[locale] || locale;

  const url = getEndpointUrl(endpoint, params);

  const apiKey = params.formid ? UMBRACO_CONFIG.FORM_API_KEY : undefined;

  const finalUrl = apiKey ? url : `${url}?${searchParams}`;

  const proxyUrl = new URL(
    '/api/proxy',
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  );
  proxyUrl.searchParams.set('url', finalUrl);

  const headers: Record<string, string> = {
    'Accept-Language': mappedLocale,
  };

  if (apiKey) {
    headers['Api-Key'] = apiKey;
  }

  if (method === 'POST' && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const proxyOptions: RequestInit = {
    method,
    headers,
    next: {revalidate},
  };

  if (method === 'POST' && options.body) {
    proxyOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(proxyUrl.toString(), proxyOptions);

  if (response.status === 204 || !response.ok) {
    console.error('HTTP error! status:', response.status);
    return null;
  }

  return await response.json();
};
