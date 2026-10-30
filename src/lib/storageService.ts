import { supabase } from './supabase';

export const MEDIA_BUCKET = 'primexpixel-media';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
  compression?: {
    originalSize: number;
    compressedSize: number;
    reductionPercent: number;
  };
}

export interface UploadOptions {
  folder?: 'blogs' | 'works' | 'reviews' | 'services' | 'video-reviews' | 'general';
  maxDimension?: number;
  quality?: number;
  onProgress?: (progress: number) => void;
}

/**
 * Checks if a URL or path is a Supabase Storage asset belonging to our media bucket.
 */
export function isStorageUrl(urlOrPath: string): boolean {
  if (!urlOrPath) return false;
  return urlOrPath.includes(`/storage/v1/object/public/${MEDIA_BUCKET}/`) ||
    urlOrPath.includes(`/${MEDIA_BUCKET}/`);
}

/**
 * Extracts the storage relative path (e.g. 'blogs/1730000000-image.webp') from a public URL.
 */
export function extractStoragePath(urlOrPath: string): string | null {
  if (!urlOrPath) return null;
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const idx = urlOrPath.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(urlOrPath.substring(idx + marker.length));
  }
  if (urlOrPath.startsWith(`${MEDIA_BUCKET}/`)) {
    return urlOrPath.substring(MEDIA_BUCKET.length + 1);
  }
  return null;
}

/**
 * Validates a file before upload.
 */
export function validateMediaFile(file: File, allowedTypes?: string[], maxBytes: number = 50 * 1024 * 1024): { valid: boolean; error?: string } {
  const defaultAllowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
  ];

  const types = allowedTypes || defaultAllowed;
  if (!types.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format: ${file.type || 'unknown'}. Allowed: JPEG, PNG, WebP, GIF, SVG, MP4, WebM.`,
    };
  }

  if (file.size > maxBytes) {
    const mbLimit = Math.round(maxBytes / (1024 * 1024));
    return {
      valid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${mbLimit} MB.`,
    };
  }

  return { valid: true };
}

/**
 * Converts a raster image File (JPEG, PNG, WebP) to an optimized WebP Blob using an in-memory Canvas.
 * Skips SVGs and GIFs to preserve vector scalability and animations.
 */
export async function compressImageToWebP(
  file: File,
  maxDimension: number = 1600,
  quality: number = 0.82
): Promise<{ blob: Blob; originalSize: number; compressedSize: number; reductionPercent: number }> {
  const originalSize = file.size;

  // Do not re-compress SVG or GIF
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return {
      blob: file,
      originalSize,
      compressedSize: originalSize,
      reductionPercent: 0,
    };
  }

  return new Promise((resolve, reject) => {
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
        reject(new Error('Canvas 2D rendering context not available'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create WebP blob from canvas'));
            return;
          }
          const compressedSize = blob.size;
          const reductionPercent = Math.max(
            0,
            Math.round(((originalSize - compressedSize) / originalSize) * 100)
          );
          resolve({ blob, originalSize, compressedSize, reductionPercent });
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a file (or pre-compressed Blob) directly to the Supabase Storage bucket.
 */
export async function uploadMediaToStorage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const folder = options.folder || 'general';
  const validation = validateMediaFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  let uploadPayload: Blob | File = file;
  let ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
  let mimeType = file.type;
  let compressionStats: UploadResult['compression'] = undefined;

  // Compress raster images
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    try {
      const compressed = await compressImageToWebP(
        file,
        options.maxDimension || 1600,
        options.quality || 0.82
      );
      uploadPayload = compressed.blob;
      ext = 'webp';
      mimeType = 'image/webp';
      compressionStats = {
        originalSize: compressed.originalSize,
        compressedSize: compressed.compressedSize,
        reductionPercent: compressed.reductionPercent,
      };
    } catch (compressErr) {
      console.warn('[Storage] Image compression skipped due to error, uploading original:', compressErr);
    }
  }

  // Generate safe filename: <timestamp>-<slugified-basename>.<ext>
  const baseName = file.name
    .substring(0, file.name.lastIndexOf('.'))
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
  const filename = `${Date.now()}-${baseName || 'media'}.${ext}`;
  const filePath = `${folder}/${filename}`;

  // Notify progress start
  if (options.onProgress) options.onProgress(20);

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, uploadPayload, {
      contentType: mimeType,
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(`[Storage] Upload failed for ${filePath}:`, error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }

  if (options.onProgress) options.onProgress(90);

  // Get the public CDN URL
  const { data: publicUrlData } = supabase.storage
    .from(MEDIA_BUCKET)
    .getPublicUrl(data.path);

  if (options.onProgress) options.onProgress(100);

  return {
    url: publicUrlData.publicUrl,
    path: data.path,
    size: uploadPayload.size,
    type: mimeType,
    compression: compressionStats,
  };
}

/**
 * Replaces an existing media file by uploading the new file first,
 * and deleting the old file from Supabase Storage only after the new upload succeeds.
 */
export async function replaceMediaInStorage(
  oldUrlOrPath: string,
  newFile: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  // 1. Upload new file first
  const result = await uploadMediaToStorage(newFile, options);

  // 2. Safely delete old file if it is an existing storage asset
  if (oldUrlOrPath && isStorageUrl(oldUrlOrPath)) {
    const oldPath = extractStoragePath(oldUrlOrPath);
    if (oldPath) {
      try {
        await supabase.storage.from(MEDIA_BUCKET).remove([oldPath]);
      } catch (delErr) {
        console.warn(`[Storage] Failed to delete previous file ${oldPath}:`, delErr);
      }
    }
  }

  return result;
}

/**
 * Deletes a file from Supabase Storage if it belongs to primexpixel-media.
 * Safely ignores static assets (/brand/...).
 */
export async function deleteMediaFromStorage(urlOrPath: string): Promise<boolean> {
  if (!urlOrPath || !isStorageUrl(urlOrPath)) {
    // Static asset or external URL; do not touch
    return true;
  }

  const path = extractStoragePath(urlOrPath);
  if (!path) return false;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) {
    console.error(`[Storage] Failed to remove ${path}:`, error.message);
    throw new Error(`Failed to delete media: ${error.message}`);
  }
  return true;
}

/**
 * Lists all uploaded files in a specific folder of the storage bucket.
 */
export async function listStorageMedia(folder: string = 'general'): Promise<any[]> {
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error(`[Storage] Failed to list media in ${folder}:`, error.message);
    throw error;
  }

  return (data || []).map((file) => {
    const path = `${folder}/${file.name}`;
    const { data: urlData } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return {
      ...file,
      path,
      url: urlData.publicUrl,
    };
  });
}
