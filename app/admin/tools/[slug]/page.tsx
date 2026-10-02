'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  History,
  Plus,
  Trash2,
  Wrench,
  Search,
  Globe,
  Settings,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Check,
  X,
  HelpCircle,
  ListOrdered,
  Layers,
  Share2,
  Image as ImageIcon,
} from 'lucide-react';
import { getAllTools, ToolDefinition } from '@/lib/tools';
import MediaPickerModal from '@/components/admin/media/MediaPickerModal';

interface ToolContentData {
  id?: string;
  toolSlug: string;
  customTitle: string | null;
  customH1: string | null;
  customDescription: string | null;
  customIntro: string | null;
  customValueProp: string | null;
  customHowTo: { title: string; description: string }[] | null;
  customFeatures: { title: string; description: string }[] | null;
  customFaq: { question: string; answer: string }[] | null;
  customRelatedTools: string[] | null;
  isPublished: boolean;
  updatedAt: string | null;
  seo?: {
    seoTitle: string | null;
    metaDescription: string | null;
    canonicalUrl: string | null;
    robotsIndex: boolean;
    robotsFollow: boolean;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
    schemaType: string | null;
    schemaJson: any | null;
    focusKeyword: string | null;
  } | null;
}

interface ToolEditorProps {
  params: Promise<{ slug: string }>;
}

export default function AdminToolEditor({ params }: ToolEditorProps) {
  const { slug } = use(params);
  const router = useRouter();

  const [canonical, setCanonical] = useState<ToolDefinition | null>(null);
  const [override, setOverride] = useState<ToolContentData | null>(null);
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'HOW_TO' | 'FEATURES' | 'FAQ' | 'RELATED' | 'SEO' | 'PUBLISHING'>('CONTENT');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Form Fields - Basic
  const [customTitle, setCustomTitle] = useState('');
  const [customH1, setCustomH1] = useState('');
  const [customIntro, setCustomIntro] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customValueProp, setCustomValueProp] = useState('');
  const [revisionReason, setRevisionReason] = useState('');

  // Form Fields - Structured
  const [howToSteps, setHowToSteps] = useState<{ title: string; description: string }[]>([]);
  const [featuresList, setFeaturesList] = useState<{ title: string; description: string }[]>([]);
  const [faqList, setFaqList] = useState<{ question: string; answer: string }[]>([]);
  const [relatedToolsList, setRelatedToolsList] = useState<string[]>([]);

  // Form Fields - SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [schemaJsonText, setSchemaJsonText] = useState('');
  const [jsonValidationResult, setJsonValidationResult] = useState<{ valid: boolean; message: string } | null>(null);

  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const all25Tools = getAllTools();
  const otherTools = all25Tools.filter((t) => t.slug !== slug);

  const fetchToolData = async (preserveStatus = false) => {
    setIsLoading(true);
    if (!preserveStatus) {
      setStatusMessage(null);
    }
    try {
      const res = await fetch(`/api/admin/tools/${slug}`);
      if (!res.ok) {
        throw new Error('Tool not found or server error.');
      }
      const data = await res.json();
      setCanonical(data.canonical);
      const ov = data.override;
      setOverride(ov);

      if (ov) {
        setCustomTitle(ov.customTitle || '');
        setCustomH1(ov.customH1 || '');
        setCustomIntro(ov.customIntro || '');
        setCustomDescription(ov.customDescription || '');
        setCustomValueProp(ov.customValueProp || '');
        setHowToSteps(Array.isArray(ov.customHowTo) ? ov.customHowTo : []);
        setFeaturesList(Array.isArray(ov.customFeatures) ? ov.customFeatures : []);
        setFaqList(Array.isArray(ov.customFaq) ? ov.customFaq : []);
        setRelatedToolsList(Array.isArray(ov.customRelatedTools) ? ov.customRelatedTools : []);

        if (ov.seo) {
          setSeoTitle(ov.seo.seoTitle || '');
          setMetaDescription(ov.seo.metaDescription || '');
          setCanonicalUrl(ov.seo.canonicalUrl || '');
          setRobotsIndex(ov.seo.robotsIndex !== false);
          setRobotsFollow(ov.seo.robotsFollow !== false);
          setOgTitle(ov.seo.ogTitle || '');
          setOgDescription(ov.seo.ogDescription || '');
          setOgImage(ov.seo.ogImage || '');
          setTwitterTitle(ov.seo.twitterTitle || '');
          setTwitterDescription(ov.seo.twitterDescription || '');
          setTwitterImage(ov.seo.twitterImage || '');
          setSchemaJsonText(ov.seo.schemaJson ? JSON.stringify(ov.seo.schemaJson, null, 2) : '');
        }
      } else {
        // No override yet - initialize canonical defaults for convenience
        setCanonicalUrl(`/tools/${slug}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching tool details.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToolData();
  }, [slug]);

  // JSON-LD Validator
  useEffect(() => {
    if (!schemaJsonText.trim()) {
      setJsonValidationResult(null);
      return;
    }
    try {
      JSON.parse(schemaJsonText);
      setJsonValidationResult({ valid: true, message: 'Valid JSON-LD schema syntax.' });
    } catch {
      setJsonValidationResult({ valid: false, message: 'Invalid JSON format. Check syntax, commas, and quotes.' });
    }
  }, [schemaJsonText]);

  // How-to handlers
  const handleAddStep = () => {
    setHowToSteps([...howToSteps, { title: '', description: '' }]);
  };
  const handleRemoveStep = (idx: number) => {
    setHowToSteps(howToSteps.filter((_, i) => i !== idx));
  };
  const handleStepChange = (idx: number, field: 'title' | 'description', val: string) => {
    const next = [...howToSteps];
    next[idx][field] = val;
    setHowToSteps(next);
  };
  const handleLoadCanonicalHowTo = () => {
    if (canonical?.howTo) {
      setHowToSteps([...canonical.howTo]);
      setStatusMessage({ type: 'success', text: 'Loaded canonical how-to steps into editor.' });
    }
  };

  // Features handlers
  const handleAddFeature = () => {
    setFeaturesList([...featuresList, { title: '', description: '' }]);
  };
  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };
  const handleFeatureChange = (idx: number, field: 'title' | 'description', val: string) => {
    const next = [...featuresList];
    next[idx][field] = val;
    setFeaturesList(next);
  };
  const handleLoadCanonicalFeatures = () => {
    if (canonical?.features) {
      setFeaturesList([...canonical.features]);
      setStatusMessage({ type: 'success', text: 'Loaded canonical features into editor.' });
    }
  };

  // FAQ handlers
  const handleAddFaq = () => {
    setFaqList([...faqList, { question: '', answer: '' }]);
  };
  const handleRemoveFaq = (idx: number) => {
    setFaqList(faqList.filter((_, i) => i !== idx));
  };
  const handleFaqChange = (idx: number, field: 'question' | 'answer', val: string) => {
    const next = [...faqList];
    next[idx][field] = val;
    setFaqList(next);
  };
  const handleLoadCanonicalFaq = () => {
    if (canonical?.faq) {
      setFaqList([...canonical.faq]);
      setStatusMessage({ type: 'success', text: 'Loaded canonical FAQ items into editor.' });
    }
  };

  // Related Tools handlers
  const handleToggleRelatedTool = (toolSlug: string) => {
    if (relatedToolsList.includes(toolSlug)) {
      setRelatedToolsList(relatedToolsList.filter((s) => s !== toolSlug));
    } else {
      setRelatedToolsList([...relatedToolsList, toolSlug]);
    }
  };
  const handleLoadCanonicalRelated = () => {
    if (canonical?.relatedTools) {
      setRelatedToolsList([...canonical.relatedTools]);
      setStatusMessage({ type: 'success', text: 'Loaded canonical related tools into editor.' });
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setStatusMessage(null);

    // Validate JSON-LD if present
    let parsedSchema: any = null;
    if (schemaJsonText.trim()) {
      try {
        parsedSchema = JSON.parse(schemaJsonText);
      } catch {
        setStatusMessage({ type: 'error', text: 'Cannot save: JSON-LD structured data contains syntax errors.' });
        setIsSaving(false);
        return;
      }
    }

    try {
      const payload = {
        customTitle: customTitle.trim() || null,
        customH1: customH1.trim() || null,
        customIntro: customIntro.trim() || null,
        customDescription: customDescription.trim() || null,
        customValueProp: customValueProp.trim() || null,
        customHowTo: howToSteps.length > 0 ? howToSteps : null,
        customFeatures: featuresList.length > 0 ? featuresList : null,
        customFaq: faqList.length > 0 ? faqList : null,
        customRelatedTools: relatedToolsList.length > 0 ? relatedToolsList : null,
        reason: revisionReason.trim() || 'Saved draft from admin editor',
        seo: {
          seoTitle: seoTitle.trim() || null,
          metaDescription: metaDescription.trim() || null,
          canonicalUrl: canonicalUrl.trim() || null,
          robotsIndex,
          robotsFollow,
          ogTitle: ogTitle.trim() || null,
          ogDescription: ogDescription.trim() || null,
          ogImage: ogImage.trim() || null,
          twitterTitle: twitterTitle.trim() || null,
          twitterDescription: twitterDescription.trim() || null,
          twitterImage: twitterImage.trim() || null,
          schemaJson: parsedSchema,
        },
      };

      const res = await fetch(`/api/admin/tools/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save tool draft.');
      }

      setRevisionReason('');
      await fetchToolData(true);
      setStatusMessage({ type: 'success', text: 'Draft content saved and revision snapshot created.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/tools/${slug}/publish`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish tool.');

      await fetchToolData(true);
      setStatusMessage({ type: 'success', text: `Tool '${canonical?.name}' is now PUBLISHED with CMS overrides active on public routes.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publish failed.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm(`Are you sure you want to unpublish '${canonical?.name}'? The public page will immediately fall back to canonical code defaults.`)) {
      return;
    }
    setIsPublishing(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/admin/tools/${slug}/unpublish`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to unpublish tool.');

      await fetchToolData(true);
      setStatusMessage({ type: 'warning', text: `Tool unpublished. Public page reverted to canonical defaults.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unpublish failed.';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs text-[#64748B]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#124A57]" />
        <span>Loading tool editor for {slug}...</span>
      </div>
    );
  }

  if (!canonical) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-[#E5E7EB] space-y-3">
        <AlertTriangle className="w-8 h-8 text-[#E11D48] mx-auto" />
        <h2 className="text-base font-bold text-[#17202A]">Tool Not Found</h2>
        <p className="text-xs text-[#64748B]">
          The slug <code className="px-1.5 py-0.5 bg-[#F1F5F9] font-mono">{slug}</code> does not exist in the authoritative 25-tool registry.
        </p>
        <Link
          href="/admin/tools"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#124A57] bg-[#E6F4F1] rounded-lg hover:bg-[#D1EBE5]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tools Directory</span>
        </Link>
      </div>
    );
  }

  const isPublished = Boolean(override?.isPublished);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-subtle">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tools"
            className="p-2 text-[#64748B] hover:text-[#17202A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
            title="Back to Tools"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#17202A]">{canonical.name}</h1>
              {isPublished ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                  <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                  Published CMS
                </span>
              ) : override ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                  <Clock className="w-3 h-3 text-[#F59E0B]" />
                  Draft Overrides Saved
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                  Code Default (No Overrides)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5 font-mono">
              <span>/tools/{canonical.slug}</span>
              <span>•</span>
              <span className="uppercase text-[10px] bg-[#F1F5F9] px-1.5 py-0.2 rounded font-sans text-[#475467]">
                {canonical.category}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preview Draft */}
          <Link
            href={`/admin/tools/${canonical.slug}/preview`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475467] bg-white border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#124A57]" />
            <span>Preview Draft</span>
          </Link>

          {/* Revisions History */}
          <Link
            href={`/admin/tools/${canonical.slug}/revisions`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475467] bg-white border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            <History className="w-3.5 h-3.5" />
            <span>Revisions</span>
          </Link>

          {/* Save Draft */}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#124A57] hover:bg-[#0E3B46] rounded-lg transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Publish / Unpublish */}
          {isPublished ? (
            <button
              onClick={handleUnpublish}
              disabled={isPublishing || isSaving}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-[#92400E] bg-[#FEF3C7] hover:bg-[#FDE68A] rounded-lg transition-colors disabled:opacity-50"
            >
              <span>Unpublish</span>
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isPublishing || isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors shadow-xs disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
            </button>
          )}

          {/* Public Live View */}
          <Link
            href={`/tools/${canonical.slug}`}
            target="_blank"
            className="p-2 text-[#64748B] hover:text-[#17202A] rounded-lg transition-colors"
            title="Open live public URL"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]'
              : statusMessage.type === 'error'
              ? 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]'
              : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-white rounded-xl border border-[#E5E7EB] shadow-subtle">
        {[
          { key: 'CONTENT', label: 'Basic Info', icon: Wrench },
          { key: 'HOW_TO', label: `How-To Steps (${howToSteps.length})`, icon: ListOrdered },
          { key: 'FEATURES', label: `Features (${featuresList.length})`, icon: Sparkles },
          { key: 'FAQ', label: `FAQ (${faqList.length})`, icon: HelpCircle },
          { key: 'RELATED', label: `Related Tools (${relatedToolsList.length})`, icon: Layers },
          { key: 'SEO', label: 'Advanced SEO', icon: Globe },
          { key: 'PUBLISHING', label: 'Publishing & Audit', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-[#124A57] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#17202A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab: Basic Content */}
      {activeTab === 'CONTENT' && (
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-subtle space-y-5">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h2 className="text-sm font-bold text-[#17202A]">Tool Basic Content Overrides</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Any field left empty automatically falls back to the canonical code definition in <code className="font-mono">lib/tools.ts</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="custom-title-input" className="block text-xs font-semibold text-[#17202A] mb-1">
                Display Title Override
              </label>
              <input
                id="custom-title-input"
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={canonical.title}
                className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">
                Canonical: {canonical.title}
              </span>
            </div>

            <div>
              <label htmlFor="custom-h1-input" className="block text-xs font-semibold text-[#17202A] mb-1">
                H1 Main Heading Override
              </label>
              <input
                id="custom-h1-input"
                type="text"
                value={customH1}
                onChange={(e) => setCustomH1(e.target.value)}
                placeholder={canonical.h1}
                className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">
                Canonical: {canonical.h1}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17202A] mb-1">
              Short Description Override
            </label>
            <textarea
              rows={2}
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder={canonical.description}
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
            />
            <span className="text-[10px] text-[#64748B] mt-0.5 block">
              Canonical: {canonical.description}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17202A] mb-1">
              Intro Paragraph Override
            </label>
            <textarea
              rows={4}
              value={customIntro}
              onChange={(e) => setCustomIntro(e.target.value)}
              placeholder={canonical.intro}
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
            />
            <span className="text-[10px] text-[#64748B] mt-0.5 block line-clamp-2">
              Canonical: {canonical.intro}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17202A] mb-1">
              Value Proposition Override
            </label>
            <textarea
              rows={2}
              value={customValueProp}
              onChange={(e) => setCustomValueProp(e.target.value)}
              placeholder={canonical.valueProposition || 'Value proposition...'}
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#17202A] mb-1">
              Revision Log Note (Optional)
            </label>
            <input
              type="text"
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              placeholder="e.g. Updated H1 and intro for seasonal SEO push"
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
            />
          </div>
        </div>
      )}

      {/* Tab: How-To Steps */}
      {activeTab === 'HOW_TO' && (
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#17202A]">How-To Steps Editor</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Define the step-by-step instructions displayed on the public tool page.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadCanonicalHowTo}
                className="px-2.5 py-1 text-xs font-semibold text-[#475467] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
              >
                Load Canonical Defaults
              </button>
              <button
                onClick={handleAddStep}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#124A57] hover:bg-[#0E3B46] rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </button>
            </div>
          </div>

          {howToSteps.length === 0 ? (
            <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1] space-y-2">
              <ListOrdered className="w-6 h-6 text-[#94A3B8] mx-auto" />
              <div className="text-xs font-semibold text-[#475467]">No Custom Steps Defined</div>
              <p className="text-[11px] text-[#64748B]">
                The public page currently uses the 3 canonical steps from code. Click "Load Canonical Defaults" or "Add Step" to customize.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {howToSteps.map((step, idx) => (
                <div key={idx} className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#124A57] px-2 py-0.5 bg-[#E6F4F1] rounded">
                      Step {idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveStep(idx)}
                      className="p-1 text-[#94A3B8] hover:text-[#E11D48] transition-colors"
                      title="Remove step"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#17202A] mb-1">
                      Step Title
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                      placeholder="e.g. Select or drop your JPG files"
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#17202A] mb-1">
                      Step Description
                    </label>
                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                      placeholder="e.g. Choose files up to 50 MB..."
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57] bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Features */}
      {activeTab === 'FEATURES' && (
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#17202A]">Feature Cards Editor</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Highlight key technical features, client-side guarantees, and benefits.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadCanonicalFeatures}
                className="px-2.5 py-1 text-xs font-semibold text-[#475467] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
              >
                Load Canonical Defaults
              </button>
              <button
                onClick={handleAddFeature}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#124A57] hover:bg-[#0E3B46] rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Feature</span>
              </button>
            </div>
          </div>

          {featuresList.length === 0 ? (
            <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1] space-y-2">
              <Sparkles className="w-6 h-6 text-[#94A3B8] mx-auto" />
              <div className="text-xs font-semibold text-[#475467]">No Custom Features Defined</div>
              <p className="text-[11px] text-[#64748B]">
                The public page currently uses canonical features from code. Click "Load Canonical Defaults" or "Add Feature" to customize.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuresList.map((feat, idx) => (
                <div key={idx} className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#124A57] px-2 py-0.5 bg-[#E6F4F1] rounded">
                      Feature #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-1 text-[#94A3B8] hover:text-[#E11D48] transition-colors"
                      title="Remove feature"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#17202A] mb-1">
                      Feature Title
                    </label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                      placeholder="e.g. 100% Client-Side Processing"
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#17202A] mb-1">
                      Feature Description
                    </label>
                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                      placeholder="e.g. Conversions execute entirely on your device..."
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57] bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: FAQ */}
      {activeTab === 'FAQ' && (
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#17202A]">Frequently Asked Questions (FAQ)</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Manage FAQ accordions. Questions and answers are automatically surfaced on the public page.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadCanonicalFaq}
                className="px-2.5 py-1 text-xs font-semibold text-[#475467] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
              >
                Load Canonical Defaults
              </button>
              <button
                onClick={handleAddFaq}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-[#124A57] hover:bg-[#0E3B46] rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ</span>
              </button>
            </div>
          </div>

          {faqList.length === 0 ? (
            <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-[#CBD5E1] space-y-2">
              <HelpCircle className="w-6 h-6 text-[#94A3B8] mx-auto" />
              <div className="text-xs font-semibold text-[#475467]">No Custom FAQ Items Defined</div>
              <p className="text-[11px] text-[#64748B]">
                The public page currently uses the canonical FAQ entries. Click "Load Canonical Defaults" or "Add FAQ" to customize.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqList.map((item, idx) => (
                <div key={idx} className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#124A57] px-2 py-0.5 bg-[#E6F4F1] rounded">
                      Question #{idx + 1}
                    </span>
                    <button
                      onClick={() => handleRemoveFaq(idx)}
                      className="p-1 text-[#94A3B8] hover:text-[#E11D48] transition-colors"
                      title="Remove FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#17202A] mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => handleFaqChange(idx, 'question', e.target.value)}
                      placeholder="e.g. Is this file converter completely free?"
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#17202A] mb-1">
                      Answer
                    </label>
                    <textarea
                      rows={2}
                      value={item.answer}
                      onChange={(e) => handleFaqChange(idx, 'answer', e.target.value)}
                      placeholder="e.g. Yes, 100% free with no limits..."
                      className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57] bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Related Tools */}
      {activeTab === 'RELATED' && (
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#17202A]">Related Tools Selection</h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Select related tools from the 24 remaining canonical tools. Arbitrary external slugs are strictly prohibited.
              </p>
            </div>
            <button
              onClick={handleLoadCanonicalRelated}
              className="px-2.5 py-1 text-xs font-semibold text-[#475467] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
            >
              Load Canonical Defaults
            </button>
          </div>

          <div className="p-3 bg-[#E6F4F1] border border-[#B3E0D8] rounded-xl text-xs text-[#124A57] flex items-center justify-between">
            <span>
              <strong>Selected ({relatedToolsList.length}):</strong>{' '}
              {relatedToolsList.length === 0 ? 'None (using code default)' : relatedToolsList.join(', ')}
            </span>
            {relatedToolsList.length > 0 && (
              <button
                onClick={() => setRelatedToolsList([])}
                className="text-[11px] font-semibold underline hover:text-[#0E3B46]"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {otherTools.map((t) => {
              const isSelected = relatedToolsList.includes(t.slug);
              return (
                <div
                  key={t.slug}
                  onClick={() => handleToggleRelatedTool(t.slug)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#E6F4F1] border-[#124A57] text-[#124A57] shadow-xs'
                      : 'bg-white border-[#E5E7EB] text-[#475467] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-semibold truncate">{t.name}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">/tools/{t.slug}</div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[#124A57] border-[#124A57] text-white'
                        : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Advanced SEO */}
      {activeTab === 'SEO' && (
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-subtle space-y-6">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h2 className="text-sm font-bold text-[#17202A]">Advanced SEO & Social Metadata Overrides</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Configure search engine metadata, OpenGraph cards, Twitter cards, and JSON-LD structured data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#17202A]">SEO Title Tag</label>
                <span className={`text-[10px] ${seoTitle.length > 60 ? 'text-[#E11D48] font-bold' : 'text-[#64748B]'}`}>
                  {seoTitle.length}/60 chars
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={canonical.title}
                className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17202A] mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder={`/tools/${canonical.slug}`}
                className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
              />
              <span className="text-[10px] text-[#64748B] mt-0.5 block">
                Must remain based on /tools/{canonical.slug}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#17202A]">Meta Description</label>
              <span className={`text-[10px] ${metaDescription.length > 160 ? 'text-[#E11D48] font-bold' : 'text-[#64748B]'}`}>
                {metaDescription.length}/160 chars
              </span>
            </div>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder={canonical.description}
              className="w-full px-3 py-2 text-xs border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57]"
            />
          </div>

          {/* Robots Directives */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-[#17202A]">Robots Directives</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#17202A]">
                <input
                  type="checkbox"
                  checked={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.checked)}
                  className="rounded text-[#124A57] focus:ring-[#124A57]"
                />
                <span>Allow Indexing (<code className="font-mono text-[10px]">index</code>)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#17202A]">
                <input
                  type="checkbox"
                  checked={robotsFollow}
                  onChange={(e) => setRobotsFollow(e.target.checked)}
                  className="rounded text-[#124A57] focus:ring-[#124A57]"
                />
                <span>Allow Follow (<code className="font-mono text-[10px]">follow</code>)</span>
              </label>
            </div>
          </div>

          {/* Open Graph & Twitter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open Graph */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-[#17202A] flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#124A57]" />
                <span>Open Graph (Facebook, LinkedIn)</span>
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-[#17202A] mb-1">OG Title</label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder={seoTitle || canonical.title}
                  className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#17202A] mb-1">OG Description</label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder={metaDescription || canonical.description}
                  className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-[#17202A]">OG Image URL</label>
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(true)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#124A57] hover:underline"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Select from Media Library</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="/images/og-tool.png or /uploads/..."
                  className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
            </div>

            {/* Twitter */}
            <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-[#17202A] flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#124A57]" />
                <span>Twitter Card Metadata</span>
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-[#17202A] mb-1">Twitter Title</label>
                <input
                  type="text"
                  value={twitterTitle}
                  onChange={(e) => setTwitterTitle(e.target.value)}
                  placeholder={seoTitle || canonical.title}
                  className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#17202A] mb-1">Twitter Description</label>
                <textarea
                  rows={2}
                  value={twitterDescription}
                  onChange={(e) => setTwitterDescription(e.target.value)}
                  placeholder={metaDescription || canonical.description}
                  className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#17202A] mb-1">Twitter Image URL</label>
                <input
                  type="text"
                  value={twitterImage}
                  onChange={(e) => setTwitterImage(e.target.value)}
                  placeholder="/images/og-tool.png"
                  className="w-full px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* JSON-LD Structured Data */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#17202A]">
                Custom JSON-LD Structured Data
              </label>
              {jsonValidationResult && (
                <span
                  className={`text-[10px] font-semibold flex items-center gap-1 ${
                    jsonValidationResult.valid ? 'text-[#10B981]' : 'text-[#E11D48]'
                  }`}
                >
                  {jsonValidationResult.valid ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  <span>{jsonValidationResult.message}</span>
                </span>
              )}
            </div>
            <textarea
              rows={6}
              value={schemaJsonText}
              onChange={(e) => setSchemaJsonText(e.target.value)}
              placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "WebApplication",\n  "name": "${canonical.name}",\n  "applicationCategory": "UtilitiesApplication"\n}`}
              className="w-full px-3 py-2 text-xs font-mono border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124A57] bg-[#F8FAFC]"
            />
            <span className="text-[10px] text-[#64748B] mt-0.5 block">
              Pure JSON object only. Script tags and HTML elements are rejected.
            </span>
          </div>
        </div>
      )}

      {/* Tab: Publishing & Audit */}
      {activeTab === 'PUBLISHING' && (
        <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] shadow-subtle space-y-6">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h2 className="text-sm font-bold text-[#17202A]">Publishing Controls & Status</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Control whether this tool renders canonical code defaults or customized CMS overrides.
            </p>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#17202A]">Current Publishing Status</div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  {isPublished
                    ? 'Active: Public visitors see published CMS overrides.'
                    : 'Draft/Default: Public visitors see canonical registry defaults.'}
                </div>
              </div>

              <div>
                {isPublished ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    PUBLISHED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
                    <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    DRAFT
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span>Last Modified:</span>
              <span className="font-mono text-[#17202A]">
                {override?.updatedAt ? new Date(override.updatedAt).toLocaleString() : 'Never modified'}
              </span>
            </div>
          </div>

          {/* Primary Publishing Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {isPublished ? (
              <button
                onClick={handleUnpublish}
                disabled={isPublishing}
                className="px-4 py-2 text-xs font-semibold text-[#92400E] bg-[#FEF3C7] hover:bg-[#FDE68A] rounded-lg transition-colors border border-[#FDE68A]"
              >
                Unpublish (Revert Public Page to Canonical Defaults)
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#10B981] hover:bg-[#059669] rounded-lg transition-colors shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Publish CMS Overrides to Public</span>
              </button>
            )}

            <button
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#17202A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              <Save className="w-4 h-4 text-[#124A57]" />
              <span>Save Current Form as Draft</span>
            </button>
          </div>
        </div>
      )}

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        currentUrl={ogImage}
        onSelect={(asset) => {
          setOgImage(asset ? asset.url : '');
        }}
      />
    </div>
  );
}
