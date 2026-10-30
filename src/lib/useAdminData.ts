import { useState, useEffect, useMemo, useRef } from 'react';
import { getCollection } from '../admin/db';
import {
  fetchPublicCollectionFromSupabase,
  CollectionKey,
} from '../admin/db/supabaseService';
import {
  stats as defaultStats,
  workItems as defaultWorks,
  services as defaultServices,
  processSteps as defaultProcess,
  faqs as defaultFaqs,
  blogPosts as defaultBlogs,
  testimonials as defaultReviews,
} from './data';
import type {
  AdminSiteNumber,
  AdminWorkItem,
  AdminService,
  AdminProcessStep,
  AdminFAQ,
  AdminBlogPost,
  AdminReview,
  AdminVideoReview,
} from '../admin/types';

const DB_UPDATE_EVENT = 'primexpixel_db_updated';

// ----------------------------------------------------------------------------
// Client-Side Cache & In-Flight Request Deduplication
// ----------------------------------------------------------------------------
interface CacheEntry {
  data: any[];
  timestamp: number;
}

const memoryCache: Partial<Record<CollectionKey, CacheEntry>> = {};
const inFlightRequests = new Map<CollectionKey, Promise<any[]>>();
const CACHE_TTL_MS = 30 * 1000; // 30 seconds TTL for public data

export function clearPublicDataCache(collection?: CollectionKey) {
  if (collection) {
    delete memoryCache[collection];
  } else {
    for (const key of Object.keys(memoryCache)) {
      delete memoryCache[key as CollectionKey];
    }
  }
}

/**
 * Normalizes legacy collection keys
 */
function normalizeKey(col: string): CollectionKey {
  if (col === 'reviewVideos') return 'videoReviews';
  return col as CollectionKey;
}

/**
 * Loads public collection from Supabase with request deduplication and memory caching.
 */
async function loadCollectionFromSupabaseWithCache(collection: CollectionKey): Promise<any[]> {
  const cached = memoryCache[collection];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Deduplicate concurrent requests for the exact same collection
  if (inFlightRequests.has(collection)) {
    return inFlightRequests.get(collection)!;
  }

  const promise = (async () => {
    try {
      const items = await fetchPublicCollectionFromSupabase(collection);
      if (Array.isArray(items) && items.length > 0) {
        memoryCache[collection] = { data: items, timestamp: Date.now() };
      }
      return items;
    } catch (err) {
      console.warn(`[useAdminData] Error loading ${collection} from Supabase:`, err);
      return [];
    } finally {
      inFlightRequests.delete(collection);
    }
  })();

  inFlightRequests.set(collection, promise);
  return promise;
}

export interface CollectionState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  isEmpty: boolean;
  fromDatabase: boolean;
}

export function useLiveCollectionState<T>(
  rawCollection: string,
  defaultData: T[]
): CollectionState<T> {
  const collection = normalizeKey(rawCollection);

  const [data, setData] = useState<T[]>(() => {
    const cached = memoryCache[collection];
    if (cached && cached.data.length > 0) return cached.data as T[];
    try {
      const localItems = getCollection(collection as any);
      if (localItems && localItems.length > 0) return localItems as T[];
    } catch {}
    return defaultData;
  });

  const [loading, setLoading] = useState<boolean>(() => {
    const cached = memoryCache[collection];
    return !cached || cached.data.length === 0;
  });

  const [error, setError] = useState<Error | null>(null);
  const [fromDatabase, setFromDatabase] = useState<boolean>(() => {
    const cached = memoryCache[collection];
    return Boolean(cached && cached.data.length > 0);
  });

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchLive = async (forceBustCache = false) => {
      if (forceBustCache) {
        delete memoryCache[collection];
      }

      try {
        const dbItems = await loadCollectionFromSupabaseWithCache(collection);
        if (!isMountedRef.current) return;

        if (Array.isArray(dbItems) && dbItems.length > 0) {
          setData(dbItems as T[]);
          setFromDatabase(true);
        } else {
          // If database is empty, maintain fallback
          setFromDatabase(false);
          try {
            const localItems = getCollection(collection as any);
            if (localItems && localItems.length > 0) {
              setData(localItems as T[]);
            } else {
              setData(defaultData);
            }
          } catch {
            setData(defaultData);
          }
        }
        setError(null);
      } catch (err: any) {
        if (!isMountedRef.current) return;
        console.warn(`[useAdminData] Fallback preserved for ${collection}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchLive();

    const handleUpdate = () => {
      fetchLive(true);
    };

    window.addEventListener(DB_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener(DB_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [collection, defaultData]);

  return {
    data,
    loading,
    error,
    isEmpty: data.length === 0,
    fromDatabase,
  };
}

function useCollectionData<T>(collection: string, defaultData: T[]): T[] {
  const { data } = useLiveCollectionState<T>(collection, defaultData);
  return data;
}

export function useLiveSiteNumbers(locationPrefix?: string) {
  const items = useCollectionData<AdminSiteNumber>('siteNumbers', []);

  return useMemo(() => {
    if (!items || items.length === 0) {
      if (locationPrefix?.toLowerCase().includes('hero')) {
        return [
          { id: 'stat-hero-1', label: 'Years Exp.', value: 7, suffix: '+', location: 'Home Hero Statistics', show: true, order: 1, updatedAt: '' },
          { id: 'stat-hero-2', label: 'Projects', value: 100, suffix: '+', location: 'Home Hero Statistics', show: true, order: 2, updatedAt: '' },
          { id: 'stat-hero-3', label: 'Clients', value: 60, suffix: '+', location: 'Home Hero Statistics', show: true, order: 3, updatedAt: '' },
          { id: 'stat-hero-4', label: 'Satisfaction', value: 98, suffix: '%', location: 'Home Hero Statistics', show: true, order: 4, updatedAt: '' },
        ];
      }
      if (locationPrefix?.toLowerCase().includes('about')) {
        return [
          { id: 'stat-about-1', label: 'Years of craft', value: 7, suffix: '+', location: 'About Intro Metrics', show: true, order: 1, updatedAt: '' },
          { id: 'stat-about-2', label: 'Projects shipped', value: 100, suffix: '+', location: 'About Intro Metrics', show: true, order: 2, updatedAt: '' },
          { id: 'stat-about-3', label: 'Happy clients', value: 60, suffix: '+', location: 'About Intro Metrics', show: true, order: 3, updatedAt: '' },
          { id: 'stat-about-4', label: 'Client retention', value: 98, suffix: '%', location: 'About Intro Metrics', show: true, order: 4, updatedAt: '' },
        ];
      }
      return defaultStats.map((s, idx) => ({
        id: `default-${idx}`,
        label: s.label,
        value: s.value,
        suffix: s.suffix,
        location: 'Results & Trust Bar',
        show: true,
        order: idx + 1,
        updatedAt: '',
      }));
    }

    const visible = items.filter((s) => s.show).sort((a, b) => a.order - b.order);
    if (!locationPrefix) return visible;

    const filtered = visible.filter((s) =>
      s.location.toLowerCase().includes(locationPrefix.toLowerCase())
    );
    return filtered.length > 0 ? filtered : visible.slice(0, 4);
  }, [items, locationPrefix]);
}

export function useLiveWorksWithState() {
  const state = useLiveCollectionState<AdminWorkItem>('works', []);
  const works = useMemo(() => {
    const items = state.data;
    if (!items || items.length === 0) {
      return defaultWorks;
    }
    return items
      .filter((w) => w.show)
      .sort((a, b) => a.order - b.order)
      .map((w: any) => ({
        ...w,
        image: w.coverImage || w.image,
        cover: w.coverImage || w.detail?.cover || w.image,
        results: w.results || [],
        tech: w.tech || [],
        hue: w.hue || '#0582D5',
        detail: w.detail || {
          cover: w.coverImage || w.image,
          overview: w.description || '',
          challenge: w.challenge || '',
          approach: w.approach || '',
          outcome: w.outcome || '',
          gallery: w.gallery || [],
        },
      }));
  }, [state.data]);

  return { ...state, data: works };
}

export function useLiveWorks() {
  const { data } = useLiveWorksWithState();
  return data;
}

export function useLiveServicesWithState() {
  const state = useLiveCollectionState<AdminService>('services', []);
  const services = useMemo(() => {
    const items = state.data;
    if (!items || items.length === 0) {
      return defaultServices;
    }
    return items.filter((s) => s.show).sort((a, b) => a.order - b.order);
  }, [state.data]);

  return { ...state, data: services };
}

export function useLiveServices() {
  const { data } = useLiveServicesWithState();
  return data;
}

export function useLiveProcessSteps() {
  const items = useCollectionData<AdminProcessStep>('process', []);
  return useMemo(() => {
    if (!items || items.length === 0) {
      return defaultProcess.map((p, idx) => ({
        id: `p-${idx}`,
        stepNumber: idx + 1,
        title: p.title,
        shortDesc: p.shortDesc,
        icon: p.title,
        show: true,
        order: idx + 1,
        updatedAt: '',
      }));
    }
    return items.filter((p) => p.show).sort((a, b) => a.order - b.order);
  }, [items]);
}

export function useLiveFAQs() {
  const items = useCollectionData<AdminFAQ>('faqs', []);
  return useMemo(() => {
    if (!items || items.length === 0) {
      return defaultFaqs.map((f, idx) => ({
        id: `f-${idx}`,
        question: f.q,
        answer: f.a,
        show: true,
        order: idx + 1,
        updatedAt: '',
      }));
    }
    return items.filter((f) => f.show).sort((a, b) => a.order - b.order);
  }, [items]);
}

export function useLiveBlogsWithState() {
  const state = useLiveCollectionState<AdminBlogPost>('blogs', []);
  const blogs = useMemo(() => {
    const items = state.data;
    if (!items || items.length === 0) {
      return defaultBlogs;
    }
    return items
      .filter((b) => b.status === 'published' && (b as any).show !== false)
      .sort((a, b) => a.order - b.order)
      .map((b: any) => ({
        ...b,
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        category: b.category,
        image: b.coverImage || b.image || '/brand/blog/kurla-web-dev.jpg',
        date: b.publishDate || b.date || 'Recent',
        read: b.readingTime || b.read || '4 min',
        area: b.area || 'Mumbai',
        keywords: b.tags || b.keywords || ['Mumbai', 'Digital Growth'],
        metaTitle: b.seoTitle || b.title,
        metaDescription: b.seoDescription || b.excerpt,
        hue: b.hue || '#0582D5',
        iso: b.publishDate ? new Date(b.publishDate).toISOString() : new Date().toISOString(),
      }));
  }, [state.data]);

  return { ...state, data: blogs };
}

export function useLiveBlogs() {
  const { data } = useLiveBlogsWithState();
  return data;
}

export function useLiveReviews() {
  const items = useCollectionData<AdminReview>('reviews', []);
  return useMemo(() => {
    if (!items || items.length === 0) {
      return defaultReviews;
    }
    return items
      .filter((r) => r.show)
      .sort((a, b) => a.order - b.order)
      .map((r: any) => ({
        ...r,
        name: r.name || r.clientName,
        company: r.company || '',
        role: r.role || 'Client',
        quote: r.reviewText || r.quote || '',
        reviewText: r.reviewText || r.quote || '',
        rating: r.rating || 5,
        photo: r.photo,
        initials:
          r.initials ||
          (r.name || r.clientName || 'PK')
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
      }));
  }, [items]);
}

export function useLiveReviewVideos() {
  const items = useCollectionData<AdminVideoReview>('reviewVideos', []);
  return useMemo(() => {
    if (!items || items.length === 0) {
      return [
        {
          id: 'v-1',
          name: 'Shaheen Khan',
          company: 'CareReach Foundation',
          hue: '#0582D5',
          metric: 'Verified Client',
          videoUrl: '',
          thumbnail: '',
          show: true,
          order: 1,
        },
      ];
    }
    return items.filter((v) => v.show).sort((a, b) => a.order - b.order);
  }, [items]);
}
