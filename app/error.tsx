'use client';

import React from 'react';

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold mb-3 text-[#124A57]">Something went wrong</h2>
      <p className="text-sm text-[#667085] mb-6 max-w-md">
        An error occurred while loading this page.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-4 py-2 bg-[#124A57] text-white rounded-md hover:bg-[#124A57]/90 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
