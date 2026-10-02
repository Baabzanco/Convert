'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle2, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import MediaPickerModal from '@/components/admin/media/MediaPickerModal';

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [defaultSeoTitle, setDefaultSeoTitle] = useState('');
  const [defaultMetaDescription, setDefaultMetaDescription] = useState('');
  const [defaultOgImage, setDefaultOgImage] = useState('');
  const [defaultTwitterImage, setDefaultTwitterImage] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleAdSenseId, setGoogleAdSenseId] = useState('');

  // Media Picker state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'og' | 'twitter'>('og');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to load global settings.');
      const data = await res.json();
      const s = data.settings;
      if (s) {
        setSiteName(s.siteName || '');
        setSiteUrl(s.siteUrl || '');
        setDefaultSeoTitle(s.defaultSeoTitle || '');
        setDefaultMetaDescription(s.defaultMetaDescription || '');
        setDefaultOgImage(s.defaultOgImage || '');
        setDefaultTwitterImage(s.defaultTwitterImage || '');
        setGoogleAnalyticsId(s.googleAnalyticsId || '');
        setGoogleAdSenseId(s.googleAdSenseId || '');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading settings.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          siteUrl,
          defaultSeoTitle,
          defaultMetaDescription,
          defaultOgImage: defaultOgImage || null,
          defaultTwitterImage: defaultTwitterImage || null,
          googleAnalyticsId: googleAnalyticsId || null,
          googleAdSenseId: googleAdSenseId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings.');

      setStatusMessage({
        type: 'success',
        text: 'Global settings updated and saved to database successfully.',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating settings.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17202A]">
          Global Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Configure site-wide metadata, canonical domains, and third-party integration IDs.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-[#E6F4F1] border border-[#A2D2CD] text-[#124A57]'
              : 'bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B]'
          }`}
          role="alert"
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#124A57] shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#64748B]">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#124A57]" />
          <span>Loading settings from database...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#E5E7EB] shadow-subtle p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9]">
              General Site Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">
                  Canonical Site URL
                </label>
                <input
                  type="url"
                  required
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9]">
              Default SEO Metadata
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#475467] mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={defaultSeoTitle}
                onChange={(e) => setDefaultSeoTitle(e.target.value)}
                placeholder="Free Online File Tools – Convert, Compress & Edit Files Free"
                className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475467] mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={defaultMetaDescription}
                onChange={(e) => setDefaultMetaDescription(e.target.value)}
                placeholder="Brief summary of the application..."
                className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#475467]">
                    Default OpenGraph Image URL
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('og');
                      setIsMediaPickerOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#124A57] hover:underline"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Select Media</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={defaultOgImage}
                  onChange={(e) => setDefaultOgImage(e.target.value)}
                  placeholder="/images/og-image.png or /uploads/..."
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#475467]">
                    Default Twitter Card Image URL
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaTarget('twitter');
                      setIsMediaPickerOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#124A57] hover:underline"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Select Media</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={defaultTwitterImage}
                  onChange={(e) => setDefaultTwitterImage(e.target.value)}
                  placeholder="/images/og-image.png or /uploads/..."
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748B] pb-2 border-b border-[#F1F5F9]">
              Third-Party Integrations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">
                  Google Analytics Measurement ID
                </label>
                <input
                  type="text"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#475467] mb-1">
                  Google AdSense Publisher ID
                </label>
                <input
                  type="text"
                  value={googleAdSenseId}
                  onChange={(e) => setGoogleAdSenseId(e.target.value)}
                  placeholder="pub-XXXXXXXXXXXXXXXX"
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1F5F9] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#124A57] hover:bg-[#0E3B46] rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving to Database...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      )}

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        currentUrl={mediaTarget === 'og' ? defaultOgImage : defaultTwitterImage}
        onSelect={(asset) => {
          if (mediaTarget === 'og') {
            setDefaultOgImage(asset ? asset.url : '');
          } else {
            setDefaultTwitterImage(asset ? asset.url : '');
          }
        }}
      />
    </div>
  );
}
