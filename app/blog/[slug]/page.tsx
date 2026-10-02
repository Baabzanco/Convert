import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Folder, Tag as TagIcon } from 'lucide-react';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import AdSlot from '@/components/ads/AdSlot';
import { getAllArticles } from '@/content/blog/articles';
import JsonLd from '@/components/seo/JsonLd';
import { getPublishedPostBySlug, buildBlogPostMetadata, getBlogPostJsonLd } from '@/lib/cms/blog-resolver';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface BlogArticleProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  return buildBlogPostMetadata(decodedSlug, {
    title: 'Article Not Found',
    description: 'The requested guide could not be found.',
  });
}

export default async function BlogPostPage({ params }: BlogArticleProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const post = await getPublishedPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  const jsonLd = await getBlogPostJsonLd(slug);

  const breadcrumbs = [
    { name: 'Blog', href: '/blog' },
    { name: post.title },
  ];

  const authorName = post.author?.name || 'FileTools Team';
  const displayDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Published';

  // Format paragraphs from markdown/text
  const rawParagraphs = post.content ? post.content.split(/\n\s*\n/) : [];

  return (
    <>
      {jsonLd && (
        <>
          <JsonLd data={jsonLd.articleSchema} />
          <JsonLd data={jsonLd.breadcrumbSchema} />
        </>
      )}

      <article className="py-8 md:py-12">
        <Container>
          <Breadcrumbs items={breadcrumbs} />

          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-xs font-semibold text-[#124A57] hover:underline mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              <span>Back to all guides</span>
            </Link>

            <header className="space-y-4 mb-8">
              {post.category && (
                <div className="mb-2">
                  <Link
                    href={`/blog?category=${post.category.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#F0F7F8] text-[#124A57] hover:bg-[#E0F0F2]"
                  >
                    <Folder className="w-3.5 h-3.5" />
                    <span>{post.category.name}</span>
                  </Link>
                </div>
              )}

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg text-[#475569] leading-relaxed font-normal">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#667085] pt-2 border-b border-[#E5E7EB] pb-4">
                <span>By {authorName}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <time dateTime={post.publishedAt || undefined}>{displayDate}</time>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>{post.readingTime}</span>
                </span>
              </div>
            </header>

            {post.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F8FAFC]">
                <img
                  src={post.featuredImage}
                  alt={post.featuredImageAlt || post.title}
                  className="w-full h-auto object-cover max-h-[480px]"
                />
              </div>
            )}

            <AdSlot slotId={`blog-top-${post.slug}`} />

            <div className="prose prose-slate max-w-none space-y-6 text-[#17202A] leading-relaxed text-base md:text-lg">
              {rawParagraphs.map((block, idx) => {
                const trimmed = block.trim();
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-xl font-bold mt-6 mb-2 text-[#17202A]">
                      {trimmed.replace(/^###\s+/, '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-2xl font-bold mt-8 mb-3 text-[#17202A]">
                      {trimmed.replace(/^##\s+/, '')}
                    </h2>
                  );
                }
                if (trimmed.startsWith('# ')) {
                  return (
                    <h1 key={idx} className="text-3xl font-bold mt-8 mb-4 text-[#17202A]">
                      {trimmed.replace(/^#\s+/, '')}
                    </h1>
                  );
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  const items = trimmed
                    .split('\n')
                    .map((l) => l.trim())
                    .filter((l) => l.startsWith('- ') || l.startsWith('* '));
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-1.5 text-[#334155]">
                      {items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item.replace(/^[-*]\s+/, '')}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{block}</p>;
              })}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
                  <TagIcon className="w-3.5 h-3.5" /> Tags:
                </span>
                {post.tags.map((pt) =>
                  pt.tag ? (
                    <Link
                      key={pt.tagId}
                      href={`/blog?tag=${pt.tag.slug}`}
                      className="text-xs px-2.5 py-1 rounded bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] font-medium"
                    >
                      #{pt.tag.name}
                    </Link>
                  ) : null
                )}
              </div>
            )}

            <AdSlot slotId={`blog-bottom-${post.slug}`} className="mt-12" />

            <div className="mt-12 pt-6 border-t border-[#E5E7EB] flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center text-sm font-semibold text-[#124A57] hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
                <span>Return to Blog Overview</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center text-sm font-semibold text-[#124A57] hover:underline"
              >
                <span>Browse All Tools</span>
              </Link>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
