import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Lock, Smartphone } from 'lucide-react';
import Container from '@/components/layout/Container';
import ToolCard from '@/components/tool/ToolCard';
import HomeSearch from '@/components/tool/HomeSearch';
import FAQ from '@/components/seo/FAQ';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import { getAllFormats } from '@/lib/formats';
import { GENERAL_FAQS } from '@/lib/faq';

export default function HomePage() {
  const allTools = getAllTools();
  const allFormats = getAllFormats();

  // Defined popular tools: JPG to PNG, PNG to JPG, Compress Image, PDF to JPG
  const popularSlugs = ['jpg-to-png', 'png-to-jpg', 'compress-image', 'pdf-to-jpg'];
  const popularTools = popularSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t) => Boolean(t));

  const imageTools = allTools.filter((t) => t.category.startsWith('image'));
  const pdfTools = allTools.filter((t) => t.category.startsWith('pdf'));

  return (
    <div className="space-y-12 md:space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="pt-10 md:pt-16 pb-8 bg-gradient-to-b from-[#F8FAFC] to-[#FFFFFF] border-b border-[#E5E7EB]">
        <Container className="text-center">
          <div className="max-w-3xl mx-auto space-y-4 mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight">
              Free Online File Tools
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#667085] leading-relaxed">
              Convert, compress and manage your files quickly and easily.
            </p>
          </div>

          {/* Search Bar reading from Tool Registry */}
          <HomeSearch tools={allTools} />
        </Container>
      </section>

      {/* 2. POPULAR TOOLS */}
      <section aria-labelledby="popular-tools-heading">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 id="popular-tools-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                Popular Tools
              </h2>
              <p className="text-sm md:text-base text-[#667085] mt-1">
                Frequently used converters and optimizers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.map((tool) => (
              tool && <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      {/* 3. IMAGE TOOLS */}
      <section aria-labelledby="image-tools-heading">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 id="image-tools-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                Image Tools
              </h2>
              <p className="text-sm md:text-base text-[#667085] mt-1">
                Convert formats, compress photos, resize, crop, and transform graphics.
              </p>
            </div>
            <Link
              href="/image-tools"
              className="inline-flex items-center text-sm font-semibold text-[#124A57] hover:underline"
            >
              <span>View all image tools ({imageTools.length})</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      {/* 4. PDF TOOLS */}
      <section aria-labelledby="pdf-tools-heading">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 id="pdf-tools-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                PDF Tools
              </h2>
              <p className="text-sm md:text-base text-[#667085] mt-1">
                Merge documents, split pages, compress, convert, and reorganize PDFs.
              </p>
            </div>
            <Link
              href="/pdf-tools"
              className="inline-flex items-center text-sm font-semibold text-[#124A57] hover:underline"
            >
              <span>View all PDF tools ({pdfTools.length})</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pdfTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      {/* 5. WHY USE US */}
      <section className="bg-[#F8FAFC] py-12 md:py-16 border-y border-[#E5E7EB]" aria-labelledby="why-use-us-heading">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 id="why-use-us-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
              Why Use FileTools
            </h2>
            <p className="text-sm md:text-base text-[#667085] mt-2">
              Engineered for speed, strict privacy, and hassle-free utility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg text-[#17202A]">Client-Side Privacy</h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                Files process directly in your browser. No files are uploaded to external cloud servers.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg text-[#17202A]">100% Free</h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                No registrations, no subscriptions, and no watermarks placed on your documents or photos.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <Zap className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg text-[#17202A]">Ultra Fast</h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                Skip remote file upload latency. Local browser execution delivers near-instant conversion.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <Smartphone className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-lg text-[#17202A]">Mobile Friendly</h3>
              <p className="text-sm text-[#667085] leading-relaxed">
                Designed mobile-first with touch-friendly controls for smartphones, tablets, and desktops.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. LATEST GUIDES */}
      <section aria-labelledby="guides-heading">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 id="guides-heading" className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                Latest Guides & Formats
              </h2>
              <p className="text-sm md:text-base text-[#667085] mt-1">
                Learn about image formats, compression techniques, and document standards.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold text-[#124A57] hover:underline"
            >
              <span>View all guides</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {allFormats.slice(0, 3).map((format) => (
              <Link
                key={format.slug}
                href={`/formats/${format.slug}`}
                className="group p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card hover:border-[#124A57]/40 hover:shadow-subtle transition-all"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-[#124A57] mb-2">
                  Format Guide • {format.name}
                </div>
                <h3 className="font-semibold text-lg text-[#17202A] group-hover:text-[#124A57] transition-colors mb-2">
                  {format.title}
                </h3>
                <p className="text-sm text-[#667085] line-clamp-2 leading-relaxed">
                  {format.description}
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-[#124A57] group-hover:translate-x-0.5 transition-transform">
                  <span>Read format guide</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 7. FAQ */}
      <section>
        <Container>
          <FAQ items={GENERAL_FAQS} />
        </Container>
      </section>
    </div>
  );
}
