import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import ToolPage from '@/components/tool/ToolPage';
import { siteConfig } from '@/lib/seo';

interface ToolRouteProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
      description: 'The requested conversion tool could not be found.',
    };
  }

  const canonicalUrl = `${siteConfig.url}/tools/${tool.slug}`;

  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.title,
      description: tool.description,
    },
  };
}

export default async function DynamicToolPage({ params }: ToolRouteProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return <ToolPage tool={tool} />;
}

