import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
  maxDimension?: number;
  quality?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  helperText = 'Upload JPEG, PNG or WebP. Automatically compressed to WebP.',
  maxDimension = 1600,
  quality = 0.82,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: string;
    compressedSize: string;
    reductionPercent: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const processFile = async (file: File) => {
    setError(null);
    setCompressionStats(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError(`Unsupported file type: ${file.type || 'unknown'}. Please choose JPEG, PNG or WebP.`);
      return;
    }

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError(`File is too large (${formatSize(file.size)}). Maximum allowed size is 15 MB.`);
      return;
    }

    // SVG / GIF can be used directly without raster compression
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
        setCompressionStats({
          originalSize: formatSize(file.size),
          compressedSize: formatSize(file.size),
          reductionPercent: 0,
        });
      };
      reader.readAsDataURL(file);
      return;
    }

    setCompressing(true);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setError('Failed to process image on device canvas.');
          setCompressing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Approximate base64 to byte size
        const compressedBytes = Math.round((webpDataUrl.length * 3) / 4);
        const originalBytes = file.size;
        const reduction = Math.max(
          0,
          Math.round(((originalBytes - compressedBytes) / originalBytes) * 100)
        );

        onChange(webpDataUrl);
        setCompressionStats({
          originalSize: formatSize(originalBytes),
          compressedSize: formatSize(compressedBytes),
          reductionPercent: reduction,
        });
        setCompressing(false);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setError('Failed to read and process image file.');
        setCompressing(false);
      };

      img.src = objectUrl;
    } catch (e: any) {
      setError(e?.message || 'Error occurred while compressing image.');
      setCompressing(false);
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
          {showUrlInput ? 'Upload File' : 'Paste Direct URL / Path'}
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
              onClick={() => onChange('')}
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
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            className="hidden"
          />

          {compressing ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <RefreshCw className="h-8 w-8 animate-spin text-[color:var(--color-brand-blue)]" />
              <p className="text-sm font-medium text-app">Compressing to WebP...</p>
              <p className="text-xs text-muted">Optimizing resolution & file size</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--surface-solid)] text-[color:var(--color-brand-blue)] shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-app">
                <span className="text-[color:var(--color-brand-blue)] font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-dim">{helperText}</p>
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
              WebP Compressed: {compressionStats.originalSize} → {compressionStats.compressedSize}
            </span>
          </div>
          {compressionStats.reductionPercent > 0 && (
            <span className="font-semibold">{compressionStats.reductionPercent}% smaller</span>
          )}
        </div>
      )}

      {/* Preview Card */}
      {value && (
        <div className="relative mt-2 overflow-hidden rounded-xl border border-[var(--border)] bg-app-2 p-2">
          <div className="relative flex aspect-video max-h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-black/20">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/brand/mark-square.png';
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
                setCompressionStats(null);
              }}
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-red-600 transition-colors shadow-lg"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted">
            <span className="flex items-center gap-1.5 truncate max-w-[260px]">
              <ImageIcon className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-brand-blue)]" />
              <span className="truncate">{value.startsWith('data:') ? 'Base64 WebP Asset' : value}</span>
            </span>
            <span className="shrink-0 text-emerald-400 font-medium">Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};
