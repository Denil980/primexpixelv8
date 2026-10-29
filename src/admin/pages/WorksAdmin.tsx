import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Briefcase,
  ExternalLink,
  Layers,
  X,
  PlusCircle,
} from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminWorkItem } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';

const WORK_CATEGORIES = ['Website', 'UI/UX', 'Logo', 'Social Media', 'Video Editing'];

export const WorksAdmin: React.FC = () => {
  const { items: works, create, update, remove, reorder, toggleStatus } =
    useAdminCollection('works');
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingWork, setEditingWork] = useState<AdminWorkItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminWorkItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState('Website');
  const [coverImage, setCoverImage] = useState('');
  const [galleryInput, setGalleryInput] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [description, setDescription] = useState('');
  const [challenge, setChallenge] = useState('');
  const [approach, setApproach] = useState('');
  const [outcome, setOutcome] = useState('');
  const [liveLink, setLiveLink] = useState('https://primexpixel.com');
  const [techInput, setTechInput] = useState('');
  const [year, setYear] = useState('2026');
  const [show, setShow] = useState(true);

  // Results metrics
  const [metric1Label, setMetric1Label] = useState('Orders');
  const [metric1Value, setMetric1Value] = useState('+142%');
  const [metric2Label, setMetric2Label] = useState('Lighthouse');
  const [metric2Value, setMetric2Value] = useState('99/100');

  const openCreateForm = () => {
    setEditingWork(null);
    setTitle('');
    setSlug('');
    setClient('');
    setCategory('Website');
    setCoverImage('/brand/work/freshy-cover.jpg');
    setGalleryInput(['/brand/work/freshy-hero.jpg']);
    setNewGalleryUrl('');
    setDescription('');
    setChallenge('');
    setApproach('');
    setOutcome('');
    setLiveLink('https://primexpixel.com');
    setTechInput('React, Tailwind CSS, TypeScript, Vite');
    setYear('2026');
    setShow(true);
    setMetric1Label('Growth');
    setMetric1Value('+150%');
    setMetric2Label('Performance');
    setMetric2Value('99/100');
    setIsFormOpen(true);
  };

  const openEditForm = (work: AdminWorkItem) => {
    setEditingWork(work);
    setTitle(work.title);
    setSlug(work.slug);
    setClient(work.client);
    setCategory(work.category);
    setCoverImage(work.coverImage);
    setGalleryInput(work.gallery || []);
    setNewGalleryUrl('');
    setDescription(work.description || '');
    setChallenge(work.challenge || '');
    setApproach(work.approach || '');
    setOutcome(work.outcome || '');
    setLiveLink(work.liveLink || '');
    setTechInput((work.tech || []).join(', '));
    setYear(work.year || '2026');
    setShow(work.show);

    const r1 = work.results?.[0] || { label: 'Metric', value: '+100%' };
    const r2 = work.results?.[1] || { label: 'Speed', value: '98/100' };
    setMetric1Label(r1.label);
    setMetric1Value(r1.value);
    setMetric2Label(r2.label);
    setMetric2Value(r2.value);

    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingWork) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (url.trim()) {
      setGalleryInput((prev) => [...prev, url.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryInput((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      showToast('Project title and client name are required', 'error');
      return;
    }

    const tech = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const results = [
      { label: metric1Label, value: metric1Value },
      { label: metric2Label, value: metric2Value },
    ].filter((r) => r.label && r.value);

    const data: Partial<AdminWorkItem> = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      client,
      category,
      coverImage,
      gallery: galleryInput,
      description: description || outcome || challenge,
      challenge,
      approach,
      outcome,
      liveLink,
      tech,
      year,
      results,
      show,
    };

    if (editingWork) {
      update(editingWork.id, data);
      showToast('Portfolio project updated successfully');
    } else {
      create(data);
      showToast('New portfolio project added successfully');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast(`Deleted project "${deleteTarget.title}"`);
      setDeleteTarget(null);
    }
  };

  const filtered = works.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.client.toLowerCase().includes(search.toLowerCase()) ||
      w.category.toLowerCase().includes(search.toLowerCase());

    const matchesCat = categoryFilter === 'all' || w.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Our Works / Portfolio Management
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage case studies, client portfolio items, gallery images and live results
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Work Project</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-app-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, client or tech..."
            className="w-full rounded-xl border border-[var(--border)] bg-app py-2 pl-9 pr-4 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-2.5 py-1.5 text-xs text-muted">
            <Filter className="h-3.5 w-3.5 text-dim" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-app focus:outline-none"
            >
              <option value="all">All Categories</option>
              {WORK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-dim">
            {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </div>

      {/* Sortable Works List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No portfolio projects found.</p>
        </div>
      ) : (
        <SortableList
          items={filtered}
          onReorder={(ids) => {
            reorder(ids);
            showToast('Works portfolio order updated');
          }}
          renderItem={(w) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-app border border-[var(--border)]">
                  {w.coverImage ? (
                    <img
                      src={w.coverImage}
                      alt={w.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                      }}
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-[10px] text-dim">
                      No cover
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[color:var(--color-brand-blue)]/10 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-brand-blue)] border border-[color:var(--color-brand-blue)]/20">
                      {w.category}
                    </span>
                    <span className="text-xs text-dim">• Client: {w.client}</span>
                    <span className="text-xs text-dim">• {w.year}</span>
                  </div>

                  <h3 className="font-display text-sm font-semibold text-app mt-0.5">
                    {w.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {(w.tech || []).slice(0, 3).map((t: string) => (
                      <span key={t} className="rounded bg-app px-1.5 py-0.5 text-[9px] text-muted border border-[var(--border)]">
                        {t}
                      </span>
                    ))}
                    {(w.tech || []).length > 3 && (
                      <span className="text-[9px] text-dim">+{w.tech.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(w.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    w.show
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                  }`}
                >
                  {w.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{w.show ? 'Shown' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(w)}
                  className="rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(w)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit Project Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-3xl rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <h3 className="font-display text-base font-bold text-app">
                {editingWork ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-dim hover:text-app rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Freshy Fruits"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Freshy Fruits Co."
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  >
                    {WORK_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Year / Timeline
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2025 - 2026"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Status
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
                  Technologies / Tools Used (comma separated)
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="React, Next.js, Tailwind CSS, Stripe"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Live Project URL
                </label>
                <input
                  type="text"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app font-mono focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                />
              </div>

              {/* Cover image uploader */}
              <ImageUploader
                label="Cover Image (Auto-Compressed to WebP)"
                value={coverImage}
                onChange={setCoverImage}
                helperText="Primary banner / thumbnail for portfolio grid"
              />

              {/* Gallery Images */}
              <div className="space-y-2 rounded-2xl border border-[var(--border)] bg-app p-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Gallery Images ({galleryInput.length})
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Enter image URL or asset path..."
                    className="flex-1 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-app focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddGalleryImage(newGalleryUrl)}
                    className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-app hover:bg-white/15"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Image
                  </button>
                </div>

                {galleryInput.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {galleryInput.map((img, idx) => (
                      <div key={idx} className="relative group aspect-video rounded-lg overflow-hidden border border-[var(--border)] bg-black/30">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1 right-1 rounded-full bg-red-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Challenge & Approach */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    The Challenge
                  </label>
                  <textarea
                    rows={3}
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    placeholder="What problem did the client face?"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app p-2.5 text-xs text-app focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Our Approach & Solution
                  </label>
                  <textarea
                    rows={3}
                    value={approach}
                    onChange={(e) => setApproach(e.target.value)}
                    placeholder="How did PrimeXPixel solve it?"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app p-2.5 text-xs text-app focus:outline-none"
                  />
                </div>
              </div>

              {/* Key Results / Metrics */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 space-y-3">
                <span className="text-xs font-semibold text-emerald-400">Project Results & Metrics</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={metric1Label}
                      onChange={(e) => setMetric1Label(e.target.value)}
                      placeholder="e.g. Online orders"
                      className="w-1/2 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-app"
                    />
                    <input
                      type="text"
                      value={metric1Value}
                      onChange={(e) => setMetric1Value(e.target.value)}
                      placeholder="e.g. +142%"
                      className="w-1/2 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-emerald-400 font-bold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={metric2Label}
                      onChange={(e) => setMetric2Label(e.target.value)}
                      placeholder="e.g. Lighthouse"
                      className="w-1/2 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-app"
                    />
                    <input
                      type="text"
                      value={metric2Value}
                      onChange={(e) => setMetric2Value(e.target.value)}
                      placeholder="e.g. 99/100"
                      className="w-1/2 rounded-xl border border-[var(--border)] bg-app-2 px-3 py-1.5 text-xs text-emerald-400 font-bold"
                    />
                  </div>
                </div>
              </div>

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
                  {editingWork ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Portfolio Project?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
