import { getDb } from '@/lib/db';
import { getToolBySlug, getAllTools, ToolDefinition } from '@/lib/tools';
import { UpdateToolContentInput, AdminUserSession } from '../types';
import { createAuditLog } from './audit.service';

export async function getMergedTool(slug: string): Promise<ToolDefinition | null> {
  const canonical = getToolBySlug(slug);
  if (!canonical) return null;

  try {
    const db = getDb();
    const override = await db.toolContent.findUnique({
      where: { toolSlug: slug },
      include: { seo: true },
    });

    if (!override || !override.isPublished) {
      return canonical;
    }

    // Overlay CMS overrides
    return {
      ...canonical,
      title: override.seo?.seoTitle || override.customTitle || canonical.title,
      description: override.seo?.metaDescription || override.customDescription || canonical.description,
      h1: override.customH1 || canonical.h1,
      intro: override.customIntro || canonical.intro,
      valueProposition: override.customValueProp || canonical.valueProposition,
      howTo: override.customHowTo ? (override.customHowTo as any) : canonical.howTo,
      features: override.customFeatures ? (override.customFeatures as any) : canonical.features,
      faq: override.customFaq ? (override.customFaq as any) : canonical.faq,
    };
  } catch {
    return canonical;
  }
}

export async function getAllToolContents() {
  const db = getDb();
  return db.toolContent.findMany({
    include: { seo: true },
  });
}

export async function getToolContentBySlug(slug: string) {
  const canonical = getToolBySlug(slug);
  if (!canonical) return null;

  const db = getDb();
  const override = await db.toolContent.findUnique({
    where: { toolSlug: slug },
    include: { seo: true },
  });

  return {
    canonical,
    override: override || null,
  };
}

export async function upsertToolContent(
  slug: string,
  input: UpdateToolContentInput,
  author: AdminUserSession
) {
  const canonical = getToolBySlug(slug);
  if (!canonical) {
    throw new Error(`Tool with slug '${slug}' not found in canonical tool registry.`);
  }

  const db = getDb();
  const updated = await db.toolContent.upsert({
    where: { toolSlug: slug },
    create: {
      toolSlug: slug,
      customTitle: input.customTitle,
      customH1: input.customH1,
      customDescription: input.customDescription,
      customIntro: input.customIntro,
      customValueProp: input.customValueProp,
      customHowTo: input.customHowTo,
      customFeatures: input.customFeatures,
      customFaq: input.customFaq,
      isPublished: input.isPublished !== undefined ? input.isPublished : false,
      seo: input.seo
        ? {
            create: {
              seoTitle: input.seo.seoTitle,
              metaDescription: input.seo.metaDescription,
              canonicalUrl: input.seo.canonicalUrl,
              robotsIndex: input.seo.robotsIndex !== false,
              robotsFollow: input.seo.robotsFollow !== false,
              ogTitle: input.seo.ogTitle,
              ogDescription: input.seo.ogDescription,
              ogImage: input.seo.ogImage,
              schemaType: input.seo.schemaType,
              schemaJson: (input.seo.schemaJson as any) ?? undefined,
              focusKeyword: input.seo.focusKeyword,
            },
          }
        : undefined,
    },
    update: {
      customTitle: input.customTitle,
      customH1: input.customH1,
      customDescription: input.customDescription,
      customIntro: input.customIntro,
      customValueProp: input.customValueProp,
      customHowTo: input.customHowTo,
      customFeatures: input.customFeatures,
      customFaq: input.customFaq,
      isPublished: input.isPublished !== undefined ? input.isPublished : undefined,
      seo: input.seo
        ? {
            upsert: {
              create: {
                seoTitle: input.seo.seoTitle,
                metaDescription: input.seo.metaDescription,
                canonicalUrl: input.seo.canonicalUrl,
                robotsIndex: input.seo.robotsIndex !== false,
                robotsFollow: input.seo.robotsFollow !== false,
                ogTitle: input.seo.ogTitle,
                ogDescription: input.seo.ogDescription,
                ogImage: input.seo.ogImage,
                schemaType: input.seo.schemaType,
                schemaJson: (input.seo.schemaJson as any) ?? undefined,
                focusKeyword: input.seo.focusKeyword,
              },
              update: {
                seoTitle: input.seo.seoTitle,
                metaDescription: input.seo.metaDescription,
                canonicalUrl: input.seo.canonicalUrl,
                robotsIndex: input.seo.robotsIndex !== false,
                robotsFollow: input.seo.robotsFollow !== false,
                ogTitle: input.seo.ogTitle,
                ogDescription: input.seo.ogDescription,
                ogImage: input.seo.ogImage,
                schemaType: input.seo.schemaType,
                schemaJson: (input.seo.schemaJson as any) ?? undefined,
                focusKeyword: input.seo.focusKeyword,
              },
            },
          }
        : undefined,
    },
    include: { seo: true },
  });

  await createAuditLog({
    userId: author.id,
    action: 'UPDATE_TOOL_CONTENT',
    entityType: 'TOOL',
    entityId: slug,
    metadata: { toolSlug: slug, isPublished: updated.isPublished },
  });

  return updated;
}
