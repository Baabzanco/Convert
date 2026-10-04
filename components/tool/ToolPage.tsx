'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ToolDefinition } from '@/lib/tools';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import AdSlot from '@/components/ads/AdSlot';
import FAQ from '@/components/seo/FAQ';
import RelatedTools from '@/components/seo/RelatedTools';
import UploadZone from './UploadZone';
import FileList from './FileList';
import { FileItemData } from './FileItem';
import JpgToPngController from './JpgToPngController';
import PngToJpgController from './PngToJpgController';
import JpgToWebpController from './JpgToWebpController';
import WebpToJpgController from './WebpToJpgController';
import PngToWebpController from './PngToWebpController';
import WebpToPngController from './WebpToPngController';
import HeicToJpgController from './HeicToJpgController';
import SvgToPngController from './SvgToPngController';
import { GifToPngController } from './GifToPngController';
import { BmpToPngController } from './BmpToPngController';
import { CompressImageController } from './CompressImageController';
import { ResizeImageController } from './ResizeImageController';
import { CropImageController } from './CropImageController';
import { RotateImageController } from './RotateImageController';
import { ImageToPdfController } from './ImageToPdfController';
import { JpgToPdfController } from './JpgToPdfController';
import { PngToPdfController } from './PngToPdfController';
import { PdfToJpgController } from './PdfToJpgController';
import { PdfToPngController } from './PdfToPngController';
import { MergePdfController } from './MergePdfController';
import { SplitPdfController } from './SplitPdfController';
import { CompressPdfController } from './CompressPdfController';
import { RotatePdfController } from './RotatePdfController';
import { DeletePdfPagesController } from './DeletePdfPagesController';
import { ReorderPdfPagesController } from './ReorderPdfPagesController';
import {
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Layers,
  Palette,
  Globe,
  FileText,
  Repeat,
  ArrowLeft,
} from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import {
  createWebApplicationSchema,
  createBreadcrumbSchema,
  createFAQSchema,
  createHowToSchema,
  siteConfig,
} from '@/lib/seo';

interface ToolPageProps {
  tool: ToolDefinition;
}

function CmsToolBlock({ block, tool }: { block: any; tool: ToolDefinition }) {
  if (!block || block.enabled === false) return null;

  const type = block.type;
  const content = block.content || {};

  switch (type) {
    case 'hero':
      return (
        <header className="max-w-3xl mb-8 space-y-3">
          {content.badge && (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F4F0FD] text-[#7C3AED] mb-2">
              {content.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F112E] tracking-tight">
            {content.title || tool.h1}
          </h1>
          <p className="text-base sm:text-lg text-[#5E6488] leading-relaxed">
            {content.description || tool.description}
          </p>
          {content.supportingText && (
            <p className="text-xs sm:text-sm text-[#5E6488] opacity-80 italic mt-1">
              {content.supportingText}
            </p>
          )}
        </header>
      );

    case 'benefits_trust': {
      const items = content.items || [];
      if (items.length === 0) return null;
      return (
        <div className="py-4 px-4 md:px-6 bg-[#F4F3FA] border border-[#E4E2F0] rounded-2xl flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm font-bold text-[#7C3AED] mb-10 shadow-sm">
          {items.map((item: any, idx: number) => {
            if (item.enabled === false) return null;
            return (
              <span key={item.id || idx} className="inline-flex items-center gap-2">
                {item.icon === 'Zap' && <Zap className="w-4 h-4 text-[#7C3AED]" />}
                {item.icon === 'Check' && <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" />}
                {item.icon === 'Shield' && <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />}
                {item.icon === 'Lock' && <Lock className="w-4 h-4 text-[#7C3AED]" />}
                {item.text}
              </span>
            );
          })}
        </div>
      );
    }

    case 'intro':
      return (
        <section className="py-10 border-t border-[#E4E2F0]">
          <div className="max-w-4xl space-y-4">
            {content.heading && (
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight">
                {content.heading}
              </h2>
            )}
            <div className="text-base text-[#5E6488] leading-relaxed space-y-3">
              {content.html ? (
                <div dangerouslySetInnerHTML={{ __html: content.html }} />
              ) : (
                <p>{content.text}</p>
              )}
            </div>
          </div>
        </section>
      );

    case 'features': {
      const items = content.items || [];
      return (
        <section className="py-10 border-t border-[#E4E2F0]">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight">
              {content.heading || `Key Features of ${tool.name}`}
            </h2>
            {content.description && (
              <p className="text-sm md:text-base text-[#5E6488] mt-1.5">{content.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any, idx: number) => {
              if (item.enabled === false) return null;
              return (
                <div key={item.id || idx} className="p-6 bg-[#FFFFFF] border border-[#E4E2F0] rounded-[20px] space-y-3 hover:border-[#7C3AED]/40 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                    {idx === 0 ? (
                      <Cpu className="w-5 h-5" />
                    ) : idx === 1 ? (
                      <FileCheck className="w-5 h-5" />
                    ) : idx === 2 ? (
                      <Layers className="w-5 h-5" />
                    ) : idx === 3 ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                  </div>
                  <h3 className="font-bold text-base text-[#0F112E]">{item.title}</h3>
                  <p className="text-sm text-[#5E6488] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case 'how_to_use':
    case 'how_to': {
      const items = content.items || [];
      return (
        <section className="py-10 border-t border-[#E4E2F0]">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight">
              {content.heading || `How to Use ${tool.name}`}
            </h2>
            {content.description && (
              <p className="text-sm md:text-base text-[#5E6488] mt-1.5">{content.description}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item: any, idx: number) => {
              if (item.enabled === false) return null;
              return (
                <div key={item.id || idx} className="p-6 bg-[#FFFFFF] border border-[#E4E2F0] rounded-[20px] space-y-4 relative shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#6366F1] text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-100">
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-base text-[#0F112E]">{item.title}</h3>
                  <p className="text-sm text-[#5E6488] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case 'faq': {
      const items = content.items || [];
      if (items.length === 0) return null;
      const enabledFaqs = items.filter((item: any) => item.enabled !== false);
      return (
        <div className="border-t border-[#E4E2F0] pt-6">
          <FAQ items={enabledFaqs} title={content.heading || `Frequently Asked Questions about ${tool.name}`} />
        </div>
      );
    }

    case 'related_tools': {
      const slugs = content.slugs || [];
      if (slugs.length === 0) return null;
      return (
        <div className="border-t border-[#E4E2F0] pt-6">
          <RelatedTools slugs={slugs.filter((s: any) => typeof s === 'string').slice(0, 4)} title={content.heading || "Related Tools"} />
        </div>
      );
    }

    case 'cta':
      return (
        <section className="py-10 border-t border-[#E4E2F0]">
          <div className="p-8 md:p-12 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-[24px] text-white text-center space-y-6 shadow-lg shadow-indigo-100">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {content.title}
              </h2>
              {content.description && (
                <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                  {content.description}
                </p>
              )}
            </div>
            {content.buttonText && (
              <div className="pt-2">
                <Link
                  href={content.href || '#'}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold bg-white text-[#7C3AED] hover:bg-slate-50 transition-colors shadow-md"
                >
                  {content.buttonText}
                </Link>
              </div>
            )}
          </div>
        </section>
      );

    case 'spacer':
      return <div style={{ height: `${content.height || 24}px` }} />;

    default:
      return null;
  }
}

export function ToolPage({ tool }: ToolPageProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileItemData[]>([]);

  const isImageCategory = tool.category.startsWith('image') || ['image-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(tool.slug);
  const categoryName = isImageCategory ? 'Image Tools' : 'PDF Tools';
  const categoryHref = isImageCategory ? '/image-tools' : '/pdf-tools';

  const breadcrumbs = [
    { name: categoryName, href: categoryHref },
    { name: tool.name },
  ];

  const handleFilesSelected = (files: File[]) => {
    const newItems: FileItemData[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      file,
      status: 'idle',
    }));
    setSelectedFiles((prev) => [...prev, ...newItems]);
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
  };

  const currentToolUrl = `${siteConfig.url}/tools/${tool.slug}`;
  const webAppSchema = createWebApplicationSchema(tool.name, tool.description, currentToolUrl);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: categoryName, url: `${siteConfig.url}${categoryHref}` },
    { name: tool.name, url: currentToolUrl },
  ]);
  const faqSchema = tool.faq && tool.faq.length > 0 ? createFAQSchema(tool.faq) : null;
  const howToSchema =
    tool.howTo && tool.howTo.length > 0
      ? createHowToSchema(tool.name, tool.intro || tool.description, tool.howTo)
      : null;

  const valuePropText = tool.valueProposition || tool.description;
  const relatedSlugs =
    tool.relatedTools && tool.relatedTools.length > 0
      ? tool.relatedTools.slice(0, 4)
      : tool.youMayAlsoNeed || [];

  const hasCmsBlocks = Array.isArray(tool.blocks) && tool.blocks.length > 0;
  const heroBlock = hasCmsBlocks && tool.blocks ? tool.blocks.find((b: any) => b.type === 'hero' && b.enabled !== false) : null;
  const subsequentBlocks = hasCmsBlocks && tool.blocks ? tool.blocks.filter((b: any) => b.type !== 'hero' && b.enabled !== false) : [];

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      {howToSchema && <JsonLd data={howToSchema} />}

      <div className="py-8 md:py-12 bg-[#FCFBFF]">
        <Container>
          {/* Breadcrumb Navigation & Back Affordance */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Breadcrumbs items={breadcrumbs} className="mb-0" />
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] hover:underline transition-colors py-1.5 px-3 rounded-xl hover:bg-[#F4F0FD]"
              aria-label={`Back to ${categoryName}`}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to {categoryName}</span>
            </Link>
          </div>

          {/* 1. H1 Header & Short Description */}
          {hasCmsBlocks && heroBlock ? (
            <CmsToolBlock block={heroBlock} tool={tool} />
          ) : (
            <header className="max-w-3xl mb-8 space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F112E] tracking-tight">
                {tool.h1}
              </h1>
              <p className="text-base sm:text-lg text-[#5E6488] leading-relaxed">
                {valuePropText}
              </p>
            </header>
          )}

          {/* 2. PRIMARY FUNCTIONAL TOOL UI (Immediate access, top priority on desktop & mobile) */}
          <section aria-label={`${tool.name} Converter Interface`} className="mb-8">
            {tool.slug === 'jpg-to-png' ? (
              <JpgToPngController />
            ) : tool.slug === 'png-to-jpg' ? (
              <PngToJpgController />
            ) : tool.slug === 'jpg-to-webp' ? (
              <JpgToWebpController />
            ) : tool.slug === 'webp-to-jpg' ? (
              <WebpToJpgController />
            ) : tool.slug === 'png-to-webp' ? (
              <PngToWebpController />
            ) : tool.slug === 'webp-to-png' ? (
              <WebpToPngController />
            ) : tool.slug === 'heic-to-jpg' ? (
              <HeicToJpgController />
            ) : tool.slug === 'svg-to-png' ? (
              <SvgToPngController />
            ) : tool.slug === 'gif-to-png' ? (
              <GifToPngController />
            ) : tool.slug === 'bmp-to-png' ? (
              <BmpToPngController />
            ) : tool.slug === 'compress-image' ? (
              <CompressImageController />
            ) : tool.slug === 'resize-image' ? (
              <ResizeImageController />
            ) : tool.slug === 'crop-image' ? (
              <CropImageController />
            ) : tool.slug === 'rotate-image' ? (
              <RotateImageController />
            ) : tool.slug === 'image-to-pdf' ? (
              <ImageToPdfController />
            ) : tool.slug === 'jpg-to-pdf' ? (
              <JpgToPdfController />
            ) : tool.slug === 'png-to-pdf' ? (
              <PngToPdfController />
            ) : tool.slug === 'pdf-to-jpg' ? (
              <PdfToJpgController />
            ) : tool.slug === 'pdf-to-png' ? (
              <PdfToPngController />
            ) : tool.slug === 'merge-pdf' ? (
              <MergePdfController />
            ) : tool.slug === 'split-pdf' ? (
              <SplitPdfController />
            ) : tool.slug === 'compress-pdf' ? (
              <CompressPdfController />
            ) : tool.slug === 'rotate-pdf' ? (
              <RotatePdfController />
            ) : tool.slug === 'delete-pdf-pages' ? (
              <DeletePdfPagesController />
            ) : tool.slug === 'reorder-pdf-pages' ? (
              <ReorderPdfPagesController />
            ) : (
              <div className="bg-[#FFFFFF] border border-[#E4E2F0] rounded-[24px] p-6 md:p-8 shadow-sm mb-6">
                <div className="max-w-2xl mx-auto space-y-6">
                  <UploadZone
                    acceptedFormats={tool.inputFormats.map((f) => f.toUpperCase())}
                    onFilesSelected={handleFilesSelected}
                  />

                  {selectedFiles.length > 0 && (
                    <FileList
                      items={selectedFiles}
                      onRemove={handleRemoveFile}
                      onClearAll={handleClearAll}
                    />
                  )}

                  <div className="p-4 bg-[#F4F3FA] border border-[#E4E2F0] rounded-xl text-center space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                      Tool Interface Foundation
                    </p>
                    <p className="text-sm text-[#5E6488]">
                      Tool interface coming next. The engine will plug into this controller without modifying page architecture.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {hasCmsBlocks ? (
            subsequentBlocks.map((block: any) => (
              <CmsToolBlock key={block.id} block={block} tool={tool} />
            ))
          ) : (
            <>
              {/* 3. Trust / Benefit Row (Fast • Free • No signup) */}
              <div className="py-4 px-4 md:px-6 bg-[#F4F3FA] border border-[#E4E2F0] rounded-2xl flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm font-bold text-[#7C3AED] mb-10 shadow-sm">
                <span className="inline-flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                  Fast & Local
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                  100% Free
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                  No Signup
                </span>
                <span className="inline-flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#7C3AED]" aria-hidden="true" />
                  Client-Side Privacy
                </span>
              </div>

              {/* 4. How to Use Section */}
              {tool.howTo && tool.howTo.length > 0 && (
                <section className="py-10 border-t border-[#E4E2F0]" aria-labelledby="how-to-heading">
                  <div className="mb-8">
                    <h2 id="how-to-heading" className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight">
                      How to Use {tool.name}
                    </h2>
                    <p className="text-sm md:text-base text-[#5E6488] mt-1.5">
                      Follow these simple steps to process your files directly in your browser.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tool.howTo.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-[#FFFFFF] border border-[#E4E2F0] rounded-[20px] space-y-4 relative shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#6366F1] text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-100">
                          {idx + 1}
                        </div>
                        <h3 className="font-bold text-base text-[#0F112E]">{step.title}</h3>
                        <p className="text-sm text-[#5E6488] leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Natural Ad Placement Slot */}
              <AdSlot slotId={`tool-${tool.slug}-middle`} format="horizontal" />

              {/* 5. Related Tools Section */}
              {relatedSlugs && relatedSlugs.length > 0 && (
                <div className="border-t border-[#E4E2F0] pt-6">
                  <RelatedTools slugs={relatedSlugs} title="Related Tools" />
                </div>
              )}

              {/* 6. Short Introduction / About Tool */}
              {tool.intro && (
                <section className="py-10 border-t border-[#E4E2F0]" aria-labelledby="intro-heading">
                  <div className="max-w-4xl space-y-4">
                    <h2 id="intro-heading" className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight">
                      About {tool.name}
                    </h2>
                    <p className="text-base text-[#5E6488] leading-relaxed">
                      {tool.intro}
                    </p>
                  </div>
                </section>
              )}

              {/* 7. Key Features */}
              <section className="py-10 border-t border-[#E4E2F0]" aria-labelledby="features-heading">
                <div className="mb-8">
                  <h2 id="features-heading" className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight">
                    Key Features of {tool.name}
                  </h2>
                  <p className="text-sm md:text-base text-[#5E6488] mt-1.5">
                    Engineered for speed, privacy, and seamless browser-based processing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tool.features && tool.features.length > 0 ? (
                    tool.features.map((feature, idx) => (
                      <div key={idx} className="p-6 bg-[#FFFFFF] border border-[#E4E2F0] rounded-[20px] space-y-3 hover:border-[#7C3AED]/40 transition-colors shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                          {idx === 0 ? (
                            <Cpu className="w-5 h-5" aria-hidden="true" />
                          ) : idx === 1 ? (
                            <FileCheck className="w-5 h-5" aria-hidden="true" />
                          ) : idx === 2 ? (
                            <Layers className="w-5 h-5" aria-hidden="true" />
                          ) : idx === 3 ? (
                            <Sparkles className="w-5 h-5" aria-hidden="true" />
                          ) : idx === 4 ? (
                            <Zap className="w-5 h-5" aria-hidden="true" />
                          ) : (
                            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                          )}
                        </div>
                        <h3 className="font-bold text-base text-[#0F112E]">{feature.title}</h3>
                        <p className="text-sm text-[#5E6488] leading-relaxed">{feature.description}</p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="p-6 bg-[#FFFFFF] border border-[#E4E2F0] rounded-[20px] space-y-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                          <Lock className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <h3 className="font-bold text-base text-[#0F112E]">100% Privacy</h3>
                        <p className="text-sm text-[#5E6488] leading-relaxed">Files are processed directly in your browser. Nothing is saved or sent to external servers.</p>
                      </div>

                      <div className="p-6 bg-[#FFFFFF] border border-[#E4E2F0] rounded-[20px] space-y-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                          <Zap className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <h3 className="font-bold text-base text-[#0F112E]">Lightning Fast</h3>
                        <p className="text-sm text-[#5E6488] leading-relaxed">Instant conversion without server queuing delays or upload wait times.</p>
                      </div>

                      <div className="p-6 bg-[#FFFFFF] border border-[#E4E2F0] rounded-[20px] space-y-3 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                          <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <h3 className="font-bold text-base text-[#0F112E]">Free Forever</h3>
                        <p className="text-sm text-[#5E6488] leading-relaxed">No subscriptions, credit card requirements, or artificial limits on conversions.</p>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* 8. Privacy Notice */}
              <section className="py-10 border-t border-[#E4E2F0]" aria-labelledby="privacy-heading">
                <div className="p-6 md:p-8 bg-gradient-to-br from-[#FAF9FF] to-[#FFFFFF] border border-[#E4E2F0] rounded-[24px] shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-indigo-100">
                      <ShieldCheck className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="space-y-3 flex-1">
                      <h2 id="privacy-heading" className="text-xl md:text-2xl font-bold text-[#0F112E]">
                        {tool.privacyNote?.title || 'Your Privacy is Fully Protected'}
                      </h2>
                      <p className="text-sm md:text-base text-[#5E6488] leading-relaxed">
                        {tool.privacyNote?.description ||
                          'Your files are processed directly in your browser and do not need to be uploaded to our servers. Conversions execute locally on your device in temporary memory.'}
                      </p>

                      {tool.privacyNote?.bullets && tool.privacyNote.bullets.length > 0 && (
                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          {tool.privacyNote.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-[#5E6488]">
                              <CheckCircle2 className="w-4 h-4 text-[#7C3AED] flex-shrink-0 mt-0.5" aria-hidden="true" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 9. Common Use Cases */}
              {tool.useCases && tool.useCases.length > 0 && (
                <section className="py-10 border-t border-[#E4E2F0]" aria-labelledby="use-cases-heading">
                  <div className="mb-8">
                    <h2 id="use-cases-heading" className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight">
                      Common Use Cases for {tool.name}
                    </h2>
                    <p className="text-sm md:text-base text-[#5E6488] mt-1.5">
                      Practical scenarios where this tool saves time and streamlines workflows.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {tool.useCases.map((useCase, idx) => (
                      <div
                        key={idx}
                        className="p-6 bg-[#FFFFFF] border border-[#E4E2F0] rounded-[20px] space-y-3 hover:border-[#7C3AED]/30 transition-colors shadow-sm"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#F4F3FA] border border-[#E4E2F0] text-[#7C3AED] flex items-center justify-center shadow-sm">
                          {idx === 0 ? (
                            <Palette className="w-5 h-5" aria-hidden="true" />
                          ) : idx === 1 ? (
                            <Globe className="w-5 h-5" aria-hidden="true" />
                          ) : idx === 2 ? (
                            <FileText className="w-5 h-5" aria-hidden="true" />
                          ) : (
                            <Repeat className="w-5 h-5" aria-hidden="true" />
                          )}
                        </div>
                        <h3 className="font-bold text-base text-[#0F112E]">{useCase.title}</h3>
                        <p className="text-sm text-[#5E6488] leading-relaxed">{useCase.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Natural Ad Placement Slot */}
              <AdSlot slotId={`tool-${tool.slug}-bottom`} format="horizontal" />

              {/* 10. FAQ Section */}
              {tool.faq && tool.faq.length > 0 && (
                <div className="border-t border-[#E4E2F0] pt-6">
                  <FAQ items={tool.faq} title={`Frequently Asked Questions about ${tool.name}`} />
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </>
  );
}

export default ToolPage;
