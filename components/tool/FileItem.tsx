import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';
import { formatBytes } from '@/engines/shared/file-utils';

export interface FileItemData {
  id: string;
  file: File;
  previewUrl?: string;
  status?: 'idle' | 'processing' | 'done' | 'error';
  errorMessage?: string;
}

interface FileItemProps {
  item: FileItemData;
  onRemove?: (id: string) => void;
  disabled?: boolean;
}

export function FileItem({ item, onRemove, disabled = false }: FileItemProps) {
  const isImage = Boolean(item.file?.type?.startsWith('image/'));

  return (
    <div className="flex items-center justify-between p-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg hover:border-[#124A57]/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <div className="w-10 h-10 rounded-md bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center flex-shrink-0 text-[#124A57] overflow-hidden">
          {item.previewUrl ? (
            <img
              src={item.previewUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : isImage ? (
            <ImageIcon className="w-5 h-5 text-[#124A57]" aria-hidden="true" />
          ) : (
            <FileText className="w-5 h-5 text-[#CD78B3]" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-[#17202A] truncate">
            {item.file.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#667085]">
            <span>{formatBytes(item.file.size)}</span>
            {item.status && (
              <span
                className={`capitalize text-[11px] font-medium px-1.5 py-0.2 rounded ${
                  item.status === 'done'
                    ? 'bg-[#F0FDF4] text-[#16A34A]'
                    : item.status === 'error'
                    ? 'bg-[#FEF2F2] text-[#DC2626]'
                    : item.status === 'processing'
                    ? 'bg-[#F0F7F8] text-[#124A57]'
                    : 'text-[#667085]'
                }`}
              >
                {item.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          disabled={disabled}
          aria-label={`Remove file ${item.file.name}`}
          className="p-1.5 text-[#667085] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57]"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default FileItem;
