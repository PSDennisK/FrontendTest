import {Conference} from '@/types';

export type Bigmarker = {
  conferences: Conference[];
  page: number;
  page_count: number;
  per_page: number;
  total_count: number;
  total_entries: number;
  total_pages: number;
};
