'use client';

import React from 'react';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center p-4 bg-[#FFFFFF] text-[#17202A]">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3 text-[#124A57]">Something went wrong</h1>
          <p className="text-sm text-[#667085] mb-6">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-[#124A57] text-white rounded-md hover:bg-[#124A57]/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
