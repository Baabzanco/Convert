import JSZip from 'jszip';

/**
 * Formats byte size into human-readable representation.
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Extracts clean base name and extension.
 */
export function getFileNameParts(filename: string): { name: string; extension: string } {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    return { name: filename, extension: '' };
  }
  return {
    name: filename.substring(0, lastDot),
    extension: filename.substring(lastDot + 1).toLowerCase(),
  };
}

/**
 * Generates an output filename with replacement extension.
 */
export function replaceFileExtension(filename: string, newExtension: string): string {
  const { name } = getFileNameParts(filename);
  const cleanExt = newExtension.replace('.', '');
  return `${name}.${cleanExt}`;
}

/**
 * Generates a collision-free unique filename based on already used names.
 * For example: 'photo.png' -> if exists, 'photo (1).png', etc.
 */
export function generateUniqueFilename(baseFilename: string, existingNames: Set<string>): string {
  if (!existingNames.has(baseFilename)) {
    existingNames.add(baseFilename);
    return baseFilename;
  }

  const { name, extension } = getFileNameParts(baseFilename);
  let counter = 1;
  let candidate = `${name} (${counter}).${extension}`;
  while (existingNames.has(candidate)) {
    counter++;
    candidate = `${name} (${counter}).${extension}`;
  }
  existingNames.add(candidate);
  return candidate;
}

/**
 * Creates a client-side ZIP file from an array of files/blobs using JSZip.
 */
export async function createZipBlob(files: { name: string; blob: Blob }[]): Promise<Blob> {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file.blob);
  }
  return await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Triggers a client-side file download for an in-memory Blob.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
