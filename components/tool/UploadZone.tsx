'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Plus } from 'lucide-react';

export interface UploadZoneProps {
  acceptedFormats?: string[];
  maxSizeBytes?: number;
  maxFiles?: number;
  onFilesSelected?: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
}

export function UploadZone({
  acceptedFormats = ['JPG', 'PNG', 'WEBP', 'PDF'],
  maxSizeBytes = 50 * 1024 * 1024,
  maxFiles = 20,
  onFilesSelected,
  disabled = false,
  className = '',
  multiple = true,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSizeMb = Math.round(maxSizeBytes / (1024 * 1024));
  const acceptAttribute = acceptedFormats
    .map((fmt) => {
      const clean = fmt.toLowerCase().replace('.', '');
      return clean === 'pdf' ? '.pdf,application/pdf' : `.${clean},image/${clean}`;
    })
    .join(',');

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      onFilesSelected?.(files);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).slice(0, maxFiles);
      onFilesSelected?.(files);
      // Reset input value to allow re-uploading same file
      e.target.value = '';
    }
  };

  const triggerPicker = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerPicker}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerPicker();
        }
      }}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload files zone. Drag and drop or click to browse files."
      aria-disabled={disabled}
      className={`relative w-full rounded-card border-2 border-dashed p-8 md:p-12 text-center transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57] ${
        isDragOver
          ? 'border-[#124A57] bg-[#F0F7F8]'
          : 'border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#124A57]/50 hover:bg-[#F8FAFC]'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={acceptAttribute}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
      />

      <div className="flex flex-col items-center justify-center pointer-events-none">
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F0F7F8] text-[#124A57] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
          <UploadCloud className="w-7 h-7 md:w-8 md:h-8" aria-hidden="true" />
        </div>

        <div className="space-y-1.5 mb-3">
          <p className="text-lg md:text-xl font-semibold text-[#17202A]">
            <span className="text-[#124A57] hover:underline">Choose files</span> or drag & drop here
          </p>
          <p className="text-sm text-[#667085]">
            Tap to browse on mobile or drop from your computer
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#667085] mt-2">
          <span className="bg-[#F8FAFC] border border-[#E5E7EB] px-2.5 py-1 rounded-md">
            Formats: {acceptedFormats.join(', ')}
          </span>
          <span className="bg-[#F8FAFC] border border-[#E5E7EB] px-2.5 py-1 rounded-md">
            Max: {maxSizeMb} MB per file
          </span>
          <span className="bg-[#F8FAFC] border border-[#E5E7EB] px-2.5 py-1 rounded-md">
            Up to {maxFiles} files
          </span>
        </div>

        <div className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-[#124A57] text-white rounded-lg text-sm font-medium hover:bg-[#0E3943] transition-colors">
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Select Files</span>
        </div>
      </div>
    </div>
  );
}

export default UploadZone;
