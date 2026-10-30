import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Video,
  Play,
  Eye,
  EyeOff,
  ExternalLink,
  X,
} from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminVideoReview } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';
import { uploadMediaToStorage } from '../../lib/storageService';

export const VideoReviewsAdmin: React.FC = () => {
  const { items: videoReviews, create, update, remove, reorder, toggleStatus } =
    useAdminCollection('videoReviews');
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<AdminVideoReview | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminVideoReview | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [metric, setMetric] = useState('');
  const [hue, setHue] = useState('#0582D5');
  const [show, setShow] = useState(true);

  const openCreateForm = () => {
    setEditingItem(null);
    setName('');
    setCompany('');
    setVideoUrl('');
    setThumbnail('/brand/work/freshy-cover.jpg');
    setMetric('+140% Growth');
    setHue('#0582D5');
    setShow(true);
    setIsFormOpen(true);
  };

  const openEditForm = (item: AdminVideoReview) => {
    setEditingItem(item);
    setName(item.name);
    setCompany(item.company);
    setVideoUrl(item.videoUrl);
    setThumbnail(item.thumbnail);
    setMetric(item.metric || '');
    setHue(item.hue || '#0582D5');
    setShow(item.show);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) {
      showToast('Client name and company are required', 'error');
      return;
    }

    const data: Partial<AdminVideoReview> = {
      name,
      company,
      videoUrl,
      thumbnail,
      metric,
      hue,
      show,
    };

    if (editingItem) {
      update(editingItem.id, data);
      showToast('Video testimonial updated successfully');
    } else {
      create(data);
      showToast('New video testimonial created');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast(`Removed video review from ${deleteTarget.name}`);
      setDeleteTarget(null);
    }
  };

  const filtered = videoReviews.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Video Testimonials
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage high-conversion client video reviews (YouTube Shorts, YouTube links, or uploaded videos)
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Video Review</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-app-2 p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search video reviews..."
            className="w-full rounded-xl border border-[var(--border)] bg-app py-2 pl-9 pr-4 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
        </div>
        <div className="text-xs text-dim">
          {filtered.length} {filtered.length === 1 ? 'video' : 'videos'}
        </div>
      </div>

      {/* Sortable Video Reviews List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No video testimonials found.</p>
        </div>
      ) : (
        <SortableList
          items={filtered}
          onReorder={(ids) => {
            reorder(ids);
            showToast('Video testimonials reordered');
          }}
          renderItem={(v) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-xl bg-app-2 border border-[var(--border)]">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-[color:var(--color-brand-blue)]/10 text-[color:var(--color-brand-blue)]">
                      <Video className="h-5 w-5" />
                    </div>
                  )}
                  <span className="absolute inset-0 grid place-items-center bg-black/30">
                    <Play className="h-4 w-4 fill-white text-white" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-semibold text-app">{v.name}</h3>
                    <span className="text-xs text-dim">• {v.company}</span>
                    {v.metric && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                        {v.metric}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs text-dim">
                    {v.videoUrl ? (
                      <span className="font-mono text-[11px] truncate max-w-xs text-[color:var(--color-brand-blue)]">
                        {v.videoUrl}
                      </span>
                    ) : (
                      <span className="text-amber-400/80 italic text-[11px]">Placeholder card (No URL yet)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(v.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    v.show
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                  }`}
                >
                  {v.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{v.show ? 'Shown' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(v)}
                  className="rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(v)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <h3 className="font-display text-base font-bold text-app">
                {editingItem ? 'Edit Video Review' : 'Add Video Review'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-dim hover:text-app rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Shaheen Khan"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. CareReach Foundation"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Video URL (YouTube or Cloud Storage MP4)
                  </label>
                  <label className="cursor-pointer text-xs font-semibold text-[color:var(--color-brand-blue)] hover:underline flex items-center gap-1">
                    Upload MP4 / WebM Video
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          showToast('Uploading video file to cloud storage...');
                          const res = await uploadMediaToStorage(file, { folder: 'video-reviews' });
                          setVideoUrl(res.url);
                          showToast('Video uploaded successfully!');
                        } catch (err: any) {
                          showToast('Video upload failed: ' + (err?.message || err), 'error');
                        } finally {
                          e.target.value = '';
                        }
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/shorts/... or https://...supabase.co/.../video.mp4"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app font-mono focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-dim">
                  Paste any YouTube link, Shorts, or direct video URL (or click "Upload MP4 / WebM Video" above).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Key Metric / Tagline
                  </label>
                  <input
                    type="text"
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    placeholder="e.g. +184% Growth or 5x Leads"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Show / Hide Status
                  </label>
                  <select
                    value={show ? 'show' : 'hide'}
                    onChange={(e) => setShow(e.target.value === 'show')}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  >
                    <option value="show">Visible on Website</option>
                    <option value="hide">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Thumbnail image uploader */}
              <ImageUploader
                label="Video Thumbnail Image"
                value={thumbnail}
                onChange={setThumbnail}
                folder="video-reviews"
                helperText="Upload custom portrait 9:16 thumbnail or leave empty to auto-load YouTube poster"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-medium text-muted hover:text-app"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl gradient-brand px-5 py-2 text-xs font-semibold text-white shadow-md"
                >
                  {editingItem ? 'Save Changes' : 'Add Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Video Testimonial?"
        message={`Are you sure you want to remove the video testimonial from ${deleteTarget?.name}?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
