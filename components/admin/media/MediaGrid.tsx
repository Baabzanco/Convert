'use client';

import React from 'react';
import { ImageIcon, CheckCircle, Eye } from 'lucide-react';
import { MediaAssetItem } from '@/lib/admin/types';

interface MediaGridProps {
  assets: MediaAssetItem[];
  selectedId?: string | null;
  onSelect?: (asset: MediaAssetItem) => void;
  onViewDetails?: (asset: MediaAssetItem) => void;
  isLoading?: boolean;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getMimeBadgeColor(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'image/png':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'image/webp':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'image/gif':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'image/svg+xml':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export function getMimeShortLabel(mimeType: string): string {
  switch (mimeType) {
    case 'image/jpeg':
      return 'JPEG';
    case 'image/png':
      return 'PNG';
    case 'image/webp':
      return 'WEBP';
    case 'image/gif':
      return 'GIF';
    case 'image/svg+xml':
      return 'SVG';
    default:
      return mimeType.split('/')[1]?.toUpperCase() || 'IMG';
  }
}

export default function MediaGrid({
  assets,
  selectedId,
  onSelect,
  onViewDetails,
  isLoading,
}: MediaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] aspect-square flex flex-col justify-end p-3"
          >
            <div className="h-3 bg-[#CBD5E1] rounded w-3/4 mb-1.5" />
            <div className="h-2.5 bg-[#E2E8F0] rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-dashed border-[#CBD5E1] rounded-xl">
        <ImageIcon className="w-10 h-10 text-[#94A3B8] mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-[#1E293B]">No Media Assets Found</h3>
        <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
          Upload images to start building your media library.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {assets.map((asset) => {
        const isSelected = selectedId === asset.id;

        return (
          <div
            key={asset.id}
            onClick={() => onSelect && onSelect(asset)}
            className={`group relative bg-white border rounded-xl overflow-hidden cursor-pointer transition-all shadow-2xs hover:shadow-md flex flex-col ${
              isSelected
                ? 'border-[#124A57] ring-2 ring-[#124A57]/30'
                : 'border-[#E2E8F0] hover:border-[#94A3B8]'
            }`}
          >
            {/* Image Preview Container */}
            <div className="relative aspect-square w-full bg-[#F8FAFC] flex items-center justify-center overflow-hidden border-b border-[#F1F5F9]">
              <img
                src={asset.url}
                alt={asset.alt || asset.title || asset.filename}
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-2 left-2 bg-[#124A57] text-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}

              {/* MIME Type Badge */}
              <div
                className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${getMimeBadgeColor(
                  asset.mimeType
                )}`}
              >
                {getMimeShortLabel(asset.mimeType)}
              </div>

              {/* Details Quick-Action Button */}
              {onViewDetails && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(asset);
                  }}
                  className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-black/70 hover:bg-black text-white rounded-lg shadow-sm"
                  title="View details & edit"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Asset Info Footer */}
            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <p
                className="text-xs font-semibold text-[#1E293B] truncate"
                title={asset.title || asset.originalFilename}
              >
                {asset.title || asset.originalFilename}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#64748B] mt-1">
                <span>
                  {asset.width && asset.height ? `${asset.width}×${asset.height}` : 'Vector/SVG'}
                </span>
                <span>{formatFileSize(asset.size)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
