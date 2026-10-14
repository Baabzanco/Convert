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
} from 'lucide-react';
import { UniversalContentBlock } from '@/lib/cms/blocks';
import { getAllTools } from '@/lib/tools';

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
  const allCanonicalTools = getAllTools();

  useEffect(() => {
    if (block) {
      setContent(JSON.parse(JSON.stringify(block.content || {})));
    }
  }, [block]);

  if (!isOpen || !block) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBlock({
      ...block,
      content,
      // sync root properties for backward-compatibility
      ...content,
    });
    onClose();
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
      default:
        return <FileText className="w-5 h-5 text-[#7C3AED]" />;
    }
  };

  const getBlockTitle = () => {
    switch (block.type) {
      case 'hero':
        return 'Edit Hero & Value Proposition';
      case 'intro':
        return 'Edit Introduction';
      case 'how_to_use':
      case 'how_to':
        return 'Edit How-To Steps';
      case 'features':
        return 'Edit Features Grid';
      case 'supported_formats':
        return 'Edit Supported Formats';
      case 'technical_details':
        return 'Edit Technical Details & Limitations';
      case 'privacy_note':
        return 'Edit Privacy & Guarantee';
      case 'use_cases':
        return 'Edit Use Cases';
      case 'faq':
        return 'Edit FAQs';
      case 'related_tools':
        return 'Edit Related Tools';
      case 'cta':
        return 'Edit Call to Action';
      case 'heading':
        return 'Edit Heading';
      case 'paragraph':
        return 'Edit Paragraph';
      default:
        return `Edit Block (${block.type})`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden pointer-events-none"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-auto fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="w-screen max-w-md bg-white border-l border-[#E4E2F0] shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
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
                  <p className="text-xs text-[#5E6488]">ID: {block.id}</p>
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

            {/* Drawer Body Forms */}
            <form onSubmit={handleApply} className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* HERO BLOCK */}
              {block.type === 'hero' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-indigo-950">
                      Canonical H1 Protection Active
                    </p>
                    <p className="text-xs text-indigo-800 leading-relaxed">
                      The primary tool H1 title is strictly managed by canonical tool configuration to preserve search engine rankings, routing stability, and heading hierarchy.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Canonical Page Title (Protected)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={content.title || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] bg-[#F4F3FA] text-sm text-[#5E6488] cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Badge Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={content.badge || ''}
                      onChange={(e) => setContent({ ...content, badge: e.target.value })}
                      placeholder="e.g. Free Online Converter"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Value Proposition / Subheading
                    </label>
                    <textarea
                      rows={3}
                      value={content.description || ''}
                      onChange={(e) => setContent({ ...content, description: e.target.value })}
                      placeholder="High-level value proposition of this tool..."
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
                </div>
              )}

              {/* INTRO BLOCK */}
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
                      placeholder="About this tool"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                      placeholder="Detailed introduction explaining this utility..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
              )}

              {/* HOW TO USE BLOCK */}
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                        <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#7C3AED]">Step {idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = (content.items || []).filter((_: any, i: number) => i !== idx);
                                setContent({ ...content, items: newItems });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                              aria-label={`Delete step ${idx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={step.title || ''}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[idx] = { ...newItems[idx], title: e.target.value };
                              setContent({ ...content, items: newItems });
                            }}
                            placeholder="Step Title"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs font-bold text-[#0F112E]"
                          />
                          <textarea
                            rows={2}
                            value={step.description || ''}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[idx] = { ...newItems[idx], description: e.target.value };
                              setContent({ ...content, items: newItems });
                            }}
                            placeholder="Step description..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs text-[#5E6488]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FEATURES BLOCK */}
              {block.type === 'features' && (
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
                      Description
                    </label>
                    <input
                      type="text"
                      value={content.description || ''}
                      onChange={(e) => setContent({ ...content, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                        Features List ({content.items?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const items = content.items || [];
                          setContent({
                            ...content,
                            items: [
                              ...items,
                              { id: `feat-${Date.now()}`, title: 'New Feature', description: '', icon: 'Zap' },
                            ],
                          });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Feature
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(content.items || []).map((feat: any, idx: number) => (
                        <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#7C3AED]">Feature {idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newItems = (content.items || []).filter((_: any, i: number) => i !== idx);
                                setContent({ ...content, items: newItems });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={feat.title || ''}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[idx] = { ...newItems[idx], title: e.target.value };
                              setContent({ ...content, items: newItems });
                            }}
                            placeholder="Feature Title"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs font-bold text-[#0F112E]"
                          />
                          <textarea
                            rows={2}
                            value={feat.description || ''}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[idx] = { ...newItems[idx], description: e.target.value };
                              setContent({ ...content, items: newItems });
                            }}
                            placeholder="Feature Description"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs text-[#5E6488]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUPPORTED FORMATS BLOCK */}
              {block.type === 'supported_formats' && (
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
                      Accepted Input Formats (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(content.inputFormats) ? content.inputFormats.join(', ') : ''}
                      onChange={(e) => {
                        const formats = e.target.value
                          .split(',')
                          .map((s) => s.trim().toUpperCase())
                          .filter(Boolean);
                        setContent({ ...content, inputFormats: formats });
                      }}
                      placeholder="JPG, JPEG, PNG"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Available Output Formats (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={Array.isArray(content.outputFormats) ? content.outputFormats.join(', ') : ''}
                      onChange={(e) => {
                        const formats = e.target.value
                          .split(',')
                          .map((s) => s.trim().toUpperCase())
                          .filter(Boolean);
                        setContent({ ...content, outputFormats: formats });
                      }}
                      placeholder="PNG, WEBP"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Format Notes
                    </label>
                    <input
                      type="text"
                      value={content.notes || ''}
                      onChange={(e) => setContent({ ...content, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
              )}

              {/* TECHNICAL DETAILS & LIMITATIONS BLOCK */}
              {block.type === 'technical_details' && (
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                        Technical Specifications
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const specs = content.specs || [];
                          setContent({
                            ...content,
                            specs: [...specs, { label: 'Spec Name', value: 'Spec Value' }],
                          });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Spec
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(content.specs || []).map((spec: any, idx: number) => (
                        <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-1 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const newSpecs = (content.specs || []).filter((_: any, i: number) => i !== idx);
                              setContent({ ...content, specs: newSpecs });
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={spec.label || ''}
                            onChange={(e) => {
                              const newSpecs = [...(content.specs || [])];
                              newSpecs[idx] = { ...newSpecs[idx], label: e.target.value };
                              setContent({ ...content, specs: newSpecs });
                            }}
                            placeholder="Specification Label"
                            className="w-5/6 px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs font-bold text-[#0F112E]"
                          />
                          <input
                            type="text"
                            value={spec.value || ''}
                            onChange={(e) => {
                              const newSpecs = [...(content.specs || [])];
                              newSpecs[idx] = { ...newSpecs[idx], value: e.target.value };
                              setContent({ ...content, specs: newSpecs });
                            }}
                            placeholder="Specification Value"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs text-[#5E6488]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Limitations (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={Array.isArray(content.limitations) ? content.limitations.join('\n') : ''}
                      onChange={(e) => {
                        const lims = e.target.value.split('\n').filter((s) => s.trim().length > 0);
                        setContent({ ...content, limitations: lims });
                      }}
                      placeholder="Enter known processing boundaries or hardware constraints..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
              )}

              {/* PRIVACY NOTE BLOCK */}
              {block.type === 'privacy_note' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Privacy Title
                    </label>
                    <input
                      type="text"
                      value={content.title || ''}
                      onChange={(e) => setContent({ ...content, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Trust Bullets (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={Array.isArray(content.bullets) ? content.bullets.join('\n') : ''}
                      onChange={(e) => {
                        const bullets = e.target.value.split('\n').filter((s) => s.trim().length > 0);
                        setContent({ ...content, bullets });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
              )}

              {/* USE CASES BLOCK */}
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                            items: [...items, { title: 'Workflow Name', description: '' }],
                          });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Use Case
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(content.items || []).map((uc: any, idx: number) => (
                        <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = (content.items || []).filter((_: any, i: number) => i !== idx);
                              setContent({ ...content, items: newItems });
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={uc.title || ''}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[idx] = { ...newItems[idx], title: e.target.value };
                              setContent({ ...content, items: newItems });
                            }}
                            placeholder="Use Case Title"
                            className="w-5/6 px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs font-bold text-[#0F112E]"
                          />
                          <textarea
                            rows={2}
                            value={uc.description || ''}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[idx] = { ...newItems[idx], description: e.target.value };
                              setContent({ ...content, items: newItems });
                            }}
                            placeholder="Description of the scenario..."
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs text-[#5E6488]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ BLOCK */}
              {block.type === 'faq' && (
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
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5E6488]">
                        FAQ Items ({content.items?.length || 0})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const items = content.items || [];
                          setContent({
                            ...content,
                            items: [...items, { question: '', answer: '' }],
                          });
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:underline"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add FAQ
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(content.items || []).map((faq: any, idx: number) => (
                        <div key={idx} className="p-3 bg-[#FAF9FF] border border-[#E4E2F0] rounded-xl space-y-2 relative">
                          <button
                            type="button"
                            onClick={() => {
                              const newItems = (content.items || []).filter((_: any, i: number) => i !== idx);
                              setContent({ ...content, items: newItems });
                            }}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="text"
                            value={faq.question || ''}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[idx] = { ...newItems[idx], question: e.target.value };
                              setContent({ ...content, items: newItems });
                            }}
                            placeholder="Question"
                            className="w-5/6 px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs font-bold text-[#0F112E]"
                          />
                          <textarea
                            rows={3}
                            value={faq.answer || ''}
                            onChange={(e) => {
                              const newItems = [...(content.items || [])];
                              newItems[idx] = { ...newItems[idx], answer: e.target.value };
                              setContent({ ...content, items: newItems });
                            }}
                            placeholder="Answer"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-[#E4E2F0] text-xs text-[#5E6488]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* RELATED TOOLS BLOCK */}
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-2">
                      Select Up to 4 Canonical Related Tools
                    </label>
                    <div className="max-h-60 overflow-y-auto space-y-1.5 border border-[#E4E2F0] rounded-xl p-2.5">
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
                    <p className="text-xs text-[#5E6488] mt-1">
                      Currently selected: {(content.slugs || []).length} of 4 max.
                    </p>
                  </div>
                </div>
              )}

              {/* CTA BLOCK */}
              {block.type === 'cta' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      CTA Title
                    </label>
                    <input
                      type="text"
                      value={content.title || ''}
                      onChange={(e) => setContent({ ...content, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      CTA Description
                    </label>
                    <textarea
                      rows={3}
                      value={content.description || ''}
                      onChange={(e) => setContent({ ...content, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={content.buttonText || ''}
                      onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
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
                      placeholder="/tools/compress-image"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
              )}

              {/* HEADING BLOCK */}
              {block.type === 'heading' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Heading Level
                    </label>
                    <select
                      value={content.level || 2}
                      onChange={(e) => setContent({ ...content, level: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    >
                      <option value={2}>H2 (Section Header)</option>
                      <option value={3}>H3 (Sub-Header)</option>
                    </select>
                    <p className="text-xs text-[#5E6488] mt-1 italic">
                      H1 is reserved for the primary tool title to prevent competing H1s.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                      Heading Text
                    </label>
                    <input
                      type="text"
                      value={content.text || ''}
                      onChange={(e) => setContent({ ...content, text: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
              )}

              {/* PARAGRAPH BLOCK */}
              {block.type === 'paragraph' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5E6488] mb-1.5">
                    Paragraph Text
                  </label>
                  <textarea
                    rows={6}
                    value={content.text || ''}
                    onChange={(e) => setContent({ ...content, text: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E4E2F0] text-sm text-[#0F112E] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
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
  );
}
