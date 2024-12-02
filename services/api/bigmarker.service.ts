import {apiHandler} from '@/lib/api/bigmarker';
import {Bigmarker} from '@/types';

interface CacheItem {
  data: Bigmarker;
  timestamp: number;
}

const cache: {[key: string]: CacheItem} = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export class BigMarkerService {
  getConferences = async (): Promise<Bigmarker> => {
    try {
      return await apiHandler('CONFERENCE.LIST', {per_page: '2'});
    } catch (error) {
      console.error('Error in fetchConferences:', error);
      throw error;
    }
  };

  getConferencesByDateRange = async (
    startdate: Date,
    enddate: Date,
  ): Promise<Bigmarker> => {
    let iso_startdate: number;
    let iso_enddate: number;

    try {
      if (!startdate || !enddate) {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        const lastDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
        );
        startdate = firstDayOfMonth;
        enddate = lastDayOfMonth;
      }

      iso_startdate = Math.floor(startdate.getTime() / 1000);
      iso_enddate = Math.floor(enddate.getTime() / 1000);

      const cacheKey = `${iso_startdate}-${iso_enddate}`;
      const cachedItem = cache[cacheKey];

      if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_DURATION) {
        return cachedItem.data;
      }

      const data = await apiHandler('CONFERENCE.MONTH', {
        start_time: iso_startdate.toString(),
        end_time: iso_enddate.toString(),
      });

      cache[cacheKey] = {
        data,
        timestamp: Date.now(),
      };

      return data;
    } catch (error) {
      console.error('Error in fetchEvents:', error);
      throw error;
    }
  };
}

export const bigMarkerService = new BigMarkerService();
