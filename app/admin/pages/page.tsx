'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  ExternalLink,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Check,
  X,
} from 'lucide-react';

interface PageItem {
  id: string;
  slug: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  seo?: {
    seoTitle?: string;
    metaDescription?: string;
  } | null;
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New page modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = filter === 'ALL' ? '/api/admin/pages' : `/api/admin/pages?status=${filter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load pages.');
      const data = await res.json();
      setPages(data.pages || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading pages.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [filter]);

  const handleTogglePublish = async (page: PageItem) => {
    const action = page.status === 'PUBLISHED' ? 'unpublish' : 'publish';
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error(`Failed to ${action} page.`);
      await fetchPages();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to update status.`;
      alert(msg);
    }
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlug || !newName) return;
    setIsCreating(true);

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: newSlug,
          name: newName,
          status: 'DRAFT',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create page.');

      setShowCreateModal(false);
      setNewSlug('');
      setNewName('');
      await fetchPages();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating page.';
      alert(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredPages = pages.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#17202A]">
            Pages CMS
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage public pages, status, versioning, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#124A57] hover:bg-[#0E3B46] rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-lg">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-white text-[#17202A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#17202A]'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pages by name or slug..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-subtle overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#124A57]" />
            <span>Loading pages...</span>
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#64748B]">
            No pages found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-[#64748B] uppercase font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Page Name</th>
                  <th className="px-5 py-3.5">Public Slug</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Last Updated</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#17202A]">
                      {page.name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-[#64748B]">
                      /{page.slug === 'home' ? '' : page.slug}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          page.status === 'PUBLISHED'
                            ? 'bg-[#E6F4F1] text-[#124A57]'
                            : 'bg-[#FFFBEB] text-[#B45309]'
                        }`}
                      >
                        {page.status === 'PUBLISHED' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-[#124A57]" />
                            Published
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-[#B45309]" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#64748B]">
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="px-2.5 py-1 text-[11px] font-semibold text-[#124A57] bg-[#E6F4F1] hover:bg-[#D5EAE6] rounded transition-colors inline-block"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/admin/pages/${page.id}/preview`}
                        className="px-2 py-1 text-[11px] font-medium text-[#475467] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded transition-colors inline-block"
                      >
                        Preview
                      </Link>

                      <Link
                        href={`/admin/pages/${page.id}/revisions`}
                        className="px-2 py-1 text-[11px] font-medium text-[#475467] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded transition-colors inline-block"
                      >
                        Revisions
                      </Link>

                      <button
                        onClick={() => handleTogglePublish(page)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                          page.status === 'PUBLISHED'
                            ? 'bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]'
                            : 'bg-[#E6F4F1] text-[#124A57] hover:bg-[#CDE1E5]'
                        }`}
                      >
                        {page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>

                      <Link
                        href={`/${page.slug === 'home' ? '' : page.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 p-1 text-[#64748B] hover:text-[#124A57] rounded"
                        title="View public page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#E5E7EB] space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-base font-bold text-[#17202A]">Create New Page</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#94A3B8] hover:text-[#17202A]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newSlug) {
                      setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'));
                    }
                  }}
                  placeholder="e.g. Help Center"
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-[#F1F5F9] border border-r-0 border-[#CBD5E1] rounded-l-lg text-xs text-[#64748B]">
                    /
                  </span>
                  <input
                    type="text"
                    required
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
                    placeholder="help-center"
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#475467] hover:bg-[#F1F5F9] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#124A57] hover:bg-[#0E3B46] rounded-lg disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
