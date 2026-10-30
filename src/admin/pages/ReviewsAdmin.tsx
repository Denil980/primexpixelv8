import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Eye,
  EyeOff,
  User,
  Building,
  Calendar,
  X,
} from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminReview } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';

export const ReviewsAdmin: React.FC = () => {
  const { items: reviews, create, update, remove, reorder, toggleStatus } =
    useAdminCollection('reviews');
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'visible' | 'hidden'>('all');
  const [editingReview, setEditingReview] = useState<AdminReview | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [photo, setPhoto] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [date, setDate] = useState('2026');
  const [show, setShow] = useState(true);

  const openCreateForm = () => {
    setEditingReview(null);
    setName('');
    setCompany('');
    setRole('');
    setPhoto('');
    setRating(5);
    setReviewText('');
    setDate('2026');
    setShow(true);
    setIsFormOpen(true);
  };

  const openEditForm = (review: AdminReview) => {
    setEditingReview(review);
    setName(review.name);
    setCompany(review.company);
    setRole(review.role || '');
    setPhoto(review.photo || '');
    setRating(review.rating);
    setReviewText(review.reviewText);
    setDate(review.date || '2026');
    setShow(review.show);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) {
      showToast('Client name and review text are required', 'error');
      return;
    }

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const data: Partial<AdminReview> = {
      name,
      company,
      role,
      photo,
      initials,
      rating,
      reviewText,
      date,
      show,
    };

    if (editingReview) {
      update(editingReview.id, data);
      showToast('Review updated successfully');
    } else {
      create(data);
      showToast('New client review added successfully');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast(`Deleted review from "${deleteTarget.name}"`);
      setDeleteTarget(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.company.toLowerCase().includes(search.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(search.toLowerCase());

    const matchesVisibility =
      filterVisibility === 'all'
        ? true
        : filterVisibility === 'visible'
        ? r.show
        : !r.show;

    return matchesSearch && matchesVisibility;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Text Reviews & Testimonials
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage client testimonials shown in the sliders, review grids, and trust sections
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Client Review</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-app-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews by client name, company or text..."
            className="w-full rounded-xl border border-[var(--border)] bg-app py-2 pl-9 pr-4 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-2.5 py-1.5 text-xs text-muted">
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value as any)}
              className="bg-transparent text-app focus:outline-none"
            >
              <option value="all">All ({reviews.length})</option>
              <option value="visible">Visible Only ({reviews.filter((r) => r.show).length})</option>
              <option value="hidden">Hidden Only ({reviews.filter((r) => !r.show).length})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sortable Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No reviews match your query.</p>
        </div>
      ) : (
        <SortableList
          items={filteredReviews}
          onReorder={(ids) => {
            reorder(ids);
            showToast('Reviews order updated');
          }}
          renderItem={(r) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Photo / Avatar */}
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[var(--surface-solid)] border border-[var(--border)] grid place-items-center">
                  {r.photo ? (
                    <img src={r.photo} alt={r.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-xs font-bold text-[color:var(--color-brand-blue)]">
                      {r.initials || r.name.substring(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm font-semibold text-app truncate max-w-[200px]">{r.name}</h3>
                    <span className="text-xs text-dim truncate max-w-[180px]">• {r.company}</span>
                    {r.role && <span className="text-[11px] text-dim truncate max-w-[150px]">({r.role})</span>}

                    {/* Star rating */}
                    <div className="flex items-center text-amber-400 shrink-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-dim opacity-30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mt-1 text-xs text-muted line-clamp-2 italic break-all">
                    "{r.reviewText}"
                  </p>
                </div>
              </div>

              {/* Actions & Show/Hide status */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center ml-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(r.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    r.show
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                  }`}
                  title={r.show ? 'Currently visible on site' : 'Currently hidden'}
                >
                  {r.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{r.show ? 'Shown' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(r)}
                  className="rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(r)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Delete review"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit Review Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-xl rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <h3 className="font-display text-base font-bold text-app">
                {editingReview ? 'Edit Client Review' : 'Add Client Review'}
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
                    placeholder="e.g. Zaid Khan"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Freshy Fruits"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. CEO or Founder"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Rating (1 - 5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                    <option value={3}>⭐⭐⭐ 3 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Display Status
                  </label>
                  <select
                    value={show ? 'show' : 'hide'}
                    onChange={(e) => setShow(e.target.value === 'show')}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  >
                    <option value="show">Visible on Site</option>
                    <option value="hide">Hidden</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Client Review / Testimonial Quote *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Paste what the client said about their experience with PrimeXPixel..."
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app p-3 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                />
              </div>

              {/* Client Photo Upload */}
              <ImageUploader
                label="Client Photo (Optional - Leave empty to use initials)"
                value={photo}
                onChange={setPhoto}
                folder="reviews"
                helperText="Square 1:1 image recommended"
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
                  {editingReview ? 'Save Changes' : 'Add Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Testimonial?"
        message={`Are you sure you want to remove the testimonial from ${deleteTarget?.name} (${deleteTarget?.company})?`}
        confirmLabel="Delete Review"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
