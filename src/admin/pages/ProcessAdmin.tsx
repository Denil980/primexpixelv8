import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, GitCommit, X } from 'lucide-react';
import { useAdminCollection } from '../db';
import type { AdminProcessStep } from '../types';
import { IconPicker, renderLucideIcon } from '../components/IconPicker';
import { ConfirmModal } from '../components/ConfirmModal';
import { SortableList } from '../components/SortableList';
import { useToast } from '../components/Toast';

export const ProcessAdmin: React.FC = () => {
  const { items: processSteps, create, update, remove, reorder, toggleStatus } =
    useAdminCollection('process');
  const { showToast } = useToast();

  const [editingStep, setEditingStep] = useState<AdminProcessStep | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminProcessStep | null>(null);

  // Form states
  const [stepNumber, setStepNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [icon, setIcon] = useState('Compass');
  const [show, setShow] = useState(true);

  const openCreateForm = () => {
    setEditingStep(null);
    setStepNumber(processSteps.length + 1);
    setTitle('');
    setShortDesc('');
    setIcon('Compass');
    setShow(true);
    setIsFormOpen(true);
  };

  const openEditForm = (step: AdminProcessStep) => {
    setEditingStep(step);
    setStepNumber(step.stepNumber);
    setTitle(step.title);
    setShortDesc(step.shortDesc);
    setIcon(step.icon || 'Compass');
    setShow(step.show);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !shortDesc.trim()) {
      showToast('Step title and description are required', 'error');
      return;
    }

    const data: Partial<AdminProcessStep> = {
      stepNumber: Number(stepNumber),
      title,
      shortDesc,
      icon,
      show,
    };

    if (editingStep) {
      update(editingStep.id, data);
      showToast('Process step updated successfully');
    } else {
      create(data);
      showToast('New process step added');
    }

    setIsFormOpen(false);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      remove(deleteTarget.id);
      showToast(`Removed step "${deleteTarget.title}"`);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-app">
            Our Process Management
          </h2>
          <p className="mt-1 text-xs text-muted">
            Manage the sequential workflow steps shown on the Home and Process sections
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl gradient-brand px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Process Step</span>
        </button>
      </div>

      {processSteps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-sm font-medium text-muted">No process steps found.</p>
        </div>
      ) : (
        <SortableList
          items={processSteps}
          onReorder={(ids) => {
            reorder(ids);
            showToast('Process sequence updated');
          }}
          renderItem={(step) => (
            <div className="flex flex-col gap-3 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-app border border-[var(--border)] text-[color:var(--color-brand-green)]">
                  {renderLucideIcon(step.icon, 'h-5 w-5')}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[color:var(--color-brand-blue)]">
                      Step 0{step.order || step.stepNumber}
                    </span>
                    <h3 className="font-display text-sm font-semibold text-app">{step.title}</h3>
                  </div>
                  <p className="mt-0.5 text-xs text-muted line-clamp-1">{step.shortDesc}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(step.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${
                    step.show
                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400'
                  }`}
                >
                  {step.show ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  <span>{step.show ? 'Shown' : 'Hidden'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditForm(step)}
                  className="rounded-xl border border-[var(--border)] bg-app px-3 py-1.5 text-xs font-medium text-muted hover:border-[color:var(--color-brand-blue)] hover:text-app transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(step)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        />
      )}

      {/* Add / Edit Step Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="my-8 w-full max-w-lg rounded-3xl border border-[var(--border-strong)] bg-app-2 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4 bg-app/50">
              <h3 className="font-display text-base font-bold text-app">
                {editingStep ? 'Edit Process Step' : 'Add Process Step'}
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
                    Step Number
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={stepNumber}
                    onChange={(e) => setStepNumber(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                    Step Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Discover or Strategy"
                    className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app px-3 py-2 text-xs text-app focus:outline-none"
                  />
                </div>
              </div>

              {/* Icon Selector */}
              <IconPicker value={icon} onChange={setIcon} label="Step Icon" />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Explain what happens in this stage..."
                  className="mt-1 w-full rounded-xl border border-[var(--border)] bg-app p-2.5 text-xs text-app focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Visibility
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
                  {editingStep ? 'Save Changes' : 'Add Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Process Step?"
        message={`Are you sure you want to remove the "${deleteTarget?.title}" step?`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
