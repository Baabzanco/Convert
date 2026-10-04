import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Smartphone,
  Image as ImageIcon,
  FileText,
  Sparkles,
} from 'lucide-react';
import Container from '@/components/layout/Container';
import ToolCard from '@/components/tool/ToolCard';
import HomeSearch from '@/components/tool/HomeSearch';
import FAQ from '@/components/seo/FAQ';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import { getAllFormats } from '@/lib/formats';
import { GENERAL_FAQS } from '@/lib/faq';
import { getPublishedPage, buildCmsMetadata, CmsJsonLd } from '@/lib/cms/page-resolver';

const DEFAULT_METADATA: Metadata = {
  title: 'Free Online File Tools – Convert, Compress & Edit Files Free',
  description:
    'Fast, secure, 100% free image and PDF conversion utilities. Convert JPG, PNG, WEBP, HEIC, PDF and compress documents with complete client-side privacy.',
};

export async function generateMetadata(): Promise<Metadata> {
  const cmsPage = await getPublishedPage('home');
  return buildCmsMetadata(cmsPage, DEFAULT_METADATA);
}

export default async function HomePage() {
  const cmsPage = await getPublishedPage('home');
  const allTools = getAllTools();
  const allFormats = getAllFormats();

  // Curated popular tools: 6 high-utility tools across Image & PDF
  const popularSlugs = [
    'jpg-to-png',
    'png-to-jpg',
    'compress-image',
    'compress-pdf',
    'merge-pdf',
    'pdf-to-jpg',
  ];
  const popularTools = popularSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const imageToolsCount = allTools.filter((t) => t.category.startsWith('image') || ['image-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(t.slug)).length;
  const pdfToolsCount = allTools.filter((t) => t.category.startsWith('pdf') && !['image-to-pdf', 'jpg-to-pdf', 'png-to-pdf'].includes(t.slug)).length;

  return (
    <div className="space-y-16 md:space-y-24 pb-20 bg-[#FCFBFF]">
      <CmsJsonLd schema={cmsPage?.seo?.schemaJson} />

      {/* 1. HERO & TOOL DISCOVERY SECTION (Redesigned as floating rounded premium container) */}
      <section className="pt-8 md:pt-12 px-4 sm:px-6">
        <Container>
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FAF9FF] via-[#EEEDFC] to-[#E5E7FF] border border-[#E4E2F0] px-6 py-12 md:py-20 text-center shadow-xl shadow-indigo-100/50">
            {/* Soft decorative shapes */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 rounded-full bg-indigo-300/25 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-6 mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E4E2F0] text-xs font-bold text-[#7C3AED] uppercase tracking-wider rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                100% Free & Client-Side Private
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F112E] tracking-tight leading-tight text-wrap-balance">
                {cmsPage?.name ? cmsPage.name : 'Free Online File Tools'}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-[#5E6488] max-w-2xl mx-auto leading-relaxed">
                Convert, compress and manage your files quickly and easily without sending them across the internet.
              </p>
            </div>

            {/* Core Discovery Header & Prompt */}
            <div className="relative z-10 max-w-2xl mx-auto space-y-4 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#7C3AED] tracking-tight">
                What do you want to do?
              </h2>
              
              {/* Search Bar reading from Tool Registry */}
              <HomeSearch tools={allTools} placeholder="Search tools..." id="home-tool-search" />

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-[#5E6488]">
                <span className="font-bold text-[#0F112E]">Quick search:</span>
                {[
                  { label: 'compress pdf', slug: 'compress-pdf' },
                  { label: 'jpg to png', slug: 'jpg-to-png' },
                  { label: 'merge pdf', slug: 'merge-pdf' },
                  { label: 'compress image', slug: 'compress-image' },
                  { label: 'resize image', slug: 'resize-image' },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/tools/${item.slug}`}
                    className="px-3 py-1.5 bg-[#FFFFFF] border border-[#E4E2F0] hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#0F112E] rounded-xl shadow-sm transition-all font-semibold"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. POPULAR TOOLS (Curated subset with visual cards) */}
      <section aria-labelledby="popular-tools-heading">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <h2
                id="popular-tools-heading"
                className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight"
              >
                Popular tools
              </h2>
              <p className="text-sm md:text-base text-[#5E6488] mt-1.5">
                Frequently used converters and optimizers.
              </p>
            </div>
            <Link
              href="#explore-hubs"
              className="inline-flex items-center text-sm font-bold text-[#7C3AED] hover:underline transition-colors"
            >
              <span>Explore all tools</span>
              <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      {/* 3. EXPLORE ALL TOOLS HUBS (Two-Level Discovery Hubs redesigned as soft pastel cards) */}
      <section id="explore-hubs" aria-labelledby="explore-all-tools-heading" className="scroll-mt-20">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              id="explore-all-tools-heading"
              className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight"
            >
              Explore all tools
            </h2>
            <p className="text-sm md:text-base text-[#5E6488] mt-2">
              Browse our simple discovery hubs to find exactly what you need without clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Tools Discovery Hub Card */}
            <div className="p-6 md:p-8 bg-[#FCFBFF] border border-[#E4E2F0] hover:border-[#7C3AED]/40 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                    <ImageIcon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-[#F4F0FD] text-[#7C3AED] rounded-md border border-[#E4E2F0]/40">
                    {imageToolsCount} Tools
                  </span>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0F112E] group-hover:text-[#7C3AED] transition-colors">
                    Image Tools Hub
                  </h3>
                  <p className="text-sm text-[#5E6488] mt-2 leading-relaxed">
                    Convert between JPG, PNG, WebP, HEIC, SVG, GIF, and BMP. Compress photos,
                    resize dimensions, crop frames, and orient images.
                  </p>
                </div>

                {/* Categories Preview */}
                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded-xl font-semibold text-[#5E6488]">
                    Convert (10)
                  </span>
                  <span className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded-xl font-semibold text-[#5E6488]">
                    Compress (1)
                  </span>
                  <span className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded-xl font-semibold text-[#5E6488]">
                    Edit (3)
                  </span>
                  <span className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded-xl font-semibold text-[#5E6488]">
                    Create (3)
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F4F3FA]">
                <Link
                  href="/image-tools"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] transition-all shadow-sm"
                >
                  <span>Explore image tools ({imageToolsCount})</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* PDF Tools Discovery Hub Card */}
            <div className="p-6 md:p-8 bg-[#FCFBFF] border border-[#E4E2F0] hover:border-[#7C3AED]/40 rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#3B82F6] flex items-center justify-center shadow-sm">
                    <FileText className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-[#EFF6FF] text-[#3B82F6] rounded-md border border-[#E4E2F0]/40">
                    {pdfToolsCount} Tools
                  </span>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0F112E] group-hover:text-[#3B82F6] transition-colors">
                    PDF Tools Hub
                  </h3>
                  <p className="text-sm text-[#5E6488] mt-2 leading-relaxed">
                    Merge multiple documents, split pages, compress file sizes, rotate
                    orientation, delete pages, reorder pages, and convert to images.
                  </p>
                </div>

                {/* Categories Preview */}
                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded-xl font-semibold text-[#5E6488]">
                    Convert (2)
                  </span>
                  <span className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded-xl font-semibold text-[#5E6488]">
                    Organize (5)
                  </span>
                  <span className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded-xl font-semibold text-[#5E6488]">
                    Optimize (1)
                  </span>
                  <span className="px-2.5 py-1.5 bg-white border border-[#E4E2F0] rounded-xl font-semibold text-[#5E6488]">
                    Create (3)
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F4F3FA]">
                <Link
                  href="/pdf-tools"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] transition-all shadow-sm"
                >
                  <span>Explore PDF tools ({pdfToolsCount})</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. WHY USE US (SaaS styled feature grid) */}
      <section
        className="bg-[#F4F3FA] py-16 md:py-20 border-y border-[#E4E2F0]"
        aria-labelledby="why-use-us-heading"
      >
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              id="why-use-us-heading"
              className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight"
            >
              Why Use Convert24
            </h2>
            <p className="text-sm md:text-base text-[#5E6488] mt-2">
              Engineered for speed, strict privacy, and hassle-free utility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white border border-[#E4E2F0] rounded-[20px] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg text-[#0F112E]">Client-Side Privacy</h3>
              <p className="text-sm text-[#5E6488] leading-relaxed">
                Files process directly in your browser. No files are uploaded to external cloud
                servers.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E4E2F0] rounded-[20px] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg text-[#0F112E]">100% Free</h3>
              <p className="text-sm text-[#5E6488] leading-relaxed">
                No registrations, no subscriptions, and no watermarks placed on your documents or
                photos.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E4E2F0] rounded-[20px] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg text-[#0F112E]">Ultra Fast</h3>
              <p className="text-sm text-[#5E6488] leading-relaxed">
                Skip remote file upload latency. Local browser execution delivers near-instant
                conversion.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#E4E2F0] rounded-[20px] space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] text-[#7C3AED] flex items-center justify-center shadow-sm">
                <Smartphone className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-lg text-[#0F112E]">Mobile Friendly</h3>
              <p className="text-sm text-[#5E6488] leading-relaxed">
                Designed mobile-first with touch-friendly controls for smartphones, tablets, and
                desktops.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. LATEST GUIDES */}
      <section aria-labelledby="guides-heading">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-8">
            <div>
              <h2
                id="guides-heading"
                className="text-2xl md:text-3xl font-extrabold text-[#0F112E] tracking-tight"
              >
                Latest Guides & Formats
              </h2>
              <p className="text-sm md:text-base text-[#5E6488] mt-1">
                Learn about image formats, compression techniques, and document standards.
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-bold text-[#7C3AED] hover:underline"
            >
              <span>View all guides</span>
              <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFormats.slice(0, 3).map((format) => (
              <Link
                key={format.slug}
                href={`/formats/${format.slug}`}
                className="group p-6 bg-white border border-[#E4E2F0] rounded-[20px] hover:border-[#7C3AED]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] mb-2.5">
                  Format Guide • {format.name}
                </div>
                <h3 className="font-bold text-lg text-[#0F112E] group-hover:text-[#7C3AED] transition-colors mb-2">
                  {format.title}
                </h3>
                <p className="text-sm text-[#5E6488] line-clamp-2 leading-relaxed">
                  {format.description}
                </p>
                <div className="mt-4 flex items-center text-xs font-bold text-[#7C3AED] group-hover:translate-x-1 transition-transform duration-200">
                  <span>Read format guide</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 6. PRICING ANCHOR (Redesigned visual subscription simulation for premium SaaS landing feel) */}
      <section id="pricing" className="scroll-mt-20">
        <Container>
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-tr from-[#0F112E] to-[#1E1B4B] text-white p-8 md:p-12 shadow-xl border border-indigo-900/50">
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-80 h-80 rounded-full bg-violet-600/30 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/20 text-xs font-bold text-violet-300 uppercase tracking-wider rounded-full border border-violet-500/30">
                  Pricing Plans
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  Always 100% Free. No Hidden Fees.
                </h2>
                <p className="text-sm md:text-base text-indigo-200 max-w-2xl leading-relaxed">
                  Unlike other tools that lock premium features like high-quality compression or batch uploads behind payment walls, all 25 tools on Convert24 are fully free with unlimited conversions, zero registration, and complete browser security.
                </p>
              </div>
              <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-widest text-violet-300 font-bold">Standard plan</p>
                <p className="text-4xl md:text-5xl font-black">$0<span className="text-xs text-indigo-300 font-normal"> / forever</span></p>
                <ul className="text-xs text-indigo-200 space-y-2 text-left max-w-xs mx-auto">
                  <li className="flex items-center gap-2">✓ Unlimited Batch Conversions</li>
                  <li className="flex items-center gap-2">✓ 50 MB File Size Allowance</li>
                  <li className="flex items-center gap-2">✓ Safe Local Browser Processing</li>
                </ul>
                <Link
                  href="#explore-hubs"
                  className="block w-full text-center py-3 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] hover:from-[#6D28D9] hover:to-[#4F46E5] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-[0.98]"
                >
                  Get Started Instantly
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. FAQ */}
      <section id="faq" className="scroll-mt-20">
        <Container>
          <FAQ items={GENERAL_FAQS} />
        </Container>
      </section>
    </div>
  );
}
