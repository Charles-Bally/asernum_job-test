import { create } from 'zustand'

type CacheEntry<T = unknown> = {
  value: T
  expiresAt: number
  tags?: string[]
}

type CacheState = {
  store: Map<string, CacheEntry>
  set: <T>(key: string, value: T, ttlMs: number, tags?: string[]) => void
  get: <T>(key: string) => T | undefined
  has: (key: string) => boolean
  invalidate: (key: string) => void
  invalidateByTag: (tag: string) => void
  clear: () => void
  getOrSet: <T>(key: string, fetcher: () => Promise<T>, ttlMs: number, tags?: string[]) => Promise<T>
}

export const useCacheStore = create<CacheState>((set, get) => ({
  store: new Map<string, CacheEntry>(),
  set: (key, value, ttlMs, tags) => {
    const expiresAt = Date.now() + Math.max(0, ttlMs)
    const entry: CacheEntry = { value, expiresAt, tags }
    const next = new Map(get().store)
    next.set(key, entry)
    set({ store: next })
  },
  get: <T>(key: string): T | undefined => {
    const entry = get().store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      const next = new Map(get().store)
      next.delete(key)
      set({ store: next })
      return undefined
    }
    return entry.value as unknown as T
  },
  has: (key: string): boolean => {
    const entry = get().store.get(key)
    return !!entry && Date.now() <= entry.expiresAt
  },
  invalidate: (key) => {
    const next = new Map(get().store)
    next.delete(key)
    set({ store: next })
  },
  invalidateByTag: (tag) => {
    const next = new Map(get().store)
    for (const [k, v] of next.entries()) {
      if (v.tags?.includes(tag)) next.delete(k)
    }
    set({ store: next })
  },
  clear: () => set({ store: new Map() }),
  getOrSet: async <T>(key: string, fetcher: () => Promise<T>, ttlMs: number, tags?: string[]): Promise<T> => {
    const current = get().get<T>(key)
    if (current !== undefined) return current
    const value = await fetcher()
    get().set(key, value, ttlMs, tags)
    return value
  },
}))

export const cacheService = {
  set<T>(key: string, value: T, ttlMs: number, tags?: string[]) {
    useCacheStore.getState().set(key, value, ttlMs, tags)
  },
  get<T>(key: string): T | undefined {
    return useCacheStore.getState().get<T>(key)
  },
  has(key: string): boolean {
    return useCacheStore.getState().has(key)
  },
  invalidate(key: string) {
    useCacheStore.getState().invalidate(key)
  },
  invalidateByTag(tag: string) {
    useCacheStore.getState().invalidateByTag(tag)
  },
  clear() {
    useCacheStore.getState().clear()
  },
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlMs: number, tags?: string[]): Promise<T> {
    return useCacheStore.getState().getOrSet<T>(key, fetcher, ttlMs, tags)
  },
}


