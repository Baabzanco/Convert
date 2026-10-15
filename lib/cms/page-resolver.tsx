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
      {blocks.map((block: any) => {
        if (!block || block.enabled === false) return null;

        const type = block.type;
        const title = block.title || block.content?.title || block.data?.title;
        const description = block.description || block.content?.description || block.data?.description;
        const text = block.text || block.content?.text || block.data?.text;
        const html = block.html || block.content?.html || block.data?.html;
        const level = block.level || block.content?.level || block.data?.level || 2;
        const href = block.href || block.content?.href || block.data?.href || '#';
        const label = block.label || block.content?.label || block.data?.label || text || 'Click Here';
        const variant = block.variant || block.content?.variant || block.data?.variant;
        const isExternal = block.isExternal || block.content?.isExternal || block.data?.isExternal;
        const question = block.question || block.content?.question || block.data?.question;
        const answer = block.answer || block.content?.answer || block.data?.answer;
        const src = block.src || block.content?.src || block.data?.src;
        const alt = block.alt || block.content?.alt || block.data?.alt || 'CMS Image';
        const caption = block.caption || block.content?.caption || block.data?.caption;

        switch (type) {
          case 'section':
            return (
              <section key={block.id} className="pt-4 pb-2 space-y-2 border-t border-[#F1F5F9] first:border-0 first:pt-0">
                {title && (
                  <h2 className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-base text-[#667085] leading-relaxed">
                    {description}
                  </p>
                )}
              </section>
            );

          case 'heading': {
            if (Number(level) === 1) {
              return (
                <h1 key={block.id} className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight">
                  {text}
                </h1>
              );
            }
            if (Number(level) === 3) {
              return (
                <h3 key={block.id} className="text-xl font-bold text-[#17202A] tracking-tight">
                  {text}
                </h3>
              );
            }
            return (
              <h2 key={block.id} className="text-2xl md:text-3xl font-bold text-[#17202A] tracking-tight">
                {text}
              </h2>
            );
          }

          case 'paragraph':
            return (
              <p key={block.id} className="text-base text-[#17202A] leading-relaxed">
                {text}
              </p>
            );

          case 'rich_text': {
            const cleanHtml = sanitizeRichTextHtml(html || '');
            return (
              <div
                key={block.id}
                className="text-base text-[#17202A] leading-relaxed prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            );
          }

          case 'cta': {
            const isPrimary = variant !== 'outline' && variant !== 'secondary';
            return (
              <div key={block.id} className="pt-2">
                <Link
                  href={href}
                  className={`inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isPrimary
                      ? 'bg-[#124A57] text-white hover:bg-[#0E3B46] shadow-sm'
                      : 'bg-white border border-[#CBD5E1] text-[#17202A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {label}
                </Link>
              </div>
            );
          }

          case 'link':
            return (
              <div key={block.id}>
                <Link
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="text-sm font-semibold text-[#124A57] hover:underline"
                >
                  {text}
                </Link>
              </div>
            );

          case 'feature':
            return (
              <div key={block.id} className="p-5 bg-white border border-[#E5E7EB] rounded-card space-y-2">
                <h3 className="font-semibold text-base text-[#17202A]">{title}</h3>
                <p className="text-sm text-[#667085]">{description}</p>
              </div>
            );

          case 'faq':
            return (
              <div key={block.id} className="p-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg space-y-1.5">
                <h4 className="font-semibold text-sm text-[#17202A]">{question}</h4>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{answer}</p>
              </div>
            );

          case 'image':
            return (
              <div key={block.id} className="space-y-1.5 pt-2">
                <img
                  src={src}
                  alt={alt}
                  className="rounded-card border border-[#E5E7EB] max-w-full h-auto"
                />
                {caption && (
                  <p className="text-xs text-[#64748B] italic">{caption}</p>
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
