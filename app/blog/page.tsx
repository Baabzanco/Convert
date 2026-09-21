import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { getAllArticles } from '@/content/blog/articles';

export const metadata: Metadata = {
  title: 'Guides & Tutorials – File Conversion, Compression & Format Tips',
  description: 'In-depth guides on image compression, PDF management, file format optimization, and client-side browser performance.',
};

export default function BlogIndexPage() {
  const articles = getAllArticles();

  return (
    <div className="py-8 md:py-12 space-y-8">
      <Container>
        <Breadcrumbs items={[{ name: 'Blog' }]} />

        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#F0F7F8] text-[#124A57] mb-3">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Articles & Insights</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight mb-3">
            Guides & Best Practices
          </h1>
          <p className="text-base md:text-lg text-[#667085] leading-relaxed">
            Technical guides, format deep dives, and practical advice on optimizing images and managing digital documents effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="flex flex-col justify-between p-6 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card hover:border-[#124A57]/40 hover:shadow-subtle transition-all"
            >
              <div>
                <div className="flex items-center gap-4 text-xs text-[#667085] mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                    <time dateTime={article.publishedAt}>{article.publishedAt}</time>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{article.readingTime}</span>
                  </span>
                </div>

                <h2 className="text-xl font-bold text-[#17202A] hover:text-[#124A57] transition-colors mb-2">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="text-sm text-[#667085] leading-relaxed line-clamp-3 mb-6">
                  {article.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB]/60 flex items-center justify-between">
                <span className="text-xs text-[#667085]">{article.author}</span>
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center text-xs font-semibold text-[#124A57] hover:underline"
                >
                  <span>Read article</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </div>
  );
}
