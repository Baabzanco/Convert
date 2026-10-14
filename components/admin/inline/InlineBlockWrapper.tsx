'use client';

import React from 'react';
import { Pencil } from 'lucide-react';

interface InlineBlockWrapperProps {
  blockId: string;
  blockType: string;
  label: string;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

export function InlineBlockWrapper({
  blockId,
  blockType,
  label,
  isEditing,
  isSelected,
  onSelect,
  children,
}: InlineBlockWrapperProps) {
  if (!isEditing) {
    return <>{children}</>;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Edit ${label} block`}
      aria-pressed={isSelected}
      onClick={(e) => {
        // Prevent clicking links/buttons inside from navigating when in edit mode
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
      onKeyDown={handleKeyDown}
      className={`relative group rounded-2xl transition-all duration-200 outline-none my-2 ${
        isSelected
          ? 'ring-2 ring-[#7C3AED] ring-offset-4 ring-offset-[#FCFBFF] shadow-sm bg-[#7C3AED]/[0.02]'
          : 'hover:ring-2 hover:ring-[#7C3AED]/40 hover:ring-offset-2 hover:ring-offset-[#FCFBFF] cursor-pointer'
      }`}
    >
      {/* Floating Edit Badge */}
      <div
        className={`absolute -top-3 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-md ${
          isSelected
            ? 'bg-[#7C3AED] text-white ring-2 ring-white scale-105'
            : 'bg-white text-[#7C3AED] border border-[#E4E2F0] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 hover:bg-[#F4F0FD]'
        }`}
      >
        <Pencil className="w-3 h-3" aria-hidden="true" />
        <span>{isSelected ? `Editing ${label}` : `Click to Edit ${label}`}</span>
      </div>

      {/* Block Content */}
      <div className="pointer-events-none select-none">{children}</div>
    </div>
  );
}
