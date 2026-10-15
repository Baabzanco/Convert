'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  HelpCircle,
  FileText,
  ListOrdered,
  Grid,
  Shield,
  Briefcase,
  Share2,
  MousePointerClick,
  Cpu,
  FileCheck,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  DollarSign,
  Layers,
  ArrowUp,
  ArrowDown,
  FolderOpen,
} from 'lucide-react';
import { UniversalContentBlock } from '@/lib/cms/blocks';
import { getAllTools } from '@/lib/tools';
import { isSafeUrl } from '@/lib/admin/validation';
import MediaPickerModal from '@/components/admin/media/MediaPickerModal';
import { MediaAssetItem } from '@/lib/admin/types';

interface InlineBlockEditorDrawerProps {
  block: UniversalContentBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveBlock: (updatedBlock: UniversalContentBlock) => void;
}

export function InlineBlockEditorDrawer({
  block,
  isOpen,
  onClose,
  onSaveBlock,
}: InlineBlockEditorDrawerProps) {
  const [content, setContent] = useState<Record<string, any>>({});
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const allCanonicalTools = getAllTools();

  useEffect(() => {
    if (block) {
      setContent(JSON.parse(JSON.stringify(block.content || {})));
      setValidationError(null);
    }
  }, [block]);

  if (!isOpen || !block) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate any URLs present in content
    if (content.href && !isSafeUrl(content.href)) {
      setValidationError('Destination URL contains an unsafe protocol (javascript:, vbscript:, etc.).');
      return;
    }
    if (content.buttonHref && !isSafeUrl(content.buttonHref)) {
      setValidationError('Button URL contains an unsafe protocol.');
      return;
    }
    if (content.exploreHref && !isSafeUrl(content.exploreHref)) {
      setValidationError('Explore URL contains an unsafe protocol.');
      return;
    }
    if (content.imageHubHref && !isSafeUrl(content.imageHubHref)) {
      setValidationError('Image Hub URL contains an unsafe protocol.');
      return;
    }
    if (content.pdfHubHref && !isSafeUrl(content.pdfHubHref)) {
      setValidationError('PDF Hub URL contains an unsafe protocol.');
      return;
    }

    onSaveBlock({
      ...block,
      content,
      // sync root properties for backward-compatibility
      ...content,
    });
    onClose();
  };

  const handleMediaSelect = (asset: MediaAssetItem | null) => {
    if (asset) {
      setContent((prev) => ({
        ...prev,
        src: asset.url,
        alt: asset.alt || asset.title || prev.alt || 'Selected media asset',
      }));
    }
    setIsMediaPickerOpen(false);
  };

  const getBlockIcon = () => {
    switch (block.type) {
      case 'hero':
        return <Sparkles className="w-5 h-5 text-[#7C3AED]" />;
      case 'intro':
        return <FileText className="w-5 h-5 text-[#7C3AED]" />;
      case 'how_to_use':
      case 'how_to':
        return <ListOrdered className="w-5 h-5 text-[#7C3AED]" />;
      case 'features':
      case 'feature':
        return <Grid className="w-5 h-5 text-[#7C3AED]" />;
      case 'supported_formats':
        return <FileCheck className="w-5 h-5 text-[#7C3AED]" />;
      case 'technical_details':
        return <Cpu className="w-5 h-5 text-[#7C3AED]" />;
      case 'privacy_note':
      case 'benefits_trust':
        return <Shield className="w-5 h-5 text-[#7C3AED]" />;
      case 'use_cases':
        return <Briefcase className="w-5 h-5 text-[#7C3AED]" />;
      case 'faq':
        return <HelpCircle className="w-5 h-5 text-[#7C3AED]" />;
      case 'related_tools':
        return <Share2 className="w-5 h-5 text-[#7C3AED]" />;
      case 'cta':
        return <MousePointerClick className="w-5 h-5 text-[#7C3AED]" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-[#7C3AED]" />;
      case 'link':
        return <LinkIcon className="w-5 h-5 text-[#7C3AED]" />;
      case 'pricing':
        return <DollarSign className="w-5 h-5 text-[#7C3AED]" />;
      case 'hubs':
      case 'popular_tools':
        return <Layers className="w-5 h-5 text-[#7C3AED]" />;
      default:
        return <FileText className="w-5 h-5 text-[#7C3AED]" />;
    }
  };

  const getBlockTitle = () => {
    switch (block.type) {
      case 'hero':
        return 'Edit Hero & Heading';
      case 'popular_tools':
        return 'Edit Popular Tools Section';
      case 'hubs':
        return 'Edit Discovery Hubs Section';
      case 'pricing':
        return 'Edit Pricing Section';
      case 'intro':
        return 'Edit Introduction';
      case 'how_to_use':
      case 'how_to':
        return 'Edit How-To Instructions';
      case 'features':
        return 'Edit Features Grid & Highlights';
      case 'feature':
        return 'Edit Feature Card';
      case 'supported_formats':
        return 'Edit Supported Formats';
      case 'technical_details':
        return 'Edit Technical Details & Specs';
      case 'privacy_note':
        return 'Edit Privacy & Guarantee';
      case 'use_cases':
        return 'Edit Common Use Cases';
      case 'faq':
        return 'Edit Frequently Asked Questions';
      case 'related_tools':
        return 'Edit Related Tools';
      case 'cta':
        return 'Edit Call to Action Button';
      case 'image':
        return 'Edit Image & Media';
      case 'link':
        return 'Edit Text Link';
      case 'rich_text':
        return 'Edit Rich Text HTML';
      case 'heading':
        return 'Edit Heading';
      case 'paragraph':
        return 'Edit Paragraph';
      case 'section':
        return 'Edit Section Container';
      default:
        return `Edit Block (${block.type})`;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
        aria-labelledby="slide-over-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-auto fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-lg bg-white border-l border-[#E4E2F0] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E4E2F0] bg-[#FAF9FF] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E4E2F0] flex items-center justify-center shadow-sm">
                    {getBlockIcon()}
                  </div>
                  <div>
                    <h3 id="slide-over-title" className="text-base font-bold text-[#0F112E]">
                      {getBlockTitle()}
                    </h3>
                    <p className="text-xs text-[#5E6488]">Type: {block.type} • ID: {block.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#5E6488] hover:text-[#0F112E] hover:bg-slate-100 transition-colors"
                  aria-label="Close editor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {validationError && (
                <div className="p-3 bg-red-50 border-b border-red-200 text-xs font-semibold text-red-700">
                  {validationError}
                </div>
              )}

              {/* Drawer Body Forms */}
              <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* 1. HERO BLOCK */}
                {block.type === 'hero' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Badge Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={content.badge || ''}
                        onChange={(e) => setContent({ ...content, badge: e.target.value })}
                        placeholder="e.g. 100% Free & Client-Side Private"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Headline / Title
                      </label>
                      <input
                        type="text"
                        value={content.title || ''}
                        onChange={(e) => setContent({ ...content, title: e.target.value })}
                        placeholder="Main Page Headline"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Subtitle / Value Proposition
                      </label>
                      <textarea
                        rows={3}
                        value={content.description || ''}
                        onChange={(e) => setContent({ ...content, description: e.target.value })}
                        placeholder="Description of the service or page..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Supporting Trust Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={content.supportingText || ''}
                        onChange={(e) => setContent({ ...content, supportingText: e.target.value })}
                        placeholder="e.g. Processed 100% locally in your browser"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Search Heading Prompt
                      </label>
                      <input
                        type="text"
                        value={content.searchPrompt || ''}
                        onChange={(e) => setContent({ ...content, searchPrompt: e.target.value })}
                        placeholder="What do you want to do?"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                          Quick Search Links ({content.quickLinks?.length || 0})
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const links = content.quickLinks || [];
                            setContent({
                              ...content,
                              quickLinks: [
                                ...links,
                                { label: 'new converter', slug: 'compress-pdf' },
                              ],
                            });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Link
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(content.quickLinks || []).map((link: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl">
                            <input
                              type="text"
                              value={link.label || ''}
                              onChange={(e) => {
                                const updated = [...(content.quickLinks || [])];
                                updated[idx] = { ...updated[idx], label: e.target.value };
                                setContent({ ...content, quickLinks: updated });
                              }}
                              placeholder="Label"
                              className="w-1/2 px-2 py-1 bg-white border border-[#E4E2F0] rounded text-xs"
                            />
                            <input
                              type="text"
                              value={link.slug || ''}
                              onChange={(e) => {
                                const updated = [...(content.quickLinks || [])];
                                updated[idx] = { ...updated[idx], slug: e.target.value };
                                setContent({ ...content, quickLinks: updated });
                              }}
                              placeholder="Tool slug (e.g. merge-pdf)"
                              className="w-1/2 px-2 py-1 bg-white border border-[#E4E2F0] rounded text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = (content.quickLinks || []).filter((_: any, i: number) => i !== idx);
                                setContent({ ...content, quickLinks: updated });
                              }}
                              className="p-1 text-red-500 hover:text-red-700"
                              title="Delete Link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. POPULAR TOOLS */}
                {block.type === 'popular_tools' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={content.heading || ''}
                        onChange={(e) => setContent({ ...content, heading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Subheading
                      </label>
                      <input
                        type="text"
                        value={content.subheading || ''}
                        onChange={(e) => setContent({ ...content, subheading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Explore Link Text
                      </label>
                      <input
                        type="text"
                        value={content.exploreText || ''}
                        onChange={(e) => setContent({ ...content, exploreText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Explore Link URL
                      </label>
                      <input
                        type="text"
                        value={content.exploreHref || ''}
                        onChange={(e) => setContent({ ...content, exploreHref: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                  </div>
                )}

                {/* 3. DISCOVERY HUBS */}
                {block.type === 'hubs' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={content.heading || ''}
                        onChange={(e) => setContent({ ...content, heading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Subheading
                      </label>
                      <input
                        type="text"
                        value={content.subheading || ''}
                        onChange={(e) => setContent({ ...content, subheading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      />
                    </div>
                    <div className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-[#7C3AED] uppercase">Image Tools Hub Card</h4>
                      <input
                        type="text"
                        placeholder="Image Hub Title"
                        value={content.imageHubTitle || ''}
                        onChange={(e) => setContent({ ...content, imageHubTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                      />
                      <textarea
                        rows={2}
                        placeholder="Image Hub Description"
                        value={content.imageHubDescription || ''}
                        onChange={(e) => setContent({ ...content, imageHubDescription: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Button Label"
                          value={content.imageHubButton || ''}
                          onChange={(e) => setContent({ ...content, imageHubButton: e.target.value })}
                          className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Button Link"
                          value={content.imageHubHref || ''}
                          onChange={(e) => setContent({ ...content, imageHubHref: e.target.value })}
                          className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-[#3B82F6] uppercase">PDF Tools Hub Card</h4>
                      <input
                        type="text"
                        placeholder="PDF Hub Title"
                        value={content.pdfHubTitle || ''}
                        onChange={(e) => setContent({ ...content, pdfHubTitle: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                      />
                      <textarea
                        rows={2}
                        placeholder="PDF Hub Description"
                        value={content.pdfHubDescription || ''}
                        onChange={(e) => setContent({ ...content, pdfHubDescription: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Button Label"
                          value={content.pdfHubButton || ''}
                          onChange={(e) => setContent({ ...content, pdfHubButton: e.target.value })}
                          className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Button Link"
                          value={content.pdfHubHref || ''}
                          onChange={(e) => setContent({ ...content, pdfHubHref: e.target.value })}
                          className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. FEATURES GRID & SINGLE FEATURE */}
                {(block.type === 'features' || block.type === 'feature') && (
                  <div className="space-y-4">
                    {block.type === 'features' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                            Section Heading
                          </label>
                          <input
                            type="text"
                            value={content.heading || ''}
                            onChange={(e) => setContent({ ...content, heading: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                            Subheading
                          </label>
                          <input
                            type="text"
                            value={content.subheading || ''}
                            onChange={(e) => setContent({ ...content, subheading: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                          />
                        </div>
                      </>
                    )}

                    {block.type === 'feature' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                            Feature Title
                          </label>
                          <input
                            type="text"
                            value={content.title || ''}
                            onChange={(e) => setContent({ ...content, title: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                            Feature Description
                          </label>
                          <textarea
                            rows={3}
                            value={content.description || ''}
                            onChange={(e) => setContent({ ...content, description: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                            Icon
                          </label>
                          <select
                            value={content.icon || 'ShieldCheck'}
                            onChange={(e) => setContent({ ...content, icon: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                          >
                            <option value="ShieldCheck">Shield Check (Security)</option>
                            <option value="Lock">Lock (Privacy)</option>
                            <option value="Zap">Zap (Speed)</option>
                            <option value="Smartphone">Smartphone (Mobile)</option>
                            <option value="Sparkles">Sparkles (Quality)</option>
                            <option value="Cpu">CPU (Hardware)</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                            Feature Cards ({content.items?.length || 0})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const items = content.items || [];
                              setContent({
                                ...content,
                                items: [
                                  ...items,
                                  {
                                    id: `feat-${Date.now()}`,
                                    title: `Feature ${items.length + 1}`,
                                    description: 'Describe feature benefit here.',
                                    icon: 'ShieldCheck',
                                  },
                                ],
                              });
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Card
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(content.items || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#7C3AED]">Card {idx + 1}</span>
                                <div className="flex items-center gap-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const items = [...content.items];
                                        const temp = items[idx - 1];
                                        items[idx - 1] = items[idx];
                                        items[idx] = temp;
                                        setContent({ ...content, items });
                                      }}
                                      className="p-1 text-slate-500 hover:text-slate-800"
                                      title="Move Up"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                  )}
                                  {idx < (content.items || []).length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const items = [...content.items];
                                        const temp = items[idx + 1];
                                        items[idx + 1] = items[idx];
                                        items[idx] = temp;
                                        setContent({ ...content, items });
                                      }}
                                      className="p-1 text-slate-500 hover:text-slate-800"
                                      title="Move Down"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const items = content.items.filter((_: any, i: number) => i !== idx);
                                      setContent({ ...content, items });
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700"
                                    title="Delete Card"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <input
                                type="text"
                                placeholder="Title"
                                value={item.title || ''}
                                onChange={(e) => {
                                  const items = [...content.items];
                                  items[idx] = { ...items[idx], title: e.target.value };
                                  setContent({ ...content, items });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                              />
                              <textarea
                                rows={2}
                                placeholder="Description"
                                value={item.description || ''}
                                onChange={(e) => {
                                  const items = [...content.items];
                                  items[idx] = { ...items[idx], description: e.target.value };
                                  setContent({ ...content, items });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                              />
                              <select
                                value={item.icon || 'ShieldCheck'}
                                onChange={(e) => {
                                  const items = [...content.items];
                                  items[idx] = { ...items[idx], icon: e.target.value };
                                  setContent({ ...content, items });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                              >
                                <option value="ShieldCheck">Shield Check</option>
                                <option value="Lock">Lock</option>
                                <option value="Zap">Zap</option>
                                <option value="Smartphone">Smartphone</option>
                                <option value="Sparkles">Sparkles</option>
                                <option value="Cpu">CPU</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. PRICING BLOCK */}
                {block.type === 'pricing' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Badge Text
                      </label>
                      <input
                        type="text"
                        value={content.badge || ''}
                        onChange={(e) => setContent({ ...content, badge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={content.title || ''}
                        onChange={(e) => setContent({ ...content, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={content.description || ''}
                        onChange={(e) => setContent({ ...content, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                          Price Display
                        </label>
                        <input
                          type="text"
                          value={content.price || '$0'}
                          onChange={(e) => setContent({ ...content, price: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                          Price Period
                        </label>
                        <input
                          type="text"
                          value={content.period || '/ forever'}
                          onChange={(e) => setContent({ ...content, period: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                          Included Benefits ({content.items?.length || 0})
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const items = content.items || [];
                            setContent({
                              ...content,
                              items: [...items, 'New plan benefit'],
                            });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Benefit
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(content.items || []).map((bullet: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => {
                                const items = [...(content.items || [])];
                                items[idx] = e.target.value;
                                setContent({ ...content, items });
                              }}
                              className="flex-1 px-3 py-1.5 bg-[#FAF9FF] border border-[#E4E2F0] rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const items = content.items.filter((_: any, i: number) => i !== idx);
                                setContent({ ...content, items });
                              }}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={content.buttonText || ''}
                          onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                          Button Link URL
                        </label>
                        <input
                          type="text"
                          value={content.buttonHref || ''}
                          onChange={(e) => setContent({ ...content, buttonHref: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. FAQ BLOCK */}
                {block.type === 'faq' && (
                  <div className="space-y-4">
                    {/* Check if it's a multi-item FAQ or single item */}
                    {content.items !== undefined ? (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                            FAQ Question & Answer Pairs ({content.items?.length || 0})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const items = content.items || [];
                              setContent({
                                ...content,
                                items: [
                                  ...items,
                                  {
                                    question: 'Frequently Asked Question?',
                                    answer: 'Detailed helpful answer explaining the topic clearly.',
                                  },
                                ],
                              });
                            }}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add FAQ
                          </button>
                        </div>
                        <div className="space-y-3">
                          {(content.items || []).map((faq: any, idx: number) => (
                            <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#7C3AED]">Q&A #{idx + 1}</span>
                                <div className="flex items-center gap-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const items = [...content.items];
                                        const temp = items[idx - 1];
                                        items[idx - 1] = items[idx];
                                        items[idx] = temp;
                                        setContent({ ...content, items });
                                      }}
                                      className="p-1 text-slate-500 hover:text-slate-800"
                                      title="Move Up"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                  )}
                                  {idx < (content.items || []).length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const items = [...content.items];
                                        const temp = items[idx + 1];
                                        items[idx + 1] = items[idx];
                                        items[idx] = temp;
                                        setContent({ ...content, items });
                                      }}
                                      className="p-1 text-slate-500 hover:text-slate-800"
                                      title="Move Down"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const items = content.items.filter((_: any, i: number) => i !== idx);
                                      setContent({ ...content, items });
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700"
                                    title="Delete FAQ"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <input
                                type="text"
                                placeholder="Question"
                                value={faq.question || ''}
                                onChange={(e) => {
                                  const items = [...content.items];
                                  items[idx] = { ...items[idx], question: e.target.value };
                                  setContent({ ...content, items });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs font-bold"
                              />
                              <textarea
                                rows={3}
                                placeholder="Answer"
                                value={faq.answer || ''}
                                onChange={(e) => {
                                  const items = [...content.items];
                                  items[idx] = { ...items[idx], answer: e.target.value };
                                  setContent({ ...content, items });
                                }}
                                className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                            Question
                          </label>
                          <input
                            type="text"
                            value={content.question || ''}
                            onChange={(e) => setContent({ ...content, question: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                            Answer
                          </label>
                          <textarea
                            rows={4}
                            value={content.answer || ''}
                            onChange={(e) => setContent({ ...content, answer: e.target.value })}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 7. IMAGE BLOCK */}
                {block.type === 'image' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                          Image Source URL
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsMediaPickerOpen(true)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F0FD] text-[#7C3AED] hover:bg-[#EDE9FE] rounded-lg text-xs font-bold transition-colors"
                        >
                          <FolderOpen className="w-3.5 h-3.5" /> Select from Media Library
                        </button>
                      </div>
                      <input
                        type="text"
                        value={content.src || ''}
                        onChange={(e) => setContent({ ...content, src: e.target.value })}
                        placeholder="https://... or /images/..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    {content.src && (
                      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center max-h-48 overflow-hidden">
                        <img
                          src={content.src}
                          alt={content.alt || 'Preview'}
                          className="max-h-40 object-contain rounded"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Alt Text (Accessibility & SEO)
                      </label>
                      <input
                        type="text"
                        value={content.alt || ''}
                        onChange={(e) => setContent({ ...content, alt: e.target.value })}
                        placeholder="Descriptive image summary"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Caption (Optional)
                      </label>
                      <input
                        type="text"
                        value={content.caption || ''}
                        onChange={(e) => setContent({ ...content, caption: e.target.value })}
                        placeholder="Image caption text"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                  </div>
                )}

                {/* 8. CTA BUTTON */}
                {block.type === 'cta' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={content.label || content.buttonText || ''}
                        onChange={(e) =>
                          setContent({ ...content, label: e.target.value, buttonText: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Button Link URL
                      </label>
                      <input
                        type="text"
                        value={content.href || ''}
                        onChange={(e) => setContent({ ...content, href: e.target.value })}
                        placeholder="/tools/compress-image or #section"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Style Variant
                      </label>
                      <select
                        value={content.variant || 'primary'}
                        onChange={(e) => setContent({ ...content, variant: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      >
                        <option value="primary">Primary (Gradient Purple)</option>
                        <option value="secondary">Secondary (Dark)</option>
                        <option value="outline">Outline</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 9. TEXT LINK */}
                {block.type === 'link' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Link Text
                      </label>
                      <input
                        type="text"
                        value={content.text || ''}
                        onChange={(e) => setContent({ ...content, text: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Destination URL
                      </label>
                      <input
                        type="text"
                        value={content.href || ''}
                        onChange={(e) => setContent({ ...content, href: e.target.value })}
                        placeholder="/tools/merge-pdf"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#0F112E]">
                      <input
                        type="checkbox"
                        checked={Boolean(content.isExternal)}
                        onChange={(e) => setContent({ ...content, isExternal: e.target.checked })}
                        className="rounded border-[#E4E2F0] text-[#7C3AED]"
                      />
                      <span>Open in new tab (External link)</span>
                    </label>
                  </div>
                )}

                {/* 10. HEADING */}
                {block.type === 'heading' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Heading Level
                      </label>
                      <select
                        value={content.level || 2}
                        onChange={(e) => setContent({ ...content, level: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      >
                        <option value={1}>H1 (Main Heading)</option>
                        <option value={2}>H2 (Section Header)</option>
                        <option value={3}>H3 (Sub-Header)</option>
                        <option value={4}>H4 (Minor Header)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Heading Text
                      </label>
                      <input
                        type="text"
                        value={content.text || ''}
                        onChange={(e) => setContent({ ...content, text: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                  </div>
                )}

                {/* 11. PARAGRAPH */}
                {block.type === 'paragraph' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Paragraph Content
                    </label>
                    <textarea
                      rows={6}
                      value={content.text || ''}
                      onChange={(e) => setContent({ ...content, text: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                    />
                  </div>
                )}

                {/* 12. RICH TEXT */}
                {block.type === 'rich_text' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        HTML Content
                      </label>
                      <textarea
                        rows={8}
                        value={content.html || ''}
                        onChange={(e) => setContent({ ...content, html: e.target.value })}
                        className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-[#0F112E]"
                        placeholder="<p>Formatted HTML content...</p>"
                      />
                    </div>
                  </div>
                )}

                {/* 13. SECTION */}
                {block.type === 'section' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={content.title || ''}
                        onChange={(e) => setContent({ ...content, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Section Description
                      </label>
                      <textarea
                        rows={3}
                        value={content.description || ''}
                        onChange={(e) => setContent({ ...content, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                  </div>
                )}

                {/* 14. INTRO */}
                {block.type === 'intro' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={content.heading || ''}
                        onChange={(e) => setContent({ ...content, heading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Introduction Text
                      </label>
                      <textarea
                        rows={6}
                        value={content.text || ''}
                        onChange={(e) => setContent({ ...content, text: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                  </div>
                )}

                {/* 15. HOW TO USE */}
                {(block.type === 'how_to_use' || block.type === 'how_to') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={content.heading || ''}
                        onChange={(e) => setContent({ ...content, heading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Description
                      </label>
                      <input
                        type="text"
                        value={content.description || ''}
                        onChange={(e) => setContent({ ...content, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                          Instruction Steps ({content.items?.length || 0})
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const items = content.items || [];
                            setContent({
                              ...content,
                              items: [
                                ...items,
                                { id: `step-${Date.now()}`, title: `Step ${items.length + 1}`, description: '' },
                              ],
                            });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Step
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(content.items || []).map((step: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#7C3AED]">Step {idx + 1}</span>
                              <div className="flex items-center gap-1">
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const items = [...content.items];
                                      const temp = items[idx - 1];
                                      items[idx - 1] = items[idx];
                                      items[idx] = temp;
                                      setContent({ ...content, items });
                                    }}
                                    className="p-1 text-slate-500 hover:text-slate-800"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3 h-3" />
                                  </button>
                                )}
                                {idx < (content.items || []).length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const items = [...content.items];
                                      const temp = items[idx + 1];
                                      items[idx + 1] = items[idx];
                                      items[idx] = temp;
                                      setContent({ ...content, items });
                                    }}
                                    className="p-1 text-slate-500 hover:text-slate-800"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3 h-3" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const items = content.items.filter((_: any, i: number) => i !== idx);
                                    setContent({ ...content, items });
                                  }}
                                  className="p-1 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={step.title || ''}
                              onChange={(e) => {
                                const items = [...content.items];
                                items[idx] = { ...items[idx], title: e.target.value };
                                setContent({ ...content, items });
                              }}
                              placeholder="Step title"
                              className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                            />
                            <textarea
                              rows={2}
                              value={step.description || ''}
                              onChange={(e) => {
                                const items = [...content.items];
                                items[idx] = { ...items[idx], description: e.target.value };
                                setContent({ ...content, items });
                              }}
                              placeholder="Step instructions"
                              className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 16. PRIVACY NOTE */}
                {block.type === 'privacy_note' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={content.title || ''}
                        onChange={(e) => setContent({ ...content, title: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={content.description || ''}
                        onChange={(e) => setContent({ ...content, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                          Trust Points ({content.bullets?.length || 0})
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const bullets = content.bullets || [];
                            setContent({ ...content, bullets: [...bullets, 'New guarantee point'] });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Point
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(content.bullets || []).map((bullet: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => {
                                const bullets = [...(content.bullets || [])];
                                bullets[idx] = e.target.value;
                                setContent({ ...content, bullets });
                              }}
                              className="flex-1 px-3 py-1.5 bg-[#FAF9FF] border border-[#E4E2F0] rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const bullets = content.bullets.filter((_: any, i: number) => i !== idx);
                                setContent({ ...content, bullets });
                              }}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 17. USE CASES */}
                {block.type === 'use_cases' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={content.heading || ''}
                        onChange={(e) => setContent({ ...content, heading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Description
                      </label>
                      <input
                        type="text"
                        value={content.description || ''}
                        onChange={(e) => setContent({ ...content, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                          Use Cases ({content.items?.length || 0})
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const items = content.items || [];
                            setContent({
                              ...content,
                              items: [
                                ...items,
                                { title: 'New Scenario', description: 'Describe workflow scenario here.' },
                              ],
                            });
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Case
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(content.items || []).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#7C3AED]">Case {idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const items = content.items.filter((_: any, i: number) => i !== idx);
                                  setContent({ ...content, items });
                                }}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => {
                                const items = [...content.items];
                                items[idx] = { ...items[idx], title: e.target.value };
                                setContent({ ...content, items });
                              }}
                              placeholder="Title"
                              className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                            />
                            <textarea
                              rows={2}
                              value={item.description || ''}
                              onChange={(e) => {
                                const items = [...content.items];
                                items[idx] = { ...items[idx], description: e.target.value };
                                setContent({ ...content, items });
                              }}
                              placeholder="Description"
                              className="w-full px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 18. RELATED TOOLS */}
                {block.type === 'related_tools' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={content.heading || ''}
                        onChange={(e) => setContent({ ...content, heading: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-2">
                        Select Related Tools (Choose up to 4)
                      </label>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto p-2 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl">
                        {allCanonicalTools.map((t) => {
                          const currentSlugs = content.slugs || [];
                          const isChecked = currentSlugs.includes(t.slug);
                          return (
                            <label
                              key={t.slug}
                              className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                                isChecked ? 'bg-[#F4F0FD] text-[#7C3AED] font-bold' : 'hover:bg-slate-50 text-[#0F112E]'
                              }`}
                            >
                              <span>{t.name}</span>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (currentSlugs.length < 4) {
                                      setContent({ ...content, slugs: [...currentSlugs, t.slug] });
                                    }
                                  } else {
                                    setContent({
                                      ...content,
                                      slugs: currentSlugs.filter((s: string) => s !== t.slug),
                                    });
                                  }
                                }}
                                className="rounded border-[#E4E2F0] text-[#7C3AED] focus:ring-[#7C3AED]"
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Drawer Footer Actions */}
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
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#7C3AED] text-white hover:bg-[#6D28D9] transition-colors shadow-sm"
                  >
                    <Check className="w-4 h-4" /> Apply Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        currentUrl={content.src}
        title="Choose Image Asset"
      />
    </>
  );
}
