import React, { useState, useEffect, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  File,
  Trash2,
  Copy,
  ExternalLink,
  RefreshCw,
  Folder,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  listStorageMedia,
  uploadMediaToStorage,
  deleteMediaFromStorage,
  MEDIA_BUCKET,
} from '../../lib/storageService';
import { ConfirmModal } from '../components/ConfirmModal';
import { useToast } from '../components/Toast';

interface StorageItem {
  id: string;
  name: string;
  path: string;
  url: string;
  metadata?: {
    size?: number;
    mimetype?: string;
  };
  created_at: string;
}

const FOLDERS = [
  { id: 'blogs', label: 'Blogs' },
  { id: 'works', label: 'Our Works' },
  { id: 'services', label: 'Services' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'video-reviews', label: 'Video Testimonials' },
  { id: 'general', label: 'General Assets' },
];

export const MediaAdmin: React.FC = () => {
  const { showToast } = useToast();
  const [activeFolder, setActiveFolder] = useState<string>('blogs');
  const [items, setItems] = useState<StorageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [bucketExists, setBucketExists] = useState<boolean | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StorageItem | null>(null);
  const [deleteReferences, setDeleteReferences] = useState<string[]>([]);
  const [checkingRefs, setCheckingRefs] = useState(false);
  const [previewItem, setPreviewItem] = useState<StorageItem | null>(null);

  const fetchMedia = useCallback(async (folder: string) => {
    setLoading(true);
    try {
      // Check bucket availability
      const { error: bErr } = await supabase.storage.getBucket(MEDIA_BUCKET);
      if (bErr) {
        setBucketExists(false);
        setItems([]);
        return;
      }
      setBucketExists(true);

      const files = await listStorageMedia(folder);
      setItems(files);
    } catch (err: any) {
      console.warn('Error loading media:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia(activeFolder);
  }, [activeFolder, fetchMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadMediaToStorage(file, { folder: activeFolder as any });
        successCount++;
      }
      showToast(`Uploaded ${successCount} file(s) to ${activeFolder}/`);
      fetchMedia(activeFolder);
    } catch (err: any) {
      showToast(`Upload failed: ${err?.message || err}`, 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  /**
   * Check if this media file is referenced by any records in public tables
   */
  const handleInitiateDelete = async (item: StorageItem) => {
    setDeleteTarget(item);
    setCheckingRefs(true);
    setDeleteReferences([]);

    try {
      const refs: string[] = [];
      const urlToMatch = item.url;

      // 1. Check blogs
      const { data: blogs } = await supabase
        .from('blogs')
        .select('id, title, cover_image, content')
        .or(`cover_image.eq."${urlToMatch}",content.like."%${item.name}%"`)
        .limit(3);
      if (blogs && blogs.length > 0) {
        blogs.forEach((b) => refs.push(`Blog: "${b.title}"`));
      }

      // 2. Check works
      const { data: works } = await supabase
        .from('works')
        .select('id, title, cover_image, gallery')
        .or(`cover_image.eq."${urlToMatch}",gallery.cs.{"${urlToMatch}"}`)
        .limit(3);
      if (works && works.length > 0) {
        works.forEach((w) => refs.push(`Work: "${w.title}"`));
      }

      // 3. Check services
      const { data: services } = await supabase
        .from('services')
        .select('id, title, cover_image, hero_image')
        .or(`cover_image.eq."${urlToMatch}",hero_image.eq."${urlToMatch}"`)
        .limit(3);
      if (services && services.length > 0) {
        services.forEach((s) => refs.push(`Service: "${s.title}"`));
      }

      // 4. Check reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('id, name, photo')
        .eq('photo', urlToMatch)
        .limit(3);
      if (reviews && reviews.length > 0) {
        reviews.forEach((r) => refs.push(`Review: "${r.name}"`));
      }

      // 5. Check video_reviews
      const { data: vReviews } = await supabase
        .from('video_reviews')
        .select('id, name, thumbnail, video_url')
        .or(`thumbnail.eq."${urlToMatch}",video_url.eq."${urlToMatch}"`)
        .limit(3);
      if (vReviews && vReviews.length > 0) {
        vReviews.forEach((vr) => refs.push(`Video Review: "${vr.name}"`));
      }

      setDeleteReferences(refs);
    } catch (refErr) {
      console.warn('Error checking references:', refErr);
    } finally {
      setCheckingRefs(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMediaFromStorage(deleteTarget.path);
      showToast('Media file deleted from cloud storage');
      setItems((prev) => prev.filter((i) => i.path !== deleteTarget.path));
    } catch (err: any) {
      showToast(`Delete failed: ${err?.message || err}`, 'error');
    } finally {
      setDeleteTarget(null);
      setDeleteReferences([]);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('Public CDN URL copied to clipboard!');
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Cloud Media Library
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage media assets stored in Supabase Storage (<code className="font-mono text-app">{MEDIA_BUCKET}</code>)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchMedia(activeFolder)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-3.5 py-2 text-xs font-semibold text-app hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <label className="flex items-center gap-1.5 rounded-xl gradient-brand px-4 py-2 text-xs font-semibold text-white shadow-md cursor-pointer hover:opacity-95 transition-all">
            {uploading ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                <span>Upload to {activeFolder}/</span>
              </>
            )}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm"
              onChange={handleFileUpload}
              disabled={uploading || bucketExists === false}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Bucket Missing Notice */}
      {bucketExists === false && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>Supabase Storage Bucket `{MEDIA_BUCKET}` Not Found</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Please run the Step 11 Storage Setup migration (<code className="text-app">supabase/migrations/20261030000002_storage_setup.sql</code>)
            in the Supabase Dashboard SQL Editor to provision the storage bucket and its public read / admin write policies.
          </p>
        </div>
      )}

      {/* Folder Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-3">
        {FOLDERS.map((f) => {
          const isActive = activeFolder === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFolder(f.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[color:var(--color-brand-blue)] text-white shadow-sm'
                  : 'card-surface text-muted hover:text-app hover:bg-white/5'
              }`}
            >
              <Folder className="h-3.5 w-3.5" />
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Media */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted">
          <RefreshCw className="h-8 w-8 animate-spin text-[color:var(--color-brand-blue)]" />
          <p className="mt-3 text-xs">Loading media assets from cloud storage...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border)] p-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-dim">
            <ImageIcon className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-sm font-semibold text-app">
            No media uploaded in <code className="text-[color:var(--color-brand-blue)] font-mono">{activeFolder}/</code> yet
          </h3>
          <p className="mt-1 text-xs text-muted max-w-sm">
            Use the "Upload to {activeFolder}/" button above or save records with images in this module to see assets here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((item) => {
            const isVid = item.name.match(/\.(mp4|webm|mov)$/i);
            return (
              <div
                key={item.path}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-app-2 transition-all hover:border-[var(--border-strong)] hover:shadow-lg"
              >
                {/* Media Preview Box */}
                <div
                  onClick={() => setPreviewItem(item)}
                  className="relative aspect-square w-full cursor-pointer overflow-hidden bg-black/40 flex items-center justify-center"
                >
                  {isVid ? (
                    <div className="flex flex-col items-center text-muted">
                      <Video className="h-10 w-10 text-[color:var(--color-brand-blue)]" />
                      <span className="text-[10px] mt-1 font-mono uppercase">Video</span>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                      }}
                    />
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewItem(item);
                      }}
                      className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 backdrop-blur-sm"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyUrl(item.url);
                      }}
                      className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 backdrop-blur-sm"
                      title="Copy CDN URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-3 flex flex-col justify-between flex-1">
                  <div>
                    <p className="truncate text-xs font-medium text-app font-mono" title={item.name}>
                      {item.name}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-muted">
                      <span>{formatBytes(item.metadata?.size)}</span>
                      <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-2">
                    <button
                      type="button"
                      onClick={() => copyUrl(item.url)}
                      className="text-[11px] text-[color:var(--color-brand-blue)] hover:underline flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" /> Copy URL
                    </button>

                    <button
                      type="button"
                      onClick={() => handleInitiateDelete(item)}
                      className="text-dim hover:text-red-400 p-1 transition-colors"
                      title="Delete from Storage"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-[var(--border)] bg-app-2 p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <span className="font-mono text-xs text-app truncate max-w-md">{previewItem.name}</span>
              <div className="flex items-center gap-2">
                <a
                  href={previewItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 text-muted hover:text-app transition-colors"
                  title="Open original"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="rounded-lg p-1.5 text-muted hover:text-app transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="mt-4 flex max-h-[70vh] items-center justify-center overflow-hidden rounded-xl bg-black/40">
              {previewItem.name.match(/\.(mp4|webm|mov)$/i) ? (
                <video src={previewItem.url} controls className="max-h-[65vh] w-auto" />
              ) : (
                <img src={previewItem.url} alt={previewItem.name} className="max-h-[65vh] w-auto object-contain" />
              )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted pt-2 border-t border-[var(--border)]">
              <span className="font-mono text-[11px] truncate max-w-lg">{previewItem.url}</span>
              <button
                type="button"
                onClick={() => copyUrl(previewItem.url)}
                className="rounded-xl gradient-brand px-3 py-1 text-xs font-semibold text-white shadow-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation with Reference Check */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Cloud Media Asset?"
        message={
          checkingRefs ? (
            'Checking database references...'
          ) : deleteReferences.length > 0 ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Warning: This file is currently in use!</p>
                  <ul className="mt-1 list-disc pl-4 space-y-0.5">
                    {deleteReferences.map((ref, idx) => (
                      <li key={idx}>{ref}</li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-dim">
                    Deleting it from Supabase Storage will result in broken images or videos on the website.
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted">Are you certain you wish to proceed with permanent deletion?</p>
            </div>
          ) : (
            `Are you sure you want to permanently delete "${deleteTarget?.name}" from ${deleteTarget?.path}? This action cannot be undone.`
          )
        }
        confirmLabel={deleteReferences.length > 0 ? 'Delete Regardless' : 'Delete'}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteReferences([]);
        }}
      />
    </div>
  );
};
