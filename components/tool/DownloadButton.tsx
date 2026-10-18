import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick?: () => void;
  href?: string;
  downloadFilename?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function DownloadButton({
  onClick,
  href,
  downloadFilename,
  label = 'Download Converted File',
  disabled = false,
  className = '',
}: DownloadButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#124A57] hover:bg-[#0E3943] active:bg-[#0A2930] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-subtle';

  if (href) {
    return (
      <a
        href={href}
        download={downloadFilename}
        className={`${baseClasses} ${className}`}
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    >
      <Download className="w-4 h-4" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default DownloadButton;
