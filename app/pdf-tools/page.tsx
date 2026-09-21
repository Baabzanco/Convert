import React from 'react';
import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import ToolCard from '@/components/tool/ToolCard';
import AdSlot from '@/components/ads/AdSlot';
import { getToolsByCategory } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Free Online PDF Tools – Merge, Split, Compress & Convert',
  description: 'Free browser-based PDF utilities. Merge PDF documents, split pages, compress file sizes, rotate orientation, delete, reorder, and convert to images safely.',
};

export default function PdfToolsPage() {
  const converters = getToolsByCategory('pdf-converter');
  const utilities = getToolsByCategory('pdf-utility');

  return (
    <div className="py-8 md:py-12 space-y-10">
      <Container>
        <Breadcrumbs items={[{ name: 'PDF Tools' }]} />

        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight mb-3">
            Free Online PDF Tools
          </h1>
          <p className="text-base md:text-lg text-[#667085] leading-relaxed">
            Manage your PDF files securely. Combine documents, extract pages, compress large files, rotate orientations, and convert PDFs without server uploads.
          </p>
        </div>

        {/* Converters Section */}
        <section className="mb-12" aria-labelledby="pdf-converters-heading">
          <div className="mb-6">
            <h2 id="pdf-converters-heading" className="text-2xl font-bold text-[#17202A] tracking-tight">
              PDF Converters
            </h2>
            <p className="text-sm text-[#667085] mt-1">
              Convert images to PDF documents and extract PDF pages as JPG and PNG pictures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {converters.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        <AdSlot slotId="pdf-tools-middle" />

        {/* Utilities Section */}
        <section aria-labelledby="pdf-utilities-heading">
          <div className="mb-6">
            <h2 id="pdf-utilities-heading" className="text-2xl font-bold text-[#17202A] tracking-tight">
              PDF Utilities
            </h2>
            <p className="text-sm text-[#667085] mt-1">
              Merge, split, compress, rotate, reorder, and delete pages from PDF files.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {utilities.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
