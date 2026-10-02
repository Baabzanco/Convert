import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { StructuredPageBlock } from '@/lib/admin/types';
import { sanitizeRichTextHtml } from '@/lib/admin/validation';
import JsonLd from '@/components/seo/JsonLd';

export interface ResolvedCmsPage {
  id: string;
  slug: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED';
  publishedAt: Date | null;
  blocks: StructuredPageBlock[];
  customCss?: string | null;
  seo?: {
    seoTitle?: string | null;
    metaDescription?: string | null;
    canonicalUrl?: string | null;
    robotsIndex?: boolean;
    robotsFollow?: boolean;
    ogTitle?: string | null;
    ogDescription?: string | null;
    ogImage?: string | null;
    twitterTitle?: string | null;
    twitterDescription?: string | null;
    twitterImage?: string | null;
    schemaType?: string | null;
    schemaJson?: Record<string, any> | null;
    focusKeyword?: string | null;
  } | null;
}

/**
 * Public Content Resolver.
 * Resolves a published page by slug.
 * Strictly enforces that draft pages return NULL to public visitors.
 */
export async function getPublishedPage(slug: string): Promise<ResolvedCmsPage | null> {
  const db = getDb();
  const page = await db.page.findUnique({
    where: { slug },
    include: {
      content: true,
      seo: true,
    },
  });

  if (!page || page.status !== 'PUBLISHED') {
    return null;
  }

  const rawBlocks = (page.content?.blocks as any[]) || [];

  return {
    id: page.id,
    slug: page.slug,
    name: page.name,
    status: page.status,
    publishedAt: page.publishedAt,
    blocks: rawBlocks,
    customCss: page.content?.customCss,
    seo: page.seo,
  };
}

/**
 * Generates Next.js App Router Metadata from CMS page data, falling back to default site metadata.
 */
export function buildCmsMetadata(
  cmsPage: ResolvedCmsPage | null,
  defaultMeta: Metadata
): Metadata {
  if (!cmsPage || !cmsPage.seo) {
    return defaultMeta;
  }

  const seo = cmsPage.seo;
  const title = seo.seoTitle || (defaultMeta.title as string);
  const description = seo.metaDescription || (defaultMeta.description as string);
  const canonical = seo.canonicalUrl || (defaultMeta.alternates as any)?.canonical;

  return {
    ...defaultMeta,
    title,
    description,
    alternates: canonical
      ? {
          canonical,
        }
      : defaultMeta.alternates,
    robots: {
      index: seo.robotsIndex !== false,
      follow: seo.robotsFollow !== false,
    },
    openGraph: {
      ...defaultMeta.openGraph,
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : (defaultMeta.openGraph?.images as any),
    },
    twitter: {
      ...defaultMeta.twitter,
      title: seo.twitterTitle || title,
      description: seo.twitterDescription || description,
      images: seo.twitterImage ? [seo.twitterImage] : (defaultMeta.twitter?.images as any),
    },
  };
}

/**
 * Safe CmsBlockRenderer that renders structured content blocks using the existing design language.
 */
export function CmsBlockRenderer({ blocks }: { blocks: StructuredPageBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case 'section':
            return (
              <section key={block.id} className="pt-4 pb-2 space-y-2 border-t border-[#F1F5F9] first:border-0 first:pt-0">
                {block.title && (
                  <h2 className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                    {block.title}
                  </h2>
                )}
                {block.description && (
                  <p className="text-base text-[#667085] leading-relaxed">
                    {block.description}
                  </p>
                )}
              </section>
            );

          case 'heading': {
            if (block.level === 1) {
              return (
                <h1 key={block.id} className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight">
                  {block.text}
                </h1>
              );
            }
            if (block.level === 3) {
              return (
                <h3 key={block.id} className="text-xl font-bold text-[#17202A] tracking-tight">
                  {block.text}
                </h3>
              );
            }
            return (
              <h2 key={block.id} className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                {block.text}
              </h2>
            );
          }

          case 'paragraph':
            return (
              <p key={block.id} className="text-base text-[#17202A] leading-relaxed">
                {block.text}
              </p>
            );

          case 'rich_text': {
            const cleanHtml = sanitizeRichTextHtml(block.html);
            return (
              <div
                key={block.id}
                className="text-base text-[#17202A] leading-relaxed prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            );
          }

          case 'cta': {
            const isPrimary = block.variant !== 'outline' && block.variant !== 'secondary';
            return (
              <div key={block.id} className="pt-2">
                <Link
                  href={block.href || '#'}
                  className={`inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isPrimary
                      ? 'bg-[#124A57] text-white hover:bg-[#0E3B46] shadow-sm'
                      : 'bg-white border border-[#CBD5E1] text-[#17202A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {block.label}
                </Link>
              </div>
            );
          }

          case 'link':
            return (
              <div key={block.id}>
                <Link
                  href={block.href || '#'}
                  target={block.isExternal ? '_blank' : undefined}
                  rel={block.isExternal ? 'noopener noreferrer' : undefined}
                  className="text-sm font-semibold text-[#124A57] hover:underline"
                >
                  {block.text}
                </Link>
              </div>
            );

          case 'feature':
            return (
              <div key={block.id} className="p-5 bg-white border border-[#E5E7EB] rounded-card space-y-2">
                <h3 className="font-semibold text-base text-[#17202A]">{block.title}</h3>
                <p className="text-sm text-[#667085]">{block.description}</p>
              </div>
            );

          case 'faq':
            return (
              <div key={block.id} className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg space-y-1.5">
                <h4 className="font-semibold text-sm text-[#17202A]">{block.question}</h4>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{block.answer}</p>
              </div>
            );

          case 'image':
            return (
              <div key={block.id} className="space-y-1.5 pt-2">
                <img
                  src={block.src}
                  alt={block.alt || 'CMS image'}
                  className="rounded-card border border-[#E5E7EB] max-w-full h-auto"
                />
                {block.caption && (
                  <p className="text-xs text-[#64748B] italic">{block.caption}</p>
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

/**
 * Component to inject custom JSON-LD schema from CMS SEO settings safely.
 */
export function CmsJsonLd({ schema }: { schema?: Record<string, any> | null }) {
  if (!schema) return null;
  return <JsonLd data={schema} />;
}
