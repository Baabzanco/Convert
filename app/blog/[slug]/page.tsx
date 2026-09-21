import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import AdSlot from '@/components/ads/AdSlot';
import { getAllArticles, getArticleBySlug } from '@/content/blog/articles';
import JsonLd from '@/components/seo/JsonLd';
import { createArticleSchema, createBreadcrumbSchema, siteConfig } from '@/lib/seo';

interface BlogArticleProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: BlogArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested guide could not be found.',
    };
  }

  return {
    title: article.title,
    description: article.description,
  };
}

export default async function BlogPostPage({ params }: BlogArticleProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Blog', href: '/blog' },
    { name: article.title },
  ];

  const articleUrl = `${siteConfig.url}/blog/${article.slug}`;
  const articleSchema = createArticleSchema(
    article.title,
    article.description,
    articleUrl,
    article.publishedAt
  );
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Blog', url: `${siteConfig.url}/blog` },
    { name: article.title, url: articleUrl },
  ]);

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#667085] pt-2 border-b border-[#E5E7EB] pb-4">
                <span>By {article.author}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>{article.readingTime}</span>
                </span>
              </div>
            </header>

            <AdSlot slotId={`blog-top-${article.slug}`} />

            <div className="prose prose-slate max-w-none space-y-6 text-[#17202A] leading-relaxed text-base md:text-lg">
              {article.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <AdSlot slotId={`blog-bottom-${article.slug}`} className="mt-12" />

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
