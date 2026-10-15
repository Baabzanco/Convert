'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Globe, Shield, Sparkles, FolderOpen } from 'lucide-react';
import MediaPickerModal from '@/components/admin/media/MediaPickerModal';
import { MediaAssetItem } from '@/lib/admin/types';

interface InlineSharedSettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
}

export function InlineSharedSettingsDrawer({
  isOpen,
  onClose,
  onSettingsSaved,
}: InlineSharedSettingsDrawerProps) {
  const [settings, setSettings] = useState<Record<string, any>>({
    siteName: 'Convert24',
    siteUrl: 'https://convert24.local',
    defaultSeoTitle: 'Convert24 – Free Online File Tools',
    defaultMetaDescription: 'Fast, secure, 100% free image and PDF conversion utilities entirely in your browser.',
    defaultOgImage: '/images/og-image.png',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setFeedback(null);
      fetch('/api/admin/settings')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.settings) {
            setSettings(data.settings);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Global shared site settings updated successfully.' });
        if (onSettingsSaved) onSettingsSaved();
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', text: data.error || 'Failed to update shared settings.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error saving settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaSelect = (asset: MediaAssetItem | null) => {
    if (asset) {
      setSettings((prev) => ({
        ...prev,
        defaultOgImage: asset.url,
      }));
    }
    setIsMediaPickerOpen(false);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
        aria-labelledby="shared-settings-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-auto fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-md bg-white border-l border-[#E4E2F0] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
              {/* Header */}
              <div className="p-5 border-b border-[#E4E2F0] bg-[#FAF9FF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E2F0] flex items-center justify-center shadow-sm">
                    <Globe className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <div>
                    <h3 id="shared-settings-title" className="text-base font-bold text-[#0F112E]">
                      Shared Site Configuration
                    </h3>
                    <p className="text-xs text-[#5E6488]">Header, Footer, and Default Brand Settings</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#5E6488] hover:text-[#0F112E] hover:bg-slate-100 transition-colors"
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {feedback && (
                <div
                  className={`p-3 text-xs font-semibold ${
                    feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                    Site Brand Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                    Production Canonical Site URL
                  </label>
                  <input
                    type="text"
                    value={settings.siteUrl || ''}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                    Default Site SEO Title
                  </label>
                  <input
                    type="text"
                    value={settings.defaultSeoTitle || ''}
                    onChange={(e) => setSettings({ ...settings, defaultSeoTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.defaultMetaDescription || ''}
                    onChange={(e) => setSettings({ ...settings, defaultMetaDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                      Default Social Share Image (OG Image)
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsMediaPickerOpen(true)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F0FD] text-[#7C3AED] hover:bg-[#EDE9FE] rounded-lg text-xs font-bold transition-colors"
                    >
                      <FolderOpen className="w-3.5 h-3.5" /> Media Library
                    </button>
                  </div>
                  <input
                    type="text"
                    value={settings.defaultOgImage || ''}
                    onChange={(e) => setSettings({ ...settings, defaultOgImage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div className="pt-4 border-t border-[#E4E2F0] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5E6488] hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        currentUrl={settings.defaultOgImage}
        title="Select Default OG Image"
      />
    </>
  );
}
