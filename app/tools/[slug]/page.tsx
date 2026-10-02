import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import ToolPage from '@/components/tool/ToolPage';
import { siteConfig } from '@/lib/seo';
import { getPublishedTool, buildToolMetadata, getToolJsonLd } from '@/lib/cms/tool-resolver';
import JsonLd from '@/components/seo/JsonLd';

interface ToolRouteProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  const defaultMeta: Metadata = {
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

  return buildToolMetadata(slug, defaultMeta);
}

export default async function DynamicToolPage({ params }: ToolRouteProps) {
  const { slug } = await params;
  const tool = await getPublishedTool(slug);

  if (!tool) {
    notFound();
  }

  const jsonLd = await getToolJsonLd(slug);

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <ToolPage tool={tool} />
    </>
  );
}
