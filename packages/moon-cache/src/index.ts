interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class MemoryStore {
  private store = new Map<string, CacheEntry<any>>();

  /**
   * Set a value in the cache.
   * @param key The cache key
   * @param value The value to cache
   * @param ttl Seconds to live. If undefined, it lives forever.
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl * 1000 : Infinity;
    this.store.set(key, { value, expiry });
  }

  /**
   * Get a value from the cache. Returns null if missing or expired.
   * @param key The cache key
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Delete a value from the cache.
   * @param key The cache key
   */
  delete(key: string): void {
    this.store.delete(key);
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Helper to wrap a function call with caching.
   */
  async remember<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }
}

export const cache = new MemoryStore();
