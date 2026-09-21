import React from 'react';
import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import ToolCard from '@/components/tool/ToolCard';
import AdSlot from '@/components/ads/AdSlot';
import { getToolsByCategory } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Free Online Image Tools – Convert, Compress & Edit Photos',
  description: 'Free browser-based image converters and utilities. Convert JPG, PNG, WEBP, HEIC, compress photos, resize, crop, and rotate with 100% privacy.',
};

export default function ImageToolsPage() {
  const converters = getToolsByCategory('image-converter');
  const utilities = getToolsByCategory('image-utility');

  return (
    <div className="py-8 md:py-12 space-y-10">
      <Container>
        <Breadcrumbs items={[{ name: 'Image Tools' }]} />

        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight mb-3">
            Free Online Image Tools
          </h1>
          <p className="text-base md:text-lg text-[#667085] leading-relaxed">
            Convert image formats, optimize file sizes, crop, resize, and rotate pictures directly in your browser with zero uploads to remote servers.
          </p>
        </div>

        {/* Converters Section */}
        <section className="mb-12" aria-labelledby="image-converters-heading">
          <div className="mb-6">
            <h2 id="image-converters-heading" className="text-2xl font-bold text-[#17202A] tracking-tight">
              Image Converters
            </h2>
            <p className="text-sm text-[#667085] mt-1">
              Switch between JPG, PNG, WEBP, HEIC, SVG, GIF, and BMP formats instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {converters.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        <AdSlot slotId="image-tools-middle" />

        {/* Utilities Section */}
        <section aria-labelledby="image-utilities-heading">
          <div className="mb-6">
            <h2 id="image-utilities-heading" className="text-2xl font-bold text-[#17202A] tracking-tight">
              Image Utilities
            </h2>
            <p className="text-sm text-[#667085] mt-1">
              Compress, resize dimensions, crop frames, and orient images quickly.
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
