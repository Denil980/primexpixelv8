import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-app-2 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                isDestructive
                  ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                  : 'bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]'
              }`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-app">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-dim hover:text-app p-1 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-muted hover:text-app hover:bg-white/5 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition-all shadow-md ${
                isDestructive
                  ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                  : 'gradient-brand hover:opacity-90'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
