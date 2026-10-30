import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  Code2,
  RefreshCw,
} from 'lucide-react';
import { uploadMediaToStorage } from '../../lib/storageService';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  value,
  onChange,
  label = 'Content',
  placeholder = 'Write blog content here...',
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'html'>('edit');
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const insertTag = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleInsertHeading = (level: 2 | 3) => {
    insertTag(`<h${level}>`, `</h${level}>\n`);
  };

  const handleInsertLink = () => {
    const url = prompt('Enter link URL (e.g. https://...):', 'https://');
    if (url) {
      insertTag(`<a href="${url}" target="_blank" rel="noopener noreferrer">`, '</a>');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await uploadMediaToStorage(file, { folder: 'blogs' });
      insertTag(`\n<img src="${result.url}" alt="${file.name.replace(/\.[^/.]+$/, '')}" class="rounded-2xl my-6 w-full object-cover" />\n`, '');
    } catch (err: any) {
      alert(`Image upload failed: ${err?.message || err}`);
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-app p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
              viewMode === 'edit'
                ? 'bg-[var(--surface-solid)] text-[color:var(--color-brand-blue)] shadow-sm'
                : 'text-dim hover:text-app'
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Visual
          </button>
          <button
            type="button"
            onClick={() => setViewMode('html')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
              viewMode === 'html'
                ? 'bg-[var(--surface-solid)] text-[color:var(--color-brand-blue)] shadow-sm'
                : 'text-dim hover:text-app'
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            HTML
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${
              viewMode === 'preview'
                ? 'bg-[var(--surface-solid)] text-emerald-400 shadow-sm'
                : 'text-dim hover:text-app'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Live Preview
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-app-2 shadow-sm transition-all focus-within:border-[color:var(--color-brand-blue)]">
        {/* Editor Toolbar */}
        {viewMode !== 'preview' && (
          <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border)] bg-app/60 p-2 text-muted">
            <button
              type="button"
              onClick={() => insertTag('<strong>', '</strong>')}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<em>', '</em>')}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<u>', '</u>')}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </button>

            <span className="h-4 w-[1px] bg-[var(--border)] mx-1" />

            <button
              type="button"
              onClick={() => handleInsertHeading(2)}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Heading 2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleInsertHeading(3)}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Heading 3"
            >
              <Heading3 className="h-4 w-4" />
            </button>

            <span className="h-4 w-[1px] bg-[var(--border)] mx-1" />

            <button
              type="button"
              onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Bulleted List"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<ol>\n  <li>', '</li>\n</ol>')}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<blockquote>', '</blockquote>')}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Quote"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<code>', '</code>')}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Code"
            >
              <Code className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleInsertLink}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors"
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </button>

            {/* Cloud Image Upload */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => imageInputRef.current?.click()}
              className="rounded-lg p-1.5 hover:bg-white/10 hover:text-app transition-colors disabled:opacity-50"
              title="Upload & Insert Cloud Image (WebP Optimized)"
            >
              {uploadingImage ? (
                <RefreshCw className="h-4 w-4 animate-spin text-[color:var(--color-brand-blue)]" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </button>

            <div className="ml-auto text-[11px] text-dim pr-1">
              {value ? `${value.replace(/<[^>]*>/g, '').trim().split(/\s+/).length} words` : '0 words'}
            </div>
          </div>
        )}

        {/* Editor Body */}
        {viewMode === 'preview' ? (
          <div className="min-h-[300px] max-h-[500px] overflow-y-auto p-6 bg-app">
            <div
              className="prose prose-invert max-w-none text-app space-y-4"
              dangerouslySetInnerHTML={{ __html: value || '<p className="text-dim italic">No content to preview.</p>' }}
            />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            rows={12}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-y bg-transparent p-4 font-mono text-sm leading-relaxed text-app placeholder-dim focus:outline-none"
          />
        )}
      </div>
    </div>
  );
};
