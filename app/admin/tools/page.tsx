'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  ExternalLink,
  CheckCircle2,
  Code,
  Search,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ToolItem {
  slug: string;
  name: string;
  category: string;
  hasCmsOverride: boolean;
  isPublished: boolean;
  customTitle: string | null;
  updatedAt: string | null;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/tools');
      if (!res.ok) throw new Error('Failed to load tools.');
      const data = await res.json();
      setTools(data.tools || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading tools.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const categories = ['ALL', 'image-converter', 'image-utility', 'pdf-converter', 'pdf-utility'];

  const filteredTools = tools.filter((t) => {
    const matchCat = categoryFilter === 'ALL' || t.category === categoryFilter;
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17202A]">
            Tools CMS Foundation
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Overview of the 25 authoritative tools and their database CMS override statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchTools}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475467] bg-white border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                categoryFilter === cat
                  ? 'bg-white text-[#17202A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#17202A]'
              }`}
            >
              {cat === 'ALL' ? 'All (25)' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools by name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
          />
        </div>
      </div>

      {/* Tools Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-subtle overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#124A57]" />
            <span>Loading tools registry...</span>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            No tools found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Tool Name</th>
                  <th className="px-5 py-3.5">Route</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Content Source</th>
                  <th className="px-5 py-3.5 text-right">Public View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredTools.map((tool) => (
                  <tr key={tool.slug} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#17202A] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-[#E6F4F1] text-[#124A57] flex items-center justify-center shrink-0">
                        <Wrench className="w-3.5 h-3.5" />
                      </div>
                      <span>{tool.name}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#64748B]">
                      /tools/{tool.slug}
                    </td>
                    <td className="px-5 py-3.5 text-[#64748B]">
                      <span className="px-2 py-0.5 bg-[#F1F5F9] rounded text-[10px] font-medium">
                        {tool.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {tool.hasCmsOverride && tool.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E6F4F1] text-[#124A57]">
                          <Sparkles className="w-3 h-3 text-[#124A57]" />
                          CMS Override Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F5F9] text-[#64748B]">
                          <Code className="w-3 h-3 text-[#64748B]" />
                          Code Registry (Default)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/tools/${tool.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#124A57] hover:bg-[#E6F4F1] rounded transition-colors"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
