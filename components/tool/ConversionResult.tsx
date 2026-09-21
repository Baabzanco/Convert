import React from 'react';
import { CheckCircle2, FileCheck, ArrowRight } from 'lucide-react';
import { formatBytes } from '@/engines/shared/file-utils';
import DownloadButton from './DownloadButton';

export interface ConversionResultData {
  fileName: string;
  originalSize: number;
  convertedSize: number;
  downloadUrl?: string;
  onDownload?: () => void;
  onReset?: () => void;
}

interface ConversionResultProps {
  result: ConversionResultData;
  className?: string;
}

export function ConversionResult({ result, className = '' }: ConversionResultProps) {
  const savingsBytes = result.originalSize - result.convertedSize;
  const percentSaved =
    result.originalSize > 0 && savingsBytes > 0
      ? Math.round((savingsBytes / result.originalSize) * 100)
      : null;

  return (
    <div
      className={`w-full bg-[#FFFFFF] border border-[#16A34A]/30 rounded-card p-6 md:p-8 shadow-card text-center space-y-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl md:text-2xl font-bold text-[#17202A]">
          Processing Complete!
        </h3>
        <p className="text-sm text-[#667085]">
          Your converted file is ready for download.
        </p>
      </div>

      {/* File summary stats */}
      <div className="max-w-md mx-auto p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg flex items-center justify-between text-left">
        <div className="flex items-center gap-3 min-w-0 pr-2">
          <div className="w-10 h-10 rounded-md bg-[#124A57]/10 text-[#124A57] flex items-center justify-center flex-shrink-0">
            <FileCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#17202A] truncate">
              {result.fileName}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#667085]">
              <span>{formatBytes(result.originalSize)}</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
              <span className="font-medium text-[#16A34A]">{formatBytes(result.convertedSize)}</span>
            </div>
          </div>
        </div>

        {percentSaved !== null && percentSaved > 0 && (
          <span className="text-xs font-semibold px-2 py-1 rounded bg-[#F0FDF4] text-[#16A34A] whitespace-nowrap">
            -{percentSaved}%
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <DownloadButton
          onClick={result.onDownload}
          href={result.downloadUrl}
          downloadFilename={result.fileName}
          label="Download File"
        />

        {result.onReset && (
          <button
            type="button"
            onClick={result.onReset}
            className="px-5 py-3 rounded-lg text-sm font-medium text-[#17202A] hover:bg-[#F8FAFC] border border-[#E5E7EB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57]"
          >
            Convert another file
          </button>
        )}
      </div>
    </div>
  );
}

export default ConversionResult;
