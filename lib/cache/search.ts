type CacheEntry = {
  data: any;
  timestamp: number;
};

type CacheData = {
  [key: string]: CacheEntry;
};

const CACHE_KEY = 'ps_search_suggestions_cache';
const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_ITEMS = 100;

export class SearchCache {
  private static memoryCache: Map<string, CacheEntry> = new Map();

  private static createCacheKey(keyword: string, locale: string): string {
    return `${locale}_${keyword}`;
  }

  private static loadFromStorage(): CacheData {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private static saveToStorage(data: CacheData) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Error saving to localStorage:', e);
      // If localStorage is full, clear the cache and try again with only the new item
      localStorage.removeItem(CACHE_KEY);
    }
  }

  private static cleanOldCache() {
    const now = Date.now();
    const storageData = this.loadFromStorage();
    let updatedData: CacheData = {};
    let entries = Object.entries(storageData);

    // Remove expired items
    entries = entries.filter(
      ([, value]) => now - value.timestamp < CACHE_EXPIRY,
    );

    // Keep only the most recent items if we go over the limit
    if (entries.length > MAX_CACHE_ITEMS) {
      entries.sort(([, a], [, b]) => b.timestamp - a.timestamp);
      entries = entries.slice(0, MAX_CACHE_ITEMS);
    }

    // Update storage
    entries.forEach(([key, value]) => {
      updatedData[key] = value;
    });

    // Update memory cache
    this.memoryCache.clear();
    entries.forEach(([key, value]) => {
      this.memoryCache.set(key, value);
    });

    this.saveToStorage(updatedData);
  }

  static get(keyword: string, locale: string): any | null {
    const cacheKey = this.createCacheKey(keyword, locale);
    const now = Date.now();

    // Check memory cache first
    const memoryItem = this.memoryCache.get(cacheKey);
    if (memoryItem && now - memoryItem.timestamp < CACHE_EXPIRY) {
      return memoryItem.data;
    }

    // Check localStorage
    const storageData = this.loadFromStorage();
    const storedItem = storageData[cacheKey];

    if (storedItem && now - storedItem.timestamp < CACHE_EXPIRY) {
      // Refresh memory cache
      this.memoryCache.set(cacheKey, storedItem);
      return storedItem.data;
    }

    return null;
  }

  static set(keyword: string, locale: string, data: any): void {
    const cacheKey = this.createCacheKey(keyword, locale);
    const cacheEntry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };

    // Update memory cache
    this.memoryCache.set(cacheKey, cacheEntry);

    // Update localStorage
    const storageData = this.loadFromStorage();
    storageData[cacheKey] = cacheEntry;
    this.saveToStorage(storageData);

    // Periodically clean old cache
    this.cleanOldCache();
  }

  static clear(): void {
    this.memoryCache.clear();
    localStorage.removeItem(CACHE_KEY);
  }
}
