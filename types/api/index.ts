import {SearchParams} from '@/types';

export type FetchApiOptions = {
  uFetch?: string;
  filter?: string;
  sort?: string;
  take?: number;
  skip?: number;
  expand?: string;
  fields?: string;
  preview?: boolean;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: string;
  revalidate?: number;
  locale?: string;
  formid?: string;
};

export type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: SearchParams | Record<string, any> | string;
  revalidate?: number;
};

export type ProxyRequestOptions = {
  method: string;
  headers?: Record<string, string>;
  body?: string;
};
