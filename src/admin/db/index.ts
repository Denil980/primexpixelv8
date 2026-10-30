import { useState, useEffect, useCallback } from 'react';
import type { AdminDatabase } from '../types';
import { getInitialSeedData } from './seed';
import {
  fetchCollectionFromSupabase,
  createItemInSupabase,
  updateItemInSupabase,
  deleteItemInSupabase,
  reorderItemsInSupabase,
  toggleItemStatusInSupabase,
  fetchDashboardCountsRPC,
  CollectionKey,
} from './supabaseService';

export { fetchDashboardCountsRPC };

const STORAGE_KEY = 'primexpixel_admin_db_v2';
const OLD_STORAGE_KEY = 'primexpixel_admin_db_v1';
const DB_UPDATE_EVENT = 'primexpixel_db_updated';

// In-memory cache for fast synchronous access and backwards compatibility
let cachedDB: AdminDatabase | null = null;

export function getAdminDB(): AdminDatabase {
  if (cachedDB) return cachedDB;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version && parsed.blogs && parsed.services) {
        cachedDB = parsed;
        return parsed;
      }
    }

    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const oldParsed = JSON.parse(oldRaw);
      const seed = getInitialSeedData();
      const migrated: AdminDatabase = {
        ...seed,
        ...oldParsed,
        version: '2.0.0',
        services: seed.services,
      };
      saveAdminDB(migrated);
      return migrated;
    }
  } catch (err) {
    console.error('Failed to parse admin database from storage, loading defaults:', err);
  }

  const initial = getInitialSeedData();
  saveAdminDB(initial);
  return initial;
}

export function saveAdminDB(db: AdminDatabase): void {
  db.lastUpdated = new Date().toISOString();
  cachedDB = db;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: { timestamp: Date.now() } }));
  } catch (err) {
    console.error('Failed to save admin database to localStorage:', err);
  }
}

export function getCollection<K extends keyof Omit<AdminDatabase, 'version' | 'lastUpdated'>>(
  collection: K
): AdminDatabase[K] {
  const db = getAdminDB();
  return (db[collection] || []) as AdminDatabase[K];
}

export function exportDatabaseJSON(): string {
  const db = getAdminDB();
  return JSON.stringify(db, null, 2);
}

export function importDatabaseJSON(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.blogs && parsed.services) {
      saveAdminDB(parsed);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to import database:', err);
    return false;
  }
}

export function resetDatabaseToDefaults(): AdminDatabase {
  const initial = getInitialSeedData();
  saveAdminDB(initial);
  return initial;
}

// ============================================================================
// REACT HOOK: Directly connected to Supabase PostgreSQL Database
// ============================================================================

export function useAdminCollection<K extends CollectionKey>(collection: K) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const remoteItems = await fetchCollectionFromSupabase(collection);
      setData(remoteItems);
    } catch (err: any) {
      console.warn(`[Supabase] Could not fetch remote ${collection}, falling back to local cache:`, err?.message);
      setError(err?.message || 'Error fetching data');
      // Graceful fallback to cached data if network issue occurs
      const local = getCollection(collection as any);
      setData(local || []);
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    fetchItems();

    const handleUpdate = () => {
      fetchItems();
    };

    window.addEventListener(DB_UPDATE_EVENT, handleUpdate);

    return () => {
      window.removeEventListener(DB_UPDATE_EVENT, handleUpdate);
    };
  }, [collection, fetchItems]);

  // Create item in Supabase
  const create = async (item: any): Promise<any> => {
    try {
      const newItem = await createItemInSupabase(collection, item);
      setData((prev) => [...prev, newItem]);
      window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: { timestamp: Date.now() } }));
      return newItem;
    } catch (err: any) {
      console.error(`[Supabase] Error creating item in ${collection}:`, err);
      throw err;
    }
  };

  // Update item in Supabase
  const update = async (id: string, updates: any): Promise<any> => {
    try {
      const updatedItem = await updateItemInSupabase(collection, id, updates);
      setData((prev) => prev.map((x) => (x.id === id ? { ...x, ...updatedItem } : x)));
      window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: { timestamp: Date.now() } }));
      return updatedItem;
    } catch (err: any) {
      console.error(`[Supabase] Error updating item ${id} in ${collection}:`, err);
      throw err;
    }
  };

  // Delete item from Supabase
  const remove = async (id: string): Promise<void> => {
    try {
      await deleteItemInSupabase(collection, id);
      setData((prev) => prev.filter((x) => x.id !== id));
      window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: { timestamp: Date.now() } }));
    } catch (err: any) {
      console.error(`[Supabase] Error deleting item ${id} from ${collection}:`, err);
      throw err;
    }
  };

  // Reorder items in Supabase
  const reorder = async (orderedIds: string[]): Promise<void> => {
    try {
      // Optimistic update
      const map = new Map(data.map((item) => [item.id, item]));
      const nextOrdered: any[] = [];
      orderedIds.forEach((id, idx) => {
        const item = map.get(id);
        if (item) {
          nextOrdered.push({ ...item, order: idx + 1 });
          map.delete(id);
        }
      });
      map.forEach((item) => nextOrdered.push(item));
      setData(nextOrdered);

      await reorderItemsInSupabase(collection, orderedIds);
      window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: { timestamp: Date.now() } }));
    } catch (err: any) {
      console.error(`[Supabase] Error reordering items in ${collection}:`, err);
      fetchItems(); // Rollback on failure
      throw err;
    }
  };

  // Toggle status or visibility in Supabase
  const toggleStatus = async (id: string): Promise<void> => {
    const item = data.find((x) => x.id === id);
    if (!item) return;

    const currentVal = collection === 'blogs' ? item.status : item.show;
    try {
      const updated = await toggleItemStatusInSupabase(collection, id, currentVal);
      setData((prev) => prev.map((x) => (x.id === id ? { ...x, ...updated } : x)));
      window.dispatchEvent(new CustomEvent(DB_UPDATE_EVENT, { detail: { timestamp: Date.now() } }));
    } catch (err: any) {
      console.error(`[Supabase] Error toggling status for ${id} in ${collection}:`, err);
      throw err;
    }
  };

  return {
    items: data,
    loading,
    error,
    refresh: fetchItems,
    create,
    update,
    remove,
    reorder,
    toggleStatus,
  };
}
