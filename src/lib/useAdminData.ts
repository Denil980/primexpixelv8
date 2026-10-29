import { useState, useEffect, useMemo } from 'react';
import { getCollection } from '../admin/db';
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

function useCollectionData<T>(collection: string, defaultData: T[]): T[] {
  const [data, setData] = useState<T[]>(() => {
    try {
      const items = getCollection(collection as any);
      if (items && items.length > 0) return items as T[];
    } catch {}
    return defaultData;
  });

  useEffect(() => {
    const update = () => {
      try {
        const items = getCollection(collection as any);
        if (items && items.length > 0) {
          setData(items as T[]);
        }
      } catch {}
    };

    window.addEventListener(DB_UPDATE_EVENT, update);
    window.addEventListener('storage', update);

    return () => {
      window.removeEventListener(DB_UPDATE_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [collection]);

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

export function useLiveWorks() {
  const items = useCollectionData<AdminWorkItem>('works', []);
  return useMemo(() => {
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
  }, [items]);
}

export function useLiveServices() {
  const items = useCollectionData<AdminService>('services', []);
  return useMemo(() => {
    if (!items || items.length === 0) {
      return defaultServices;
    }
    return items.filter((s) => s.show).sort((a, b) => a.order - b.order);
  }, [items]);
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

export function useLiveBlogs() {
  const items = useCollectionData<AdminBlogPost>('blogs', []);
  return useMemo(() => {
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
  }, [items]);
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
