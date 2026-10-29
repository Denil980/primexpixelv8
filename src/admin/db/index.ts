import { useState, useEffect, useCallback } from 'react';
import type { AdminDatabase } from '../types';
import { getInitialSeedData } from './seed';

const STORAGE_KEY = 'primexpixel_admin_db_v2';
const OLD_STORAGE_KEY = 'primexpixel_admin_db_v1';
const DB_UPDATE_EVENT = 'primexpixel_db_updated';

// In-memory cache for fast synchronous access
let cachedDB: AdminDatabase | null = null;

export function getAdminDB(): AdminDatabase {
  if (cachedDB) return cachedDB;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version && parsed.blogs && parsed.services) {
        if (Array.isArray(parsed.reviews)) {
          const originalLen = parsed.reviews.length;
          parsed.reviews = parsed.reviews.filter((r: any) =>
            !(
              (r.name === 'denil' && r.company === 'denil') ||
              (typeof r.reviewText === 'string' && r.reviewText.includes('kdfuhy'))
            )
          );
          if (parsed.reviews.length !== originalLen) {
            // Re-index order
            parsed.reviews.forEach((r: any, idx: number) => {
              r.order = idx + 1;
            });
            saveAdminDB(parsed);
          }
        }
        cachedDB = parsed;
        return parsed;
      }
    }

    // Seamless migration from v1: preserve user data while updating zero-pricing services
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const oldParsed = JSON.parse(oldRaw);
      if (Array.isArray(oldParsed.reviews)) {
        oldParsed.reviews = oldParsed.reviews.filter((r: any) =>
          !(
            (r.name === 'denil' && r.company === 'denil') ||
            (typeof r.reviewText === 'string' && r.reviewText.includes('kdfuhy'))
          )
        );
      }
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

export function createItem<K extends keyof Omit<AdminDatabase, 'version' | 'lastUpdated'>>(
  collection: K,
  item: any
): any {
  const db = getAdminDB();
  const list = [...((db[collection] as any[]) || [])];
  
  const newItem = {
    ...item,
    id: item.id || `${collection}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    order: item.order !== undefined ? item.order : list.length + 1,
    updatedAt: new Date().toISOString(),
  };

  list.push(newItem);
  db[collection] = list as any;
  saveAdminDB(db);
  return newItem;
}

export function updateItem<K extends keyof Omit<AdminDatabase, 'version' | 'lastUpdated'>>(
  collection: K,
  id: string,
  updates: any
): any {
  const db = getAdminDB();
  const list = [...((db[collection] as any[]) || [])];
  const index = list.findIndex((x) => x.id === id);

  if (index === -1) {
    throw new Error(`Item with id ${id} not found in ${collection}`);
  }

  const updatedItem = {
    ...list[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updatedItem;
  db[collection] = list as any;
  saveAdminDB(db);
  return updatedItem;
}

export function deleteItem<K extends keyof Omit<AdminDatabase, 'version' | 'lastUpdated'>>(
  collection: K,
  id: string
): void {
  const db = getAdminDB();
  const list = ((db[collection] as any[]) || []).filter((x) => x.id !== id);
  // Re-index orders
  list.forEach((item, idx) => {
    item.order = idx + 1;
  });
  db[collection] = list as any;
  saveAdminDB(db);
}

export function reorderCollection<K extends keyof Omit<AdminDatabase, 'version' | 'lastUpdated'>>(
  collection: K,
  orderedIds: string[]
): void {
  const db = getAdminDB();
  const list = ((db[collection] as any[]) || []);
  const map = new Map(list.map((item) => [item.id, item]));

  const reordered: any[] = [];
  orderedIds.forEach((id, idx) => {
    const item = map.get(id);
    if (item) {
      item.order = idx + 1;
      item.updatedAt = new Date().toISOString();
      reordered.push(item);
      map.delete(id);
    }
  });

  // Append any remaining that weren't in orderedIds
  map.forEach((item) => {
    item.order = reordered.length + 1;
    reordered.push(item);
  });

  db[collection] = reordered as any;
  saveAdminDB(db);
}

export function toggleItemStatus<K extends keyof Omit<AdminDatabase, 'version' | 'lastUpdated'>>(
  collection: K,
  id: string
): void {
  const db = getAdminDB();
  const list = ((db[collection] as any[]) || []);
  const item = list.find((x) => x.id === id);
  if (!item) return;

  if ('status' in item) {
    item.status = item.status === 'published' ? 'draft' : 'published';
  } else if ('show' in item) {
    item.show = !item.show;
  }
  item.updatedAt = new Date().toISOString();
  saveAdminDB(db);
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

// React hook to subscribe to collection updates
export function useAdminCollection<K extends keyof Omit<AdminDatabase, 'version' | 'lastUpdated'>>(
  collection: K
) {
  const [data, setData] = useState<AdminDatabase[K]>(() => getCollection(collection));

  const refresh = useCallback(() => {
    setData(getCollection(collection));
  }, [collection]);

  useEffect(() => {
    refresh();

    const handleUpdate = () => {
      refresh();
    };

    window.addEventListener(DB_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(DB_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [collection, refresh]);

  return {
    items: data as any[],
    refresh,
    create: (item: any) => createItem(collection, item),
    update: (id: string, updates: any) => updateItem(collection, id, updates),
    remove: (id: string) => deleteItem(collection, id),
    reorder: (orderedIds: string[]) => reorderCollection(collection, orderedIds),
    toggleStatus: (id: string) => toggleItemStatus(collection, id),
  };
}
