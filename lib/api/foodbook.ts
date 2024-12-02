import FOODBOOK_CONFIG from '@/app/constants/foodbook';
import {checkAuthStatus} from '@/lib/auth/';
import {RequestInit} from 'next/dist/server/web/spec-extension/request';

export interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  body?: any;
}

export const getEndpointUrl = (
  endpointName: string,
  parameters: Record<string, string> = {},
): string => {
  const [categoryName, actionName] = endpointName.split('.');
  const {BASE_URL, ENDPOINTS} = FOODBOOK_CONFIG;
  const category = ENDPOINTS[categoryName];
  const action = category?.[actionName];

  if (!action) {
    throw new Error(`Invalid endpoint: ${endpointName}`);
  }

  let url = `${BASE_URL}${action}`;
  Object.entries(parameters).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });

  return url;
};

export const apiHandler = async (
  endpoint: string,
  params: Record<string, string> = {},
  options: RequestOptions = {},
): Promise<any> => {
  const url = getEndpointUrl(endpoint, params);
  const method = options.method || 'GET';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (method === 'POST' && options.body) {
    requestOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API error:', {
        status: response.status,
        body: errorBody,
      });
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody}`,
      );
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Handler error:', error);
    throw error;
  }
};

export const imageHandler = async (
  endpoint: string,
  params: Record<string, string> = {},
  options: RequestOptions = {},
): Promise<any> => {
  const url = getEndpointUrl(endpoint, params);
  const method = options.method || 'GET';

  const {authToken} = await checkAuthStatus();

  const requestHeaders: Record<string, string> = {
    Accept: 'image/png',
  };

  if (authToken) {
    requestHeaders.Authorization = `Bearer ${authToken}`;
  }

  const headers = {
    ...requestHeaders,
    ...(options.headers || {}),
  };

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  try {
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Image request error:', {
        status: response.status,
        body: errorBody,
        responseHeaders: Object.fromEntries(response.headers.entries()),
      });
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody}`,
      );
    }

    const blob = await response.blob();

    return blob;
  } catch (error) {
    console.error('Image Handler error:', error);
    throw error;
  }
};
