import BIGMARKER_CONFIG from '@/app/constants/bigmarker';
import {ProxyRequestOptions, RequestOptions} from '@/types';

export const getEndpointUrl = (
  endpoint: string,
  params: Record<string, string> = {},
): string => {
  try {
    const [category, action] = endpoint.split('.');
    if (
      !BIGMARKER_CONFIG.ENDPOINTS[category] ||
      !BIGMARKER_CONFIG.ENDPOINTS[category][action]
    ) {
      throw new Error(`Invalid endpoint: ${endpoint}`);
    }

    let url = `${BIGMARKER_CONFIG.BASE_URL}${BIGMARKER_CONFIG.ENDPOINTS[category][action]}`;
    Object.entries(params).forEach(([key, value]) => {
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
  params: Record<string, string> = {},
  options: RequestOptions = {},
): Promise<any> => {
  const url = getEndpointUrl(endpoint, params);
  const method = options.method || 'GET';

  // Ensure the URL is valid
  try {
    new URL(url);
  } catch (error) {
    console.error('Invalid URL:', url);
    throw new Error(`Invalid URL: ${url}`);
  }

  // Construct the proxy URL
  const proxyUrlObj = new URL(
    '/api/proxy',
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  );
  proxyUrlObj.searchParams.set('url', url);
  const proxyUrl = proxyUrlObj.toString();

  const proxyOptions: ProxyRequestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      'API-KEY': BIGMARKER_CONFIG.API_KEY,
    },
  };

  if (method === 'POST' && options.body) {
    proxyOptions.body = JSON.stringify(options.body);
  }

  try {
    const proxyResponse = await fetch(proxyUrl.toString(), proxyOptions);

    if (!proxyResponse.ok) {
      const errorBody = await proxyResponse.text();
      console.error('Error response body:', errorBody);
      throw new Error(
        `HTTP error! status: ${proxyResponse.status}, message: ${errorBody}`,
      );
    }

    const responseData = await proxyResponse.json();
    return responseData;
  } catch (error) {
    console.error('Error in apiHandler:', error);
    throw error;
  }
};
