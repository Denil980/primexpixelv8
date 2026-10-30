import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Video,
  ExternalLink,
} from 'lucide-react';
import {
  replaceMediaInStorage,
  deleteMediaFromStorage,
  validateMediaFile,
  isStorageUrl,
} from '../../lib/storageService';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: 'blogs' | 'works' | 'reviews' | 'services' | 'video-reviews' | 'general';
  helperText?: string;
  maxDimension?: number;
  quality?: number;
  acceptVideo?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  folder = 'general',
  helperText,
  maxDimension = 1600,
  quality = 0.82,
  acceptVideo = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: string;
    compressedSize: string;
    reductionPercent: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultHelper = acceptVideo
    ? 'Upload JPEG, PNG, WebP image or MP4/WebM video. Images auto-converted to WebP.'
    : 'Upload JPEG, PNG or WebP. Automatically converted to optimized WebP.';

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = async (file: File) => {
    setError(null);
    setCompressionStats(null);

    // Validation
    const allowed = acceptVideo
      ? [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'image/svg+xml',
          'video/mp4',
          'video/webm',
          'video/quicktime',
        ]
      : ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

    const validation = validateMediaFile(file, allowed, acceptVideo ? 50 * 1024 * 1024 : 15 * 1024 * 1024);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Instant local preview
    const tempPreview = URL.createObjectURL(file);
    setLocalPreview(tempPreview);
    setUploading(true);
    setUploadProgress(15);

    try {
      const result = await replaceMediaInStorage(value, file, {
        folder,
        maxDimension,
        quality,
        onProgress: (p) => setUploadProgress(p),
      });

      onChange(result.url);

      if (result.compression) {
        setCompressionStats({
          originalSize: formatSize(result.compression.originalSize),
          compressedSize: formatSize(result.compression.compressedSize),
          reductionPercent: result.compression.reductionPercent,
        });
      }
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Check Supabase Storage bucket status.');
      setLocalPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(tempPreview);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value && isStorageUrl(value)) {
      try {
        await deleteMediaFromStorage(value);
      } catch (err: any) {
        console.warn('Could not remove file from storage:', err.message);
      }
    }
    onChange('');
    setLocalPreview(null);
    setCompressionStats(null);
  };

  const currentMediaUrl = localPreview || value;
  const isVideo = currentMediaUrl?.match(/\.(mp4|webm|mov)(\?.*)?$/i) || currentMediaUrl?.startsWith('data:video/');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-[color:var(--color-brand-blue)] hover:underline"
        >
          {showUrlInput ? 'Upload to Cloud Storage' : 'Paste Direct URL / Path'}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/brand/work/example.jpg or https://..."
            className="w-full rounded-xl border border-[var(--border)] bg-app px-3.5 py-2.5 text-sm text-app placeholder-dim focus:border-[color:var(--color-brand-blue)] focus:outline-none transition-colors"
          />
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-dim hover:text-red-400"
              title="Clear"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? 'border-[color:var(--color-brand-blue)] bg-[color:var(--color-brand-blue)]/10 scale-[0.99]'
              : 'border-[var(--border)] hover:border-[var(--border-strong)] bg-app/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={
              acceptVideo
                ? 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,video/quicktime'
                : 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'
            }
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3 py-4 w-full max-w-xs">
              <RefreshCw className="h-8 w-8 animate-spin text-[color:var(--color-brand-blue)]" />
              <p className="text-sm font-medium text-app">Uploading to Cloud Storage...</p>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="gradient-brand h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted font-mono">{uploadProgress}% complete</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--surface-solid)] text-[color:var(--color-brand-blue)] shadow-sm group-hover:scale-110 transition-transform">
                {acceptVideo ? <Video className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
              </div>
              <p className="text-sm font-medium text-app">
                <span className="text-[color:var(--color-brand-blue)] font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-dim">{helperText || defaultHelper}</p>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Compression stats banner */}
      {compressionStats && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              WebP Optimized: {compressionStats.originalSize} → {compressionStats.compressedSize}
            </span>
          </div>
          {compressionStats.reductionPercent > 0 && (
            <span className="font-semibold">{compressionStats.reductionPercent}% smaller</span>
          )}
        </div>
      )}

      {/* Preview Card */}
      {currentMediaUrl && (
        <div className="relative mt-2 overflow-hidden rounded-xl border border-[var(--border)] bg-app-2 p-2">
          <div className="relative flex aspect-video max-h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-black/20">
            {isVideo ? (
              <video
                src={currentMediaUrl}
                controls
                className="h-full w-full object-contain"
              />
            ) : (
              <img
                src={currentMediaUrl}
                alt="Preview"
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
                }}
              />
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-600 transition-colors shadow-lg"
              title="Remove media"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted">
            <span className="flex items-center gap-1.5 truncate max-w-[280px]">
              <ImageIcon className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-brand-blue)]" />
              <span className="truncate font-mono text-[10px]">{currentMediaUrl}</span>
            </span>
            {isStorageUrl(currentMediaUrl) ? (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="h-3 w-3" /> Supabase Storage
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-dim">
                <ExternalLink className="h-3 w-3" /> Static / External
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
