import { supabase } from '../../lib/supabase';
import {
  fetchCollectionFromSupabase,
  createItemInSupabase,
  updateItemInSupabase,
  deleteItemInSupabase,
  toggleItemStatusInSupabase,
  COLLECTION_TABLE_MAP,
  CollectionKey,
} from './supabaseService';

export interface CrudModuleResult {
  moduleName: string;
  tableName: string;
  fetch: boolean;
  create: boolean;
  edit: boolean;
  toggleStatus: boolean;
  verifyInDB: boolean;
  delete: boolean;
  verifyDeleted: boolean;
  overall: boolean;
  error?: string;
  durationMs: number;
}

export async function verifyModuleCrud(collection: CollectionKey): Promise<CrudModuleResult> {
  const startTime = Date.now();
  const tableName = COLLECTION_TABLE_MAP[collection];
  const result: CrudModuleResult = {
    moduleName: collection,
    tableName,
    fetch: false,
    create: false,
    edit: false,
    toggleStatus: false,
    verifyInDB: false,
    delete: false,
    verifyDeleted: false,
    overall: false,
    durationMs: 0,
  };

  let createdId: string | null = null;

  try {
    // 1. FETCH
    const initialList = await fetchCollectionFromSupabase(collection);
    if (!Array.isArray(initialList)) throw new Error('Fetch did not return an array');
    result.fetch = true;

    // 2. CREATE TEMPORARY RECORD
    const timestamp = Date.now();
    let testPayload: any = {};

    switch (collection) {
      case 'blogs':
        testPayload = {
          title: `__TEST_BLOG_${timestamp}__`,
          slug: `test-blog-${timestamp}`,
          category: 'Testing',
          coverImage: '/brand/blog/kurla-web-dev.jpg',
          tags: ['test', 'supabase'],
          excerpt: 'Temporary test blog excerpt for CRUD verification',
          content: '<p>Temporary test blog content.</p>',
          author: 'PrimeXPixel Test Suite',
          publishDate: 'Feb 18, 2026',
          seoTitle: 'Test Blog SEO',
          seoDescription: 'Test Blog SEO Description',
          status: 'published',
          readingTime: '2 min',
          area: 'Mumbai',
          order: 9999,
        };
        break;
      case 'reviews':
        testPayload = {
          name: `__TEST_REVIEWER_${timestamp}__`,
          company: 'Test Corp',
          role: 'QA Lead',
          rating: 5,
          reviewText: 'Temporary test review for CRUD verification.',
          date: '2026',
          show: true,
          order: 9999,
        };
        break;
      case 'videoReviews':
        testPayload = {
          name: `__TEST_VIDEO_${timestamp}__`,
          company: 'Test Studio',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          metric: '+100% Test',
          hue: '#0582D5',
          show: true,
          order: 9999,
        };
        break;
      case 'works':
        testPayload = {
          title: `__TEST_WORK_${timestamp}__`,
          slug: `test-work-${timestamp}`,
          client: 'Test Client',
          category: 'Website',
          description: 'Temporary test work item for CRUD verification.',
          liveLink: 'https://example.com',
          tech: ['React', 'Supabase'],
          year: '2026',
          results: [{ label: 'Performance', value: '100%' }],
          show: true,
          order: 9999,
        };
        break;
      case 'services':
        testPayload = {
          title: `__TEST_SERVICE_${timestamp}__`,
          slug: `test-service-${timestamp}`,
          icon: 'Code2',
          tagline: 'Test service tagline',
          shortDesc: 'Test service short description.',
          fullDesc: 'Test service full description.',
          problem: 'Test problem',
          solution: 'Test solution',
          highlights: ['Feature 1', 'Feature 2'],
          benefits: ['Benefit 1', 'Benefit 2'],
          process: ['Step 1', 'Step 2'],
          faqs: [{ q: 'Test Question?', a: 'Test Answer.' }],
          ctaText: 'Test CTA',
          technologies: ['React', 'TypeScript'],
          show: true,
          order: 9999,
        };
        break;
      case 'process':
        testPayload = {
          stepNumber: 99,
          title: `__TEST_STEP_${timestamp}__`,
          shortDesc: 'Temporary test process step description.',
          icon: 'Compass',
          show: true,
          order: 9999,
        };
        break;
      case 'faqs':
        testPayload = {
          question: `__TEST_FAQ_${timestamp}__?`,
          answer: 'Temporary test FAQ answer for CRUD verification.',
          category: 'Testing',
          show: true,
          order: 9999,
        };
        break;
      case 'siteNumbers':
        testPayload = {
          label: `__TEST_NUMBER_${timestamp}__`,
          value: 999,
          suffix: '+',
          location: 'Hero Stats',
          show: true,
          order: 9999,
        };
        break;
    }

    const createdItem = await createItemInSupabase(collection, testPayload);
    if (!createdItem || !createdItem.id) throw new Error('Create failed to return item with ID');
    createdId = createdItem.id;
    result.create = true;

    // 3. VERIFY CREATION IN REMOTE DATABASE
    const { data: dbCheckAfterCreate, error: errCreate } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', createdId)
      .maybeSingle();

    if (errCreate || !dbCheckAfterCreate) {
      throw new Error(`Record verification failed after insert: ${errCreate?.message || 'not found'}`);
    }
    result.verifyInDB = true;

    // 4. EDIT RECORD
    let editPayload: any = {};
    if (collection === 'blogs') {
      editPayload = { title: `__TEST_BLOG_${timestamp}_EDITED__` };
    } else if (collection === 'reviews') {
      editPayload = { company: 'Updated Test Corp' };
    } else if (collection === 'videoReviews') {
      editPayload = { metric: '+200% Growth' };
    } else if (collection === 'works') {
      editPayload = { client: 'Updated Client' };
    } else if (collection === 'services') {
      editPayload = { tagline: 'Updated tagline' };
    } else if (collection === 'process') {
      editPayload = { title: `__TEST_STEP_${timestamp}_EDITED__` };
    } else if (collection === 'faqs') {
      editPayload = { answer: 'Updated test FAQ answer.' };
    } else if (collection === 'siteNumbers') {
      editPayload = { label: `__TEST_NUMBER_${timestamp}_EDITED__` };
    }

    if (!createdId) throw new Error('Cannot continue verification: created record has no ID');

    const updatedItem = await updateItemInSupabase(collection, createdId, editPayload);
    if (!updatedItem) throw new Error('Update returned null');
    result.edit = true;

    // 5. TOGGLE VISIBILITY / PUBLISH STATUS
    const currentVal = collection === 'blogs' ? createdItem.status : createdItem.show;
    const toggledItem = await toggleItemStatusInSupabase(collection, createdId, currentVal);
    if (!toggledItem) throw new Error('Toggle status returned null');

    const expectedToggled = collection === 'blogs'
      ? (currentVal === 'published' ? 'draft' : 'published')
      : !currentVal;

    const actualToggled = collection === 'blogs' ? toggledItem.status : toggledItem.show;
    if (actualToggled !== expectedToggled) {
      throw new Error(`Status toggle mismatch: expected ${expectedToggled}, got ${actualToggled}`);
    }
    result.toggleStatus = true;

    // 6. DELETE TEMPORARY RECORD
    await deleteItemInSupabase(collection, createdId);
    result.delete = true;

    // 7. VERIFY RECORD WAS DELETED
    const { data: dbCheckAfterDelete, error: errDelete } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', createdId)
      .maybeSingle();

    if (errDelete) throw new Error(`Query error verifying deletion: ${errDelete.message}`);
    if (dbCheckAfterDelete) throw new Error('Record still exists after delete');
    result.verifyDeleted = true;

    result.overall = true;
  } catch (err: any) {
    result.error = err?.message || String(err);
    result.overall = false;

    // Clean up temporary record if left behind
    if (createdId) {
      try {
        await supabase.from(tableName).delete().eq('id', createdId);
      } catch {}
    }
  } finally {
    result.durationMs = Date.now() - startTime;
  }

  return result;
}

export async function verifyAllContentModules(): Promise<Record<CollectionKey, CrudModuleResult>> {
  const collections: CollectionKey[] = [
    'blogs',
    'reviews',
    'videoReviews',
    'works',
    'services',
    'process',
    'faqs',
    'siteNumbers',
  ];

  const results: Record<string, CrudModuleResult> = {};

  for (const col of collections) {
    results[col] = await verifyModuleCrud(col);
  }

  return results as Record<CollectionKey, CrudModuleResult>;
}

// Attach to window for easy execution from browser console
if (typeof window !== 'undefined') {
  (window as any).__runAuthenticatedCrudTests = verifyAllContentModules;
}
