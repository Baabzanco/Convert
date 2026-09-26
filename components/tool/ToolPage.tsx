'use client';

import React, { useState } from 'react';
import { ToolDefinition } from '@/lib/tools';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import AdSlot from '@/components/ads/AdSlot';
import FAQ from '@/components/seo/FAQ';
import RelatedTools from '@/components/seo/RelatedTools';
import YouMayAlsoNeed from '@/components/seo/YouMayAlsoNeed';
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

export function ToolPage({ tool }: ToolPageProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileItemData[]>([]);

  const isImageCategory = tool.category.startsWith('image');
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
  const youMayAlsoNeedSlugs = tool.youMayAlsoNeed || tool.relatedTools.slice(0, 3);

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}
      {howToSchema && <JsonLd data={howToSchema} />}

      <div className="py-6 md:py-10">
        <Container>
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbs} />

          {/* 1. H1 Header & 2. Value Proposition */}
          <header className="max-w-3xl mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight mb-3">
              {tool.h1}
            </h1>
            <p className="text-base sm:text-lg text-[#667085] leading-relaxed mb-4">
              {valuePropText}
            </p>

            {/* Value Proposition Benefit Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#124A57]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F7F8] border border-[#E2F0F2] rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#124A57]" aria-hidden="true" />
                100% Free
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F7F8] border border-[#E2F0F2] rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#124A57]" aria-hidden="true" />
                No Registration
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F7F8] border border-[#E2F0F2] rounded-full">
                <Lock className="w-3.5 h-3.5 text-[#124A57]" aria-hidden="true" />
                Zero File Uploads
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0F7F8] border border-[#E2F0F2] rounded-full">
                <Cpu className="w-3.5 h-3.5 text-[#124A57]" aria-hidden="true" />
                Client-Side Processing
              </span>
            </div>
          </header>

          {/* 3. Primary Tool UI */}
          <section aria-label={`${tool.name} Converter Interface`} className="mb-6">
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
            ) : (
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-card p-6 md:p-8 shadow-subtle mb-6">
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

                  <div className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg text-center space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#124A57]">
                      Tool Interface Foundation
                    </p>
                    <p className="text-sm text-[#667085]">
                      Tool interface coming next. The engine will plug into this controller without modifying page architecture.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 4. Related Tools Immediately Below Tool UI ("You may also need") */}
          {youMayAlsoNeedSlugs && youMayAlsoNeedSlugs.length > 0 && (
            <YouMayAlsoNeed slugs={youMayAlsoNeedSlugs} />
          )}

          {/* Ad Slot */}
          <AdSlot slotId={`tool-${tool.slug}`} format="horizontal" />

          {/* 5. Short Introduction */}
          {tool.intro && (
            <section className="py-8 border-t border-[#E5E7EB]" aria-labelledby="intro-heading">
              <div className="max-w-4xl space-y-3">
                <h2 id="intro-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                  About {tool.name} Converter
                </h2>
                <p className="text-base text-[#667085] leading-relaxed">
                  {tool.intro}
                </p>
              </div>
            </section>
          )}

          {/* 6. Key Features */}
          <section className="py-8 border-t border-[#E5E7EB]" aria-labelledby="features-heading">
            <div className="mb-6">
              <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                Key Features of {tool.name}
              </h2>
              <p className="text-sm md:text-base text-[#667085] mt-1">
                Engineered for speed, privacy, and seamless browser-based conversion.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tool.features && tool.features.length > 0 ? (
                tool.features.map((feature, idx) => (
                  <div key={idx} className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2 hover:border-[#124A57]/40 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
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
                    <h3 className="font-semibold text-base text-[#17202A]">{feature.title}</h3>
                    <p className="text-sm text-[#667085] leading-relaxed">{feature.description}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                      <Lock className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-base text-[#17202A]">100% Privacy</h3>
                    <p className="text-sm text-[#667085]">Files are processed directly in your browser. Nothing is saved or sent to external servers.</p>
                  </div>

                  <div className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                      <Zap className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-base text-[#17202A]">Lightning Fast</h3>
                    <p className="text-sm text-[#667085]">Instant conversion without server queuing delays or upload wait times.</p>
                  </div>

                  <div className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-base text-[#17202A]">Free Forever</h3>
                    <p className="text-sm text-[#667085]">No subscriptions, credit card requirements, or artificial limits on conversions.</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 7. How to Use Section */}
          {tool.howTo && tool.howTo.length > 0 && (
            <section className="py-8 border-t border-[#E5E7EB]" aria-labelledby="how-to-heading">
              <div className="mb-6">
                <h2 id="how-to-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                  How to Use {tool.name}
                </h2>
                <p className="text-sm md:text-base text-[#667085] mt-1">
                  Follow these simple steps to convert your files directly in your browser.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tool.howTo.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-3 relative"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#124A57] text-white flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <h3 className="font-semibold text-base text-[#17202A]">{step.title}</h3>
                    <p className="text-sm text-[#667085] leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 8. Privacy / Client-Side Processing */}
          <section className="py-8 border-t border-[#E5E7EB]" aria-labelledby="privacy-heading">
            <div className="p-6 md:p-8 bg-gradient-to-br from-[#F0F7F8] to-[#FFFFFF] border border-[#124A57]/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#124A57] text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <ShieldCheck className="w-6 h-6" aria-hidden="true" />
                </div>
                <div className="space-y-3 flex-1">
                  <h2 id="privacy-heading" className="text-xl md:text-2xl font-bold text-[#17202A]">
                    {tool.privacyNote?.title || 'Your Privacy is Fully Protected'}
                  </h2>
                  <p className="text-sm md:text-base text-[#475467] leading-relaxed">
                    {tool.privacyNote?.description ||
                      'Your files are processed directly in your browser and do not need to be uploaded to our servers. Conversions execute locally on your device in temporary memory.'}
                  </p>

                  {tool.privacyNote?.bullets && tool.privacyNote.bullets.length > 0 && (
                    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      {tool.privacyNote.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-[#344054]">
                          <CheckCircle2 className="w-4 h-4 text-[#124A57] flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 9. Use Cases */}
          {tool.useCases && tool.useCases.length > 0 && (
            <section className="py-8 border-t border-[#E5E7EB]" aria-labelledby="use-cases-heading">
              <div className="mb-6">
                <h2 id="use-cases-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                  Common Use Cases for {tool.name}
                </h2>
                <p className="text-sm md:text-base text-[#667085] mt-1">
                  When and why you should convert your images to PNG format.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {tool.useCases.map((useCase, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2 hover:border-[#124A57]/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] text-[#124A57] flex items-center justify-center">
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
                    <h3 className="font-semibold text-base text-[#17202A]">{useCase.title}</h3>
                    <p className="text-sm text-[#667085] leading-relaxed">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 10. FAQ Section */}
          {tool.faq && tool.faq.length > 0 && (
            <div className="border-t border-[#E5E7EB]">
              <FAQ items={tool.faq} title={`Frequently Asked Questions about ${tool.name}`} />
            </div>
          )}

          {/* 11. Related Tools / Guides where appropriate */}
          {tool.relatedTools && tool.relatedTools.length > 0 && (
            <div className="border-t border-[#E5E7EB]">
              <RelatedTools slugs={tool.relatedTools} title="Explore More File Tools" />
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

export default ToolPage;
