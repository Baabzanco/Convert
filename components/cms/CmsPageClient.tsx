'use client';

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import {
  Sparkles,
  Type,
  FileText,
  Image as ImageIcon,
  Grid,
  HelpCircle,
  MousePointerClick,
  Link as LinkIcon,
  Plus,
} from 'lucide-react';
import { ResolvedCmsPage, CmsBlockRenderer, CmsJsonLd } from '@/lib/cms/page-resolver';
import { sanitizeCustomCss } from '@/lib/admin/validation';
import { UniversalContentBlock, duplicateBlock } from '@/lib/cms/blocks';
import { InlineBlockWrapper } from '@/components/admin/inline/InlineBlockWrapper';
import { InlineBlockEditorDrawer } from '@/components/admin/inline/InlineBlockEditorDrawer';
import { InlineEditorToolbar } from '@/components/admin/inline/InlineEditorToolbar';
import { InlineRevisionDrawer } from '@/components/admin/inline/InlineRevisionDrawer';
import { InlineSeoDrawer, InlineSeoData } from '@/components/admin/inline/InlineSeoDrawer';
import { InlineSharedSettingsDrawer } from '@/components/admin/inline/InlineSharedSettingsDrawer';

interface CmsPageClientProps {
  slug: string;
  initialCmsPage: ResolvedCmsPage | null;
  fallbackTitle: string;
  fallbackBlocks?: UniversalContentBlock[];
  fallbackRender?: React.ReactNode;
}

export default function CmsPageClient({
  slug,
  initialCmsPage,
  fallbackTitle,
  fallbackBlocks,
  fallbackRender,
}: CmsPageClientProps) {
  // Admin auth & editing state
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageRecord, setPageRecord] = useState<any | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const [isSharedSettingsOpen, setIsSharedSettingsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isPublished, setIsPublished] = useState<boolean>(
    initialCmsPage?.status === 'PUBLISHED' || true
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);

  // Editable fields state
  const [pageName, setPageName] = useState<string>(
    initialCmsPage?.name || fallbackTitle
  );
  const [activeBlocks, setActiveBlocks] = useState<UniversalContentBlock[]>(() => {
    if (initialCmsPage?.blocks && initialCmsPage.blocks.length > 0) {
      return (initialCmsPage.blocks as unknown) as UniversalContentBlock[];
    }
    return fallbackBlocks || [];
  });
  const [customCss, setCustomCss] = useState<string>(
    initialCmsPage?.customCss || ''
  );
  const [seoData, setSeoData] = useState<InlineSeoData | null>(
    () => (initialCmsPage?.seo as InlineSeoData) || null
  );

  // Authenticate with server & load full draft page record if admin
  useEffect(() => {
    let isMounted = true;

    async function checkAuthAndLoadDraft() {
      try {
        const authRes = await fetch('/api/admin/auth/me');
        if (!authRes.ok) return;

        const authData = await authRes.json();
        if (isMounted && authData.user && authData.permissions?.includes('EDIT_CONTENT')) {
          setIsAdmin(true);

          // Fetch full page draft record from Pages API
          const pageRes = await fetch(`/api/admin/pages?slug=${encodeURIComponent(slug)}`);
          if (pageRes.ok) {
            const pageData = await pageRes.json();
            const record = pageData.page;
            if (record && isMounted) {
              setPageRecord(record);
              setPageName(record.name || fallbackTitle);
              setIsPublished(record.status === 'PUBLISHED');

              if (record.content) {
                if (Array.isArray(record.content.blocks) && record.content.blocks.length > 0) {
                  setActiveBlocks(record.content.blocks);
                }
                if (record.content.customCss !== undefined) {
                  setCustomCss(record.content.customCss || '');
                }
              }

              if (record.seo) {
                setSeoData(record.seo);
              }
            }
          }
        }
      } catch {
        // Silently ignore for non-admins
      }
    }

    checkAuthAndLoadDraft();

    return () => {
      isMounted = false;
    };
  }, [slug, fallbackTitle]);

  const handleToggleEdit = () => {
    // If activeBlocks is empty when entering edit mode, initialize with fallback
    if (!isEditingMode && activeBlocks.length === 0) {
      if (fallbackBlocks && fallbackBlocks.length > 0) {
        setActiveBlocks(fallbackBlocks);
      } else {
        setActiveBlocks([
          {
            id: `blk-h-${Date.now()}`,
            type: 'heading',
            order: 0,
            enabled: true,
            content: { level: 1, text: pageName },
            text: pageName,
            level: 1,
          },
          {
            id: `blk-p-${Date.now()}`,
            type: 'paragraph',
            order: 1,
            enabled: true,
            content: { text: `Welcome to the ${pageName} page.` },
            text: `Welcome to the ${pageName} page.`,
          },
        ]);
      }
    }
    setIsEditingMode((prev) => !prev);
    setSelectedBlockId(null);
  };

  const handleSaveDraft = async () => {
    let targetId = pageRecord?.id;

    if (!targetId) {
      setFeedbackMessage({
        type: 'warning',
        text: `Creating initial CMS record for '${slug}'...`,
      });
      try {
        const createRes = await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: pageName,
            slug,
            blocks: activeBlocks,
            customCss: customCss || null,
            seo: seoData || undefined,
            status: 'DRAFT',
          }),
        });
        if (createRes.ok) {
          const createData = await createRes.json();
          if (createData.page) {
            setPageRecord(createData.page);
            targetId = createData.page.id;
          }
        }
      } catch {
        setFeedbackMessage({ type: 'error', text: 'Failed to initialize page record.' });
        return;
      }
    }

    if (!targetId) {
      targetId = slug;
    }

    setIsSaving(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/pages/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pageName,
          blocks: activeBlocks,
          customCss: customCss || null,
          seo: seoData || undefined,
          status: 'DRAFT',
          reason: `Inline visual editor update on /${slug}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsDirty(false);
        setIsPublished(data.page?.status === 'PUBLISHED');
        if (data.page) setPageRecord(data.page);
        setFeedbackMessage({
          type: 'success',
          text: 'Draft saved successfully. Content is preserved in draft state.',
        });
      } else {
        const data = await res.json();
        setFeedbackMessage({
          type: 'error',
          text: data.error || 'Failed to save draft.',
        });
      }
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'Network error saving draft.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to publish '${pageName}'? This will make your draft visible to all public visitors at /${slug}.`
    );
    if (!confirmed) return;

    let targetId = pageRecord?.id;
    if (!targetId) {
      await handleSaveDraft();
      targetId = pageRecord?.id || slug;
    }

    setIsPublishing(true);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/admin/pages/${targetId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish' }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsDirty(false);
        setIsPublished(true);
        if (data.page) setPageRecord(data.page);
        setFeedbackMessage({
          type: 'success',
          text: `'${pageName}' published successfully to /${slug}!`,
        });
      } else {
        const data = await res.json();
        setFeedbackMessage({
          type: 'error',
          text: data.error || 'Failed to publish page.',
        });
      }
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: 'Network error publishing page.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDiscard = () => {
    const confirmed = window.confirm('Discard unsaved session edits?');
    if (!confirmed) return;

    if (pageRecord?.content?.blocks) {
      setActiveBlocks(pageRecord.content.blocks);
    } else if (initialCmsPage?.blocks) {
      setActiveBlocks((initialCmsPage.blocks as unknown) as UniversalContentBlock[]);
    } else {
      setActiveBlocks(fallbackBlocks || []);
    }

    setCustomCss(pageRecord?.content?.customCss || initialCmsPage?.customCss || '');
    setSeoData(pageRecord?.seo || initialCmsPage?.seo || null);
    setPageName(pageRecord?.name || initialCmsPage?.name || fallbackTitle);
    setIsDirty(false);
    setSelectedBlockId(null);
    setFeedbackMessage({ type: 'warning', text: 'Unsaved edits discarded.' });
  };

  // Block management helper
  const handleAddBlock = (type: string) => {
    const newId = `blk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const nextOrder = activeBlocks.length + 1;
    let newBlock: UniversalContentBlock;

    switch (type) {
      case 'heading':
        newBlock = {
          id: newId,
          type: 'heading',
          order: nextOrder,
          enabled: true,
          content: { level: 2, text: 'New Section Heading' },
          text: 'New Section Heading',
          level: 2,
        };
        break;
      case 'paragraph':
        newBlock = {
          id: newId,
          type: 'paragraph',
          order: nextOrder,
          enabled: true,
          content: { text: 'Add paragraph description content here.' },
          text: 'Add paragraph description content here.',
        };
        break;
      case 'rich_text':
        newBlock = {
          id: newId,
          type: 'rich_text',
          order: nextOrder,
          enabled: true,
          content: { html: '<p>Custom formatted rich text HTML.</p>' },
          html: '<p>Custom formatted rich text HTML.</p>',
        };
        break;
      case 'image':
        newBlock = {
          id: newId,
          type: 'image',
          order: nextOrder,
          enabled: true,
          content: { src: '/images/og-image.png', alt: `${pageName} Graphic`, caption: '' },
          src: '/images/og-image.png',
          alt: `${pageName} Graphic`,
        };
        break;
      case 'feature':
        newBlock = {
          id: newId,
          type: 'feature',
          order: nextOrder,
          enabled: true,
          content: {
            title: 'Feature Highlight',
            description: 'Explanation of service capability or user benefit.',
            icon: 'ShieldCheck',
          },
          title: 'Feature Highlight',
          description: 'Explanation of service capability or user benefit.',
        };
        break;
      case 'faq':
        newBlock = {
          id: newId,
          type: 'faq',
          order: nextOrder,
          enabled: true,
          content: {
            question: 'Common Question?',
            answer: 'Clear response providing helpful guidance.',
          },
          question: 'Common Question?',
          answer: 'Clear response providing helpful guidance.',
        };
        break;
      case 'cta':
        newBlock = {
          id: newId,
          type: 'cta',
          order: nextOrder,
          enabled: true,
          content: {
            label: 'Explore Our Tools',
            href: '/#explore-hubs',
            variant: 'primary',
          },
          label: 'Explore Our Tools',
          href: '/#explore-hubs',
        };
        break;
      case 'link':
        newBlock = {
          id: newId,
          type: 'link',
          order: nextOrder,
          enabled: true,
          content: {
            text: 'Return to Homepage',
            href: '/',
            isExternal: false,
          },
          text: 'Return to Homepage',
          href: '/',
        };
        break;
      case 'section':
        newBlock = {
          id: newId,
          type: 'section',
          order: nextOrder,
          enabled: true,
          content: {
            title: 'Section Title',
            description: 'Section subtitle explaining the following details.',
          },
          title: 'Section Title',
          description: 'Section subtitle explaining the following details.',
        };
        break;
      default:
        newBlock = {
          id: newId,
          type: 'paragraph',
          order: nextOrder,
          enabled: true,
          content: { text: 'New content block.' },
        };
    }

    setActiveBlocks((prev) => [...prev, newBlock]);
    setIsDirty(true);
    setSelectedBlockId(newId);
  };

  const handleUpdateSelectedBlock = (updatedBlock: UniversalContentBlock) => {
    setActiveBlocks((prev) =>
      prev.map((b) => (b.id === updatedBlock.id ? updatedBlock : b))
    );
    setIsDirty(true);
  };

  const handleDeleteBlock = (blockId: string) => {
    setActiveBlocks((prev) => prev.filter((b) => b.id !== blockId));
    setIsDirty(true);
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeBlocks.length) return;

    const updated = [...activeBlocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setActiveBlocks(updated.map((b, idx) => ({ ...b, order: idx })));
    setIsDirty(true);
  };

  const handleDuplicateBlock = (block: UniversalContentBlock) => {
    const copy = duplicateBlock(block);
    setActiveBlocks((prev) => [...prev, copy]);
    setIsDirty(true);
    setSelectedBlockId(copy.id);
  };

  const safeCustomCss = customCss ? sanitizeCustomCss(customCss) : '';
  const selectedBlock = activeBlocks.find((b) => b.id === selectedBlockId) || null;

  const schemaJsonObj =
    seoData?.schemaJson && typeof seoData.schemaJson === 'object'
      ? seoData.schemaJson
      : initialCmsPage?.seo?.schemaJson;

  const hasBlocksToRender = activeBlocks.length > 0;

  return (
    <div className="py-8 md:py-12 bg-[#FCFBFF] min-h-[60vh] relative">
      <CmsJsonLd schema={schemaJsonObj as any} />

      {safeCustomCss && (
        <style dangerouslySetInnerHTML={{ __html: safeCustomCss }} />
      )}

      {/* Floating Admin Toolbar (Only for Authenticated Editors) */}
      {isAdmin && (
        <InlineEditorToolbar
          slug={slug}
          previewUrl={`/${slug}`}
          isEditing={isEditingMode}
          isDirty={isDirty}
          isPublished={isPublished}
          isPreviewMode={false}
          onToggleEdit={handleToggleEdit}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onDiscard={handleDiscard}
          onOpenRevisions={() => setIsRevisionsOpen(true)}
          onOpenSeo={() => setIsSeoOpen(true)}
          onOpenSharedSettings={() => setIsSharedSettingsOpen(true)}
          hasSeoOverride={Boolean(seoData?.seoTitle || seoData?.metaDescription)}
          isSaving={isSaving}
          isPublishing={isPublishing}
          feedbackMessage={feedbackMessage}
        />
      )}

      {/* Add CMS Content Block Toolbar (Visible in Edit Mode) */}
      {isAdmin && isEditingMode && (
        <div className="sticky top-16 z-30 bg-[#0F112E]/95 backdrop-blur-md text-white py-2.5 px-4 shadow-lg border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-bold mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            <span>Page Visual Content Editor ({pageName})</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-white/60 pr-1">Insert Block:</span>
            <button
              type="button"
              onClick={() => handleAddBlock('heading')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Type className="w-3 h-3 text-purple-300" />
              <span>Heading</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('paragraph')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3 h-3 text-purple-300" />
              <span>Paragraph</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('rich_text')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3 h-3 text-emerald-300" />
              <span>Rich Text</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('image')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <ImageIcon className="w-3 h-3 text-blue-300" />
              <span>Image</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('feature')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Grid className="w-3 h-3 text-purple-300" />
              <span>Feature</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('faq')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3 h-3 text-purple-300" />
              <span>FAQ</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('cta')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <MousePointerClick className="w-3 h-3 text-purple-300" />
              <span>CTA Button</span>
            </button>
            <button
              type="button"
              onClick={() => handleAddBlock('link')}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg flex items-center gap-1 transition-colors"
            >
              <LinkIcon className="w-3 h-3 text-purple-300" />
              <span>Link</span>
            </button>
          </div>
        </div>
      )}

      <Container>
        <Breadcrumbs items={[{ name: pageName }]} />

        <div className="max-w-4xl mx-auto space-y-8 mt-6">
          {hasBlocksToRender ? (
            <div className="space-y-6">
              {activeBlocks.map((block, idx) => (
                <div key={block.id} className="relative group">
                  <InlineBlockWrapper
                    blockId={block.id}
                    blockType={block.type}
                    label={block.type.toUpperCase()}
                    isEditing={isEditingMode}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onMoveUp={idx > 0 ? () => handleMoveBlock(idx, 'up') : undefined}
                    onMoveDown={idx < activeBlocks.length - 1 ? () => handleMoveBlock(idx, 'down') : undefined}
                    onDuplicate={() => handleDuplicateBlock(block)}
                    onDelete={() => handleDeleteBlock(block.id)}
                  >
                    <CmsBlockRenderer blocks={[block as any]} />
                  </InlineBlockWrapper>
                </div>
              ))}
            </div>
          ) : (
            fallbackRender
          )}
        </div>
      </Container>

      {/* Drawers */}
      <InlineBlockEditorDrawer
        block={selectedBlock}
        isOpen={Boolean(selectedBlock && isEditingMode)}
        onClose={() => setSelectedBlockId(null)}
        onSaveBlock={handleUpdateSelectedBlock}
      />

      <InlineSeoDrawer
        slug={slug}
        pageType="page"
        isOpen={isSeoOpen}
        onClose={() => setIsSeoOpen(false)}
        seoData={seoData}
        inheritedDefaults={{
          title: pageName,
          description: `Learn more about ${pageName} on Convert24.`,
          canonicalUrl: `https://convert24.local/${slug}`,
        }}
        onSaveSeo={(updatedSeo) => {
          setSeoData(updatedSeo);
          setIsDirty(true);
        }}
      />

      <InlineRevisionDrawer
        slug={slug}
        pageId={pageRecord?.id || `page-${slug}`}
        entityType="page"
        isOpen={isRevisionsOpen}
        onClose={() => setIsRevisionsOpen(false)}
        onRevisionRestored={() => {
          fetch(`/api/admin/pages?slug=${encodeURIComponent(slug)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.page) {
                setPageRecord(data.page);
                setPageName(data.page.name || fallbackTitle);
                if (data.page.content?.blocks) {
                  setActiveBlocks(data.page.content.blocks);
                }
                if (data.page.content?.customCss !== undefined) {
                  setCustomCss(data.page.content.customCss || '');
                }
                if (data.page.seo) setSeoData(data.page.seo);
                setIsDirty(false);
                setFeedbackMessage({ type: 'success', text: 'Revision restored successfully.' });
              }
            });
        }}
      />

      <InlineSharedSettingsDrawer
        isOpen={isSharedSettingsOpen}
        onClose={() => setIsSharedSettingsOpen(false)}
      />
    </div>
  );
}
