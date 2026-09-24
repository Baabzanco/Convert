'use client';

import React, { useState } from 'react';
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
import { ShieldCheck, Zap, Lock, Cpu, Sparkles } from 'lucide-react';
import JsonLd from '@/components/seo/JsonLd';
import { createWebApplicationSchema, createBreadcrumbSchema, siteConfig } from '@/lib/seo';

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

  return (
    <>
      <JsonLd data={webAppSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="py-6 md:py-10">
        <Container>
          {/* Breadcrumb */}
          <Breadcrumbs items={breadcrumbs} />

          {/* H1 & Intro Header */}
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight mb-3">
              {tool.h1}
            </h1>
            <p className="text-base md:text-lg text-[#667085] leading-relaxed">
              {tool.intro}
            </p>
          </div>

          {/* Tool UI Container */}
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

                {/* Status banner for placeholder tools */}
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

          {/* Ad Placeholder */}
          <AdSlot slotId={`tool-${tool.slug}`} format="horizontal" />

          {/* How to Use Section */}
          {tool.howTo && tool.howTo.length > 0 && (
            <section className="py-8 border-t border-[#E5E7EB]" aria-labelledby="how-to-heading">
              <h2 id="how-to-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight mb-6">
                How to Use {tool.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tool.howTo.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2"
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

          {/* Features Section */}
          <section className="py-8 border-t border-[#E5E7EB]" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight mb-6">
              Why Use Our {tool.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {tool.features && tool.features.length > 0 ? (
                tool.features.map((feature, idx) => (
                  <div key={idx} className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                      {idx === 0 ? (
                        <Cpu className="w-5 h-5" aria-hidden="true" />
                      ) : idx === 1 ? (
                        <Sparkles className="w-5 h-5" aria-hidden="true" />
                      ) : idx === 2 ? (
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

                  <div className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
                    <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                      <Cpu className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-base text-[#17202A]">Device Friendly</h3>
                    <p className="text-sm text-[#667085]">Optimized for mobile phones, tablets, and desktop workstations seamlessly.</p>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* FAQ Section */}
          {tool.faq && tool.faq.length > 0 && (
            <div className="border-t border-[#E5E7EB]">
              <FAQ items={tool.faq} title={`Frequently Asked Questions about ${tool.name}`} />
            </div>
          )}

          {/* Related Tools Section */}
          {tool.relatedTools && tool.relatedTools.length > 0 && (
            <div className="border-t border-[#E5E7EB]">
              <RelatedTools slugs={tool.relatedTools} />
            </div>
          )}
        </Container>
      </div>
    </>
  );
}

export default ToolPage;
