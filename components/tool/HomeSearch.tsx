'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, X } from 'lucide-react';
import { ToolDefinition } from '@/lib/tools';

interface HomeSearchProps {
  tools: ToolDefinition[];
}

export function HomeSearch({ tools }: HomeSearchProps) {
  const [query, setQuery] = useState('');

  const filteredTools = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(trimmed) ||
        t.slug.toLowerCase().includes(trimmed) ||
        t.category.toLowerCase().includes(trimmed) ||
        t.inputFormats.some((f) => f.toLowerCase().includes(trimmed)) ||
        t.outputFormats.some((f) => f.toLowerCase().includes(trimmed))
    );
  }, [query, tools]);

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#667085]">
          <Search className="w-5 h-5" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a tool..."
          aria-label="Search for a tool by name, format, or slug"
          className="w-full pl-11 pr-10 py-3.5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl text-base text-[#17202A] placeholder-[#667085] shadow-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57] focus-visible:border-transparent transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search query"
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#667085] hover:text-[#17202A]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Matching Tools Dropdown / Results List */}
      {query.trim().length > 0 && (
        <div
          role="region"
          aria-live="polite"
          className="absolute left-0 right-0 top-full mt-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl shadow-card overflow-hidden z-30 max-h-80 overflow-y-auto"
        >
          {filteredTools.length > 0 ? (
            <div className="py-2 divide-y divide-[#E5E7EB]/60">
              <div className="px-4 py-2 text-xs font-semibold text-[#667085] uppercase tracking-wider bg-[#F8FAFC]">
                Found {filteredTools.length} matching {filteredTools.length === 1 ? 'tool' : 'tools'}
              </div>
              {filteredTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  onClick={() => setQuery('')}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#F0F7F8] transition-colors group"
                >
                  <div>
                    <p className="font-semibold text-sm text-[#17202A] group-hover:text-[#124A57]">
                      {tool.name}
                    </p>
                    <p className="text-xs text-[#667085] line-clamp-1">{tool.intro}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#667085] group-hover:text-[#124A57] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-5 text-center text-sm text-[#667085]">
              No tools matching &ldquo;{query}&rdquo;. Browse our image or PDF categories below.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeSearch;
