import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, HelpCircle, X } from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminFAQ } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';

export const FAQAdmin: React.FC = () => {
  const { items: faqs, create, update, remove, reorder, toggleStatus } =
    useAdminCollection('faqs');
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [editingFAQ, setEditingFAQ] = useState<AdminFAQ | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminFAQ | null>(null);

  // Form states
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [show, setShow] = useState(true);

  const openCreateForm = () => {
    setEditingFAQ(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setShow(true);
    setIsFormOpen(true);
  };

  const openEditForm = (faq: AdminFAQ) => {
    setEditingFAQ(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category || 'General');
    setShow(faq.show);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      showToast('Question and answer are required', 'error');
      return;
    }

    const data: Partial<AdminFAQ> = {
      question,
      answer,
      category,
      show,
    };

    if (editingFAQ) {
      update(editingFAQ.id, data);
      showToast('FAQ updated successfully');
    } else {
      create(data);
      showToast('New FAQ added successfully');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast('FAQ question deleted');
      setDeleteTarget(null);
    }
  };

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            FAQ Management
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage frequently asked questions, detailed answers and accordion display order
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New FAQ</span>
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
            placeholder="Search FAQs by question or answer keyword..."
            className="w-full rounded-xl border border-[var(--border)] bg-app py-2 pl-9 pr-4 text-xs text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
        </div>
        <span className="text-xs text-dim">
          {filtered.length} {filtered.length === 1 ? 'question' : 'questions'}
        </span>
      </div>

      {/* Sortable FAQ List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No FAQ items found.</p>
        </div>
      ) : (
        <SortableList
          items={filtered}
          onReorder={(ids) => {
            reorder(ids);
            showToast('FAQ display order updated');
          }}
          renderItem={(faq) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--color-brand-blue)]/10 text-[color:var(--color-brand-blue)]">
                  <HelpCircle className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="font-display text-sm font-semibold text-app">
                    {faq.question}
                  </h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(faq.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    faq.show
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                  }`}
                >
                  {faq.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{faq.show ? 'Shown' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(faq)}
                  className="rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(faq)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit FAQ Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <h3 className="font-display text-base font-bold text-app">
                {editingFAQ ? 'Edit FAQ Question' : 'Add New FAQ Question'}
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
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. How long does a typical project take?"
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Detailed Answer *
                </label>
                <textarea
                  rows={5}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide an honest, helpful, and concise answer..."
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app p-3 text-xs text-app focus:border-[color:var(--color-brand-blue)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="General, Pricing, Process"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:outline-none"
                  />
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
                    <option value="show">Visible on Site</option>
                    <option value="hide">Hidden</option>
                  </select>
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
                  {editingFAQ ? 'Save Changes' : 'Add FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete FAQ?"
        message={`Are you sure you want to delete this FAQ question?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
