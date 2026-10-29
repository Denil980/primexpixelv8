import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Hash, MapPin, X } from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminSiteNumber } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';

const PRESET_LOCATIONS = [
  'Home Hero Statistics',
  'About Intro Metrics',
  'Results & Trust Bar',
  'Global Trust Counters',
];

export const SiteNumbersAdmin: React.FC = () => {
  const { items: siteNumbers, create, update, remove, reorder, toggleStatus } =
    useAdminCollection('siteNumbers');
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<AdminSiteNumber | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminSiteNumber | null>(null);

  // Form states
  const [label, setLabel] = useState('');
  const [value, setValue] = useState<number>(100);
  const [suffix, setSuffix] = useState('+');
  const [location, setLocation] = useState(PRESET_LOCATIONS[0]);
  const [show, setShow] = useState(true);

  const openCreateForm = () => {
    setEditingItem(null);
    setLabel('');
    setValue(50);
    setSuffix('+');
    setLocation(PRESET_LOCATIONS[0]);
    setShow(true);
    setIsFormOpen(true);
  };

  const openEditForm = (item: AdminSiteNumber) => {
    setEditingItem(item);
    setLabel(item.label);
    setValue(item.value);
    setSuffix(item.suffix || '');
    setLocation(item.location || PRESET_LOCATIONS[0]);
    setShow(item.show);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      showToast('Statistic label is required', 'error');
      return;
    }

    const data: Partial<AdminSiteNumber> = {
      label,
      value: Number(value),
      suffix,
      location,
      show,
    };

    if (editingItem) {
      update(editingItem.id, data);
      showToast('Statistic updated successfully');
    } else {
      create(data);
      showToast('New site statistic created');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast(`Removed counter "${deleteTarget.label}"`);
      setDeleteTarget(null);
    }
  };

  const locations = Array.from(new Set(siteNumbers.map((s) => s.location))).filter(Boolean);

  const filtered = siteNumbers.filter((s) => {
    const matchesSearch =
      s.label.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchesLoc = locationFilter === 'all' || s.location === locationFilter;
    return matchesSearch && matchesLoc;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Site Numbers & Statistics
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage every hardcoded counter across Home Hero, About Intro, and Results bars
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Statistic</span>
        </button>
      </div>

      {/* Info Callout */}
      <div className="rounded-2xl border border-[color:var(--color-brand-blue)]/20 bg-[color:var(--color-brand-blue)]/10 p-4 text-xs text-[color:var(--color-brand-blue)]">
        <div>
          <span className="font-semibold">Centralized Number Control:</span> All statistics shown
          across the website can be modified here. The front-end counting animations will smoothly
          animate to whatever target number and suffix you configure.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-app-2 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search statistics by label or location..."
            className="w-full rounded-xl border border-[var(--border)] bg-app py-2 pl-9 pr-4 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-app px-2.5 py-1.5 text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 text-dim" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-transparent text-app focus:outline-none"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-dim">{filtered.length} counters</span>
        </div>
      </div>

      {/* Sortable Site Numbers List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No site statistics found.</p>
        </div>
      ) : (
        <SortableList
          items={filtered}
          onReorder={(ids) => {
            reorder(ids);
            showToast('Site numbers display order updated');
          }}
          renderItem={(stat) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Visual Number Badge */}
                <div className="flex h-14 min-w-[5.5rem] flex-col items-center justify-center rounded-xl bg-app border border-[var(--border)] px-3 text-center">
                  <span className="font-display text-xl font-bold gradient-text leading-none">
                    {stat.value}{stat.suffix}
                  </span>
                  <span className="mt-1 text-[9px] uppercase tracking-wider text-dim truncate max-w-[5rem]">
                    {stat.label}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-sm font-semibold text-app">{stat.label}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-app px-2 py-0.5 text-[10px] font-medium text-dim border border-[var(--border)]">
                      <MapPin className="h-2.5 w-2.5 text-[color:var(--color-brand-blue)]" />
                      {stat.location}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-muted">
                    Value: <span className="font-mono font-semibold text-app">{stat.value}</span> |
                    Suffix: <span className="font-mono font-semibold text-app">{stat.suffix || 'None'}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(stat.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    stat.show
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                  }`}
                >
                  {stat.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{stat.show ? 'Active' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(stat)}
                  className="rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(stat)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit Statistic Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <h3 className="font-display text-base font-bold text-app">
                {editingItem ? 'Edit Site Statistic' : 'Add New Statistic'}
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
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Metric Label *
                </label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Projects Delivered or Happy Clients"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Numeric Target Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    placeholder="100"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs font-mono font-bold text-app focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Suffix Symbol
                  </label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="+, %, K, /7"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs font-mono text-app focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Where it Appears on Website *
                </label>
                <input
                  type="text"
                  required
                  list="locations-list"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Home Hero Statistics"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:outline-none"
                />
                <datalist id="locations-list">
                  {PRESET_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
                <p className="mt-1 text-[11px] text-dim">
                  Choose from existing placements or type a custom section label
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Display Status
                </label>
                <select
                  value={show ? 'show' : 'hide'}
                  onChange={(e) => setShow(e.target.value === 'show')}
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:outline-none"
                >
                  <option value="show">Active (Visible)</option>
                  <option value="hide">Hidden</option>
                </select>
              </div>

              {/* Live Preview of how the counter looks */}
              <div className="rounded-2xl border border-[var(--border)] bg-app p-4 text-center">
                <span className="text-[10px] uppercase tracking-wider text-dim block mb-1">
                  Front-End Counter Preview
                </span>
                <div className="font-display text-3xl font-bold gradient-text">
                  {value}{suffix}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted mt-1">
                  {label || 'Metric Label'}
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
                  {editingItem ? 'Save Changes' : 'Add Statistic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Statistic?"
        message={`Are you sure you want to remove "${deleteTarget?.label}" (${deleteTarget?.value}${deleteTarget?.suffix})?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
