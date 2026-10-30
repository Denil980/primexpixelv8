import { supabase } from '../../lib/supabase';
import type {
  AdminBlogPost,
  AdminReview,
  AdminVideoReview,
  AdminWorkItem,
  AdminService,
  AdminProcessStep,
  AdminFAQ,
  AdminSiteNumber,
  AdminDatabase,
} from '../types';

export type CollectionKey = keyof Omit<AdminDatabase, 'version' | 'lastUpdated'>;

export const COLLECTION_TABLE_MAP: Record<CollectionKey, string> = {
  blogs: 'blogs',
  reviews: 'reviews',
  videoReviews: 'video_reviews',
  works: 'works',
  services: 'services',
  process: 'process_steps',
  faqs: 'faqs',
  siteNumbers: 'site_numbers',
};

// ============================================================================
// DATA TRANSFORMS: Supabase (snake_case) <--> Frontend (camelCase)
// ============================================================================

// 1. BLOGS
export function mapBlogFromDB(row: any): AdminBlogPost {
  return {
    id: row.id,
    slug: row.slug || '',
    title: row.title || '',
    coverImage: row.cover_image || '',
    category: row.category || 'General',
    tags: Array.isArray(row.tags) ? row.tags : [],
    excerpt: row.excerpt || '',
    content: row.content || '',
    author: row.author || 'PrimeXPixel Team',
    publishDate: row.publish_date || '',
    seoTitle: row.seo_title || row.title || '',
    seoDescription: row.seo_description || row.excerpt || '',
    status: (row.status === 'published' ? 'published' : 'draft'),
    readingTime: row.reading_time || '5 min',
    area: row.area || 'Mumbai',
    order: Number(row.display_order) || 0,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapBlogToDB(item: Partial<AdminBlogPost>): any {
  const row: any = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.slug !== undefined) row.slug = item.slug;
  if (item.title !== undefined) row.title = item.title;
  if (item.coverImage !== undefined) row.cover_image = item.coverImage;
  if (item.category !== undefined) row.category = item.category;
  if (item.tags !== undefined) row.tags = item.tags;
  if (item.excerpt !== undefined) row.excerpt = item.excerpt;
  if (item.content !== undefined) row.content = item.content;
  if (item.author !== undefined) row.author = item.author;
  if (item.publishDate !== undefined) row.publish_date = item.publishDate;
  if (item.seoTitle !== undefined) row.seo_title = item.seoTitle;
  if (item.seoDescription !== undefined) row.seo_description = item.seoDescription;
  if (item.status !== undefined) row.status = item.status;
  if (item.readingTime !== undefined) row.reading_time = item.readingTime;
  if (item.area !== undefined) row.area = item.area;
  if (item.order !== undefined) row.display_order = item.order;
  return row;
}

// 2. TEXT REVIEWS
export function mapReviewFromDB(row: any): AdminReview {
  return {
    id: row.id,
    name: row.name || '',
    company: row.company || '',
    role: row.role || '',
    photo: row.photo || '',
    initials: row.initials || '',
    rating: Number(row.rating) || 5,
    reviewText: row.review_text || '',
    date: row.date || '',
    show: Boolean(row.is_visible),
    order: Number(row.display_order) || 0,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapReviewToDB(item: Partial<AdminReview>): any {
  const row: any = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.name !== undefined) row.name = item.name;
  if (item.company !== undefined) row.company = item.company;
  if (item.role !== undefined) row.role = item.role;
  if (item.photo !== undefined) row.photo = item.photo;
  if (item.initials !== undefined) row.initials = item.initials;
  if (item.rating !== undefined) row.rating = item.rating;
  if (item.reviewText !== undefined) row.review_text = item.reviewText;
  if (item.date !== undefined) row.date = item.date;
  if (item.show !== undefined) row.is_visible = item.show;
  if (item.order !== undefined) row.display_order = item.order;
  return row;
}

// 3. VIDEO REVIEWS
export function mapVideoReviewFromDB(row: any): AdminVideoReview {
  return {
    id: row.id,
    name: row.name || '',
    company: row.company || '',
    videoUrl: row.video_url || '',
    thumbnail: row.thumbnail || '',
    metric: row.metric || '',
    hue: row.hue || '#0582D5',
    show: Boolean(row.is_visible),
    order: Number(row.display_order) || 0,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapVideoReviewToDB(item: Partial<AdminVideoReview>): any {
  const row: any = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.name !== undefined) row.name = item.name;
  if (item.company !== undefined) row.company = item.company;
  if (item.videoUrl !== undefined) row.video_url = item.videoUrl;
  if (item.thumbnail !== undefined) row.thumbnail = item.thumbnail;
  if (item.metric !== undefined) row.metric = item.metric;
  if (item.hue !== undefined) row.hue = item.hue;
  if (item.show !== undefined) row.is_visible = item.show;
  if (item.order !== undefined) row.display_order = item.order;
  return row;
}

// 4. WORKS (PORTFOLIO)
export function mapWorkFromDB(row: any): AdminWorkItem {
  // If results is an object, extract fallback if dedicated columns not yet migrated
  const resultsMeta = typeof row.results === 'object' && row.results !== null && !Array.isArray(row.results)
    ? row.results
    : null;
  const metrics = Array.isArray(row.results)
    ? row.results
    : Array.isArray(resultsMeta?.metrics)
    ? resultsMeta.metrics
    : [];

  const features = Array.isArray(row.features) && row.features.length > 0
    ? row.features
    : Array.isArray(resultsMeta?.features)
    ? resultsMeta.features
    : [];

  const highlights = Array.isArray(row.highlights) && row.highlights.length > 0
    ? row.highlights
    : Array.isArray(resultsMeta?.highlights)
    ? resultsMeta.highlights
    : [];

  const resultsList = Array.isArray(row.results_list) && row.results_list.length > 0
    ? row.results_list
    : Array.isArray(resultsMeta?.resultsList)
    ? resultsMeta.resultsList
    : [];

  return {
    id: row.id,
    title: row.title || '',
    slug: row.slug || '',
    client: row.client || '',
    category: row.category || 'Website',
    coverImage: row.cover_image || '',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    description: row.description || '',
    overview: row.overview || resultsMeta?.overview || row.description || '',
    features,
    highlights,
    resultsList,
    challenge: row.challenge || '',
    approach: row.approach || '',
    outcome: row.outcome || '',
    liveLink: row.live_link || '',
    tech: Array.isArray(row.tech) ? row.tech : [],
    year: row.year || '',
    results: metrics,
    show: Boolean(row.is_visible),
    order: Number(row.display_order) || 0,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapWorkToDB(item: Partial<AdminWorkItem>): any {
  const row: any = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.title !== undefined) row.title = item.title;
  if (item.slug !== undefined) row.slug = item.slug;
  if (item.client !== undefined) row.client = item.client;
  if (item.category !== undefined) row.category = item.category;
  if (item.coverImage !== undefined) row.cover_image = item.coverImage;
  if (item.gallery !== undefined) row.gallery = item.gallery;
  if (item.description !== undefined) row.description = item.description;
  if (item.overview !== undefined) row.overview = item.overview;
  if (item.features !== undefined) row.features = item.features;
  if (item.highlights !== undefined) row.highlights = item.highlights;
  if (item.resultsList !== undefined) row.results_list = item.resultsList;
  if (item.challenge !== undefined) row.challenge = item.challenge;
  if (item.approach !== undefined) row.approach = item.approach;
  if (item.outcome !== undefined) row.outcome = item.outcome;
  if (item.liveLink !== undefined) row.live_link = item.liveLink;
  if (item.tech !== undefined) row.tech = item.tech;
  if (item.year !== undefined) row.year = item.year;
  if (item.results !== undefined) row.results = item.results;
  if (item.show !== undefined) row.is_visible = item.show;
  if (item.order !== undefined) row.display_order = item.order;
  return row;
}

// 5. SERVICES
export function mapServiceFromDB(row: any): AdminService {
  return {
    id: row.id,
    title: row.title || '',
    slug: row.slug || '',
    icon: row.icon || 'Code2',
    tagline: row.tagline || '',
    heroImage: row.hero_image || '',
    shortDesc: row.short_desc || '',
    fullDesc: row.full_desc || '',
    overview: row.overview || '',
    whoItIsFor: row.who_it_is_for || '',
    problem: row.problem || '',
    solution: row.solution || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    process: Array.isArray(row.process) ? row.process : [],
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    ctaText: row.cta_text || 'Get a Custom Quote',
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    metaTitle: row.meta_title || '',
    metaDescription: row.meta_description || '',
    technologies: Array.isArray(row.technologies) ? row.technologies : [],
    workCategories: Array.isArray(row.work_categories) ? row.work_categories : [],
    show: Boolean(row.is_visible),
    order: Number(row.display_order) || 0,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapServiceToDB(item: Partial<AdminService>): any {
  const row: any = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.title !== undefined) row.title = item.title;
  if (item.slug !== undefined) row.slug = item.slug;
  if (item.icon !== undefined) row.icon = item.icon;
  if (item.tagline !== undefined) row.tagline = item.tagline;
  if (item.heroImage !== undefined) row.hero_image = item.heroImage;
  if (item.shortDesc !== undefined) row.short_desc = item.shortDesc;
  if (item.fullDesc !== undefined) row.full_desc = item.fullDesc;
  if (item.overview !== undefined) row.overview = item.overview;
  if (item.whoItIsFor !== undefined) row.who_it_is_for = item.whoItIsFor;
  if (item.problem !== undefined) row.problem = item.problem;
  if (item.solution !== undefined) row.solution = item.solution;
  if (item.highlights !== undefined) row.highlights = item.highlights;
  if (item.benefits !== undefined) row.benefits = item.benefits;
  if (item.process !== undefined) row.process = item.process;
  if (item.faqs !== undefined) row.faqs = item.faqs;
  if (item.ctaText !== undefined) row.cta_text = item.ctaText;
  if (item.gallery !== undefined) row.gallery = item.gallery;
  if (item.metaTitle !== undefined) row.meta_title = item.metaTitle;
  if (item.metaDescription !== undefined) row.meta_description = item.metaDescription;
  if (item.technologies !== undefined) row.technologies = item.technologies;
  if (item.workCategories !== undefined) row.work_categories = item.workCategories;
  if (item.show !== undefined) row.is_visible = item.show;
  if (item.order !== undefined) row.display_order = item.order;
  return row;
}

// 6. PROCESS STEPS
export function mapProcessStepFromDB(row: any): AdminProcessStep {
  return {
    id: row.id,
    stepNumber: Number(row.step_number) || 1,
    title: row.title || '',
    shortDesc: row.short_desc || '',
    icon: row.icon || 'Compass',
    show: Boolean(row.is_visible),
    order: Number(row.display_order) || 0,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapProcessStepToDB(item: Partial<AdminProcessStep>): any {
  const row: any = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.stepNumber !== undefined) row.step_number = item.stepNumber;
  if (item.title !== undefined) row.title = item.title;
  if (item.shortDesc !== undefined) row.short_desc = item.shortDesc;
  if (item.icon !== undefined) row.icon = item.icon;
  if (item.show !== undefined) row.is_visible = item.show;
  if (item.order !== undefined) row.display_order = item.order;
  return row;
}

// 7. FAQS
export function mapFAQFromDB(row: any): AdminFAQ {
  return {
    id: row.id,
    question: row.question || '',
    answer: row.answer || '',
    category: row.category || 'General',
    show: Boolean(row.is_visible),
    order: Number(row.display_order) || 0,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapFAQToDB(item: Partial<AdminFAQ>): any {
  const row: any = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.question !== undefined) row.question = item.question;
  if (item.answer !== undefined) row.answer = item.answer;
  if (item.category !== undefined) row.category = item.category;
  if (item.show !== undefined) row.is_visible = item.show;
  if (item.order !== undefined) row.display_order = item.order;
  return row;
}

// 8. SITE NUMBERS
export function mapSiteNumberFromDB(row: any): AdminSiteNumber {
  const numericVal = parseFloat(row.value);
  return {
    id: row.id,
    label: row.label || '',
    value: isNaN(numericVal) ? 0 : numericVal,
    suffix: row.suffix || '',
    location: row.location || 'Hero Stats',
    show: Boolean(row.is_visible),
    order: Number(row.display_order) || 0,
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

export function mapSiteNumberToDB(item: Partial<AdminSiteNumber>): any {
  const row: any = {};
  if (item.id !== undefined) row.id = item.id;
  if (item.label !== undefined) row.label = item.label;
  if (item.value !== undefined) row.value = String(item.value);
  if (item.suffix !== undefined) row.suffix = item.suffix;
  if (item.location !== undefined) row.location = item.location;
  if (item.show !== undefined) row.is_visible = item.show;
  if (item.order !== undefined) row.display_order = item.order;
  return row;
}

// Converter dispatchers
export function mapRowFromDB(collection: CollectionKey, row: any): any {
  switch (collection) {
    case 'blogs': return mapBlogFromDB(row);
    case 'reviews': return mapReviewFromDB(row);
    case 'videoReviews': return mapVideoReviewFromDB(row);
    case 'works': return mapWorkFromDB(row);
    case 'services': return mapServiceFromDB(row);
    case 'process': return mapProcessStepFromDB(row);
    case 'faqs': return mapFAQFromDB(row);
    case 'siteNumbers': return mapSiteNumberFromDB(row);
  }
}

export function mapItemToDB(collection: CollectionKey, item: any): any {
  switch (collection) {
    case 'blogs': return mapBlogToDB(item);
    case 'reviews': return mapReviewToDB(item);
    case 'videoReviews': return mapVideoReviewToDB(item);
    case 'works': return mapWorkToDB(item);
    case 'services': return mapServiceToDB(item);
    case 'process': return mapProcessStepToDB(item);
    case 'faqs': return mapFAQToDB(item);
    case 'siteNumbers': return mapSiteNumberToDB(item);
  }
}

// ============================================================================
// SUPABASE CRUD OPERATIONS
// ============================================================================

export async function fetchCollectionFromSupabase(collection: CollectionKey): Promise<any[]> {
  const tableName = COLLECTION_TABLE_MAP[collection];
  if (!tableName) return [];

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error(`[Supabase] Error fetching ${collection} from ${tableName}:`, error.message);
    throw error;
  }

  return (data || []).map((row) => mapRowFromDB(collection, row));
}

/**
 * Public query for unauthenticated visitors.
 * Enforces published / is_visible filters and display_order sorting.
 */
export async function fetchPublicCollectionFromSupabase(collection: CollectionKey): Promise<any[]> {
  const tableName = COLLECTION_TABLE_MAP[collection];
  if (!tableName) return [];

  let query = supabase.from(tableName).select('*');

  if (collection === 'blogs') {
    query = query.eq('status', 'published');
  } else {
    query = query.eq('is_visible', true);
  }

  const { data, error } = await query.order('display_order', { ascending: true });

  if (error) {
    console.warn(`[Supabase Public] Error fetching ${collection} from ${tableName}:`, error.message);
    throw error;
  }

  return (data || []).map((row) => mapRowFromDB(collection, row));
}

function notifyCollectionUpdated(collection: CollectionKey) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('primexpixel_db_updated', { detail: { collection } }));
  }
}

export async function createItemInSupabase(collection: CollectionKey, item: any): Promise<any> {
  const tableName = COLLECTION_TABLE_MAP[collection];
  const dbRow = mapItemToDB(collection, item);

  // If no ID is provided, Supabase default gen_random_uuid() handles it
  let { data, error } = await supabase
    .from(tableName)
    .insert([dbRow])
    .select()
    .single();

  // Graceful fallback for 'works' if migration 20261030000003 has not been run yet
  const isMissingColumnError =
    error &&
    collection === 'works' &&
    (error.code === 'PGRST204' ||
      (error.message?.includes('column') &&
        (error.message?.includes('schema cache') ||
          error.message?.includes('Could not find') ||
          error.message?.includes('does not exist'))));

  if (isMissingColumnError) {
    console.warn('[Supabase Works] Table lacks new columns. Falling back to JSONB encoding in results.');
    const fallbackRow = { ...dbRow };
    fallbackRow.results = {
      metrics: item.results || [],
      overview: item.overview || '',
      features: item.features || [],
      highlights: item.highlights || [],
      resultsList: item.resultsList || [],
    };
    delete fallbackRow.overview;
    delete fallbackRow.features;
    delete fallbackRow.highlights;
    delete fallbackRow.results_list;

    const retry = await supabase
      .from(tableName)
      .insert([fallbackRow])
      .select()
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error(`[Supabase] Error creating item in ${collection}:`, error.message);
    throw error;
  }

  notifyCollectionUpdated(collection);
  return mapRowFromDB(collection, data);
}

export async function updateItemInSupabase(collection: CollectionKey, id: string, updates: any): Promise<any> {
  const tableName = COLLECTION_TABLE_MAP[collection];
  const dbRow = mapItemToDB(collection, updates);
  delete dbRow.id; // Do not attempt to update the primary key

  let { data, error } = await supabase
    .from(tableName)
    .update(dbRow)
    .eq('id', id)
    .select()
    .single();

  // Graceful fallback for 'works' if migration 20261030000003 has not been run yet
  const isMissingColumnError =
    error &&
    collection === 'works' &&
    (error.code === 'PGRST204' ||
      (error.message?.includes('column') &&
        (error.message?.includes('schema cache') ||
          error.message?.includes('Could not find') ||
          error.message?.includes('does not exist'))));

  if (isMissingColumnError) {
    console.warn('[Supabase Works] Table lacks new columns. Falling back to JSONB encoding in results.');
    const fallbackRow = { ...dbRow };
    fallbackRow.results = {
      metrics: updates.results || [],
      overview: updates.overview || '',
      features: updates.features || [],
      highlights: updates.highlights || [],
      resultsList: updates.resultsList || [],
    };
    delete fallbackRow.overview;
    delete fallbackRow.features;
    delete fallbackRow.highlights;
    delete fallbackRow.results_list;

    const retry = await supabase
      .from(tableName)
      .update(fallbackRow)
      .eq('id', id)
      .select()
      .single();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error(`[Supabase] Error updating item ${id} in ${collection}:`, error.message);
    throw error;
  }

  notifyCollectionUpdated(collection);
  return mapRowFromDB(collection, data);
}

export async function deleteItemInSupabase(collection: CollectionKey, id: string): Promise<void> {
  const tableName = COLLECTION_TABLE_MAP[collection];

  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`[Supabase] Error deleting item ${id} from ${collection}:`, error.message);
    throw error;
  }

  notifyCollectionUpdated(collection);
}

export async function reorderItemsInSupabase(collection: CollectionKey, orderedIds: string[]): Promise<void> {
  const tableName = COLLECTION_TABLE_MAP[collection];

  const updates = orderedIds.map((id, index) =>
    supabase
      .from(tableName)
      .update({ display_order: index + 1 })
      .eq('id', id)
  );

  const results = await Promise.all(updates);
  const failure = results.find((r) => r.error);
  if (failure?.error) {
    console.error(`[Supabase] Error reordering items in ${collection}:`, failure.error.message);
    throw failure.error;
  }

  notifyCollectionUpdated(collection);
}

export async function toggleItemStatusInSupabase(
  collection: CollectionKey,
  id: string,
  currentStatusOrShow: string | boolean
): Promise<any> {
  const tableName = COLLECTION_TABLE_MAP[collection];

  let updatePayload: any = {};
  if (collection === 'blogs') {
    const nextStatus = currentStatusOrShow === 'published' ? 'draft' : 'published';
    updatePayload = { status: nextStatus };
  } else {
    updatePayload = { is_visible: !currentStatusOrShow };
  }

  const { data, error } = await supabase
    .from(tableName)
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`[Supabase] Error toggling status for ${id} in ${collection}:`, error.message);
    throw error;
  }

  notifyCollectionUpdated(collection);
  return mapRowFromDB(collection, data);
}

export async function fetchDashboardCountsRPC(): Promise<any | null> {
  try {
    const { data, error } = await supabase.rpc('get_admin_dashboard_counts');
    if (error) {
      console.warn('[Supabase] get_admin_dashboard_counts RPC returned error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('[Supabase] Failed to call dashboard counts RPC:', err);
    return null;
  }
}
