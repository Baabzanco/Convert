import { getDb } from '@/lib/db';
import { CreatePageInput, UpdatePageInput, AdminUserSession } from '../types';
import { createAuditLog } from './audit.service';

export async function getPages(options?: { status?: 'DRAFT' | 'PUBLISHED' }) {
  const db = getDb();
  return db.page.findMany({
    where: options?.status ? { status: options.status } : undefined,
    include: {
      seo: true,
      content: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getPageById(id: string) {
  const db = getDb();
  return db.page.findUnique({
    where: { id },
    include: {
      content: true,
      seo: true,
    },
  });
}

export async function getPageBySlug(slug: string, publishedOnly = false) {
  const db = getDb();
  const page = await db.page.findUnique({
    where: { slug },
    include: {
      content: true,
      seo: true,
    },
  });

  if (!page) return null;
  if (publishedOnly && page.status !== 'PUBLISHED') return null;
  return page;
}

export async function createDraftPage(input: CreatePageInput, author: AdminUserSession) {
  const db = getDb();
  const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

  const existing = await db.page.findUnique({
    where: { slug: cleanSlug },
  });
  if (existing) {
    throw new Error(`A page with slug '${cleanSlug}' already exists.`);
  }

  const page = await db.page.create({
    data: {
      slug: cleanSlug,
      name: input.name.trim(),
      status: input.status || 'DRAFT',
      content: {
        create: {
          version: 1,
          isPublished: input.status === 'PUBLISHED',
          blocks: (input.blocks || []) as any,
          customCss: input.customCss || null,
        },
      },
      seo: {
        create: {
          seoTitle: input.seo?.seoTitle || null,
          metaDescription: input.seo?.metaDescription || null,
          canonicalUrl: input.seo?.canonicalUrl || null,
          robotsIndex: input.seo?.robotsIndex !== false,
          robotsFollow: input.seo?.robotsFollow !== false,
          ogTitle: input.seo?.ogTitle || null,
          ogDescription: input.seo?.ogDescription || null,
          ogImage: input.seo?.ogImage || null,
          twitterTitle: input.seo?.twitterTitle || null,
          twitterDescription: input.seo?.twitterDescription || null,
          twitterImage: input.seo?.twitterImage || null,
          schemaType: input.seo?.schemaType || null,
          schemaJson: (input.seo?.schemaJson as any) ?? undefined,
          focusKeyword: input.seo?.focusKeyword || null,
        },
      },
    },
    include: {
      content: true,
      seo: true,
    },
  });

  // Create initial revision
  await db.pageRevision.create({
    data: {
      pageId: page.id,
      contentSnapshot: page.content ? { blocks: page.content.blocks, customCss: page.content.customCss } : {},
      seoSnapshot: page.seo ? { ...page.seo } : null,
      authorId: author.id,
      reason: 'Initial creation',
    },
  });

  await createAuditLog({
    userId: author.id,
    action: 'CREATE_PAGE',
    entityType: 'PAGE',
    entityId: page.id,
    metadata: { slug: page.slug, name: page.name },
  });

  return page;
}

export async function updateDraftPage(
  id: string,
  input: UpdatePageInput,
  author: AdminUserSession
) {
  const db = getDb();
  const existing = await db.page.findUnique({
    where: { id },
    include: { content: true, seo: true },
  });

  if (!existing) {
    throw new Error(`Page not found: ${id}`);
  }

  // Update Page details
  const updateData: any = {};
  if (input.name) updateData.name = input.name.trim();
  if (input.slug) {
    const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    if (cleanSlug !== existing.slug) {
      const clash = await db.page.findUnique({ where: { slug: cleanSlug } });
      if (clash && clash.id !== id) {
        throw new Error(`A page with slug '${cleanSlug}' already exists.`);
      }
      updateData.slug = cleanSlug;
    }
  }

  const updatedPage = await db.page.update({
    where: { id },
    data: updateData,
  });

  // Update content if provided
  if (input.blocks || input.customCss !== undefined) {
    await db.pageContent.update({
      where: { pageId: id },
      data: {
        blocks: (input.blocks !== undefined ? input.blocks : existing.content?.blocks || []) as any,
        customCss: input.customCss !== undefined ? input.customCss : existing.content?.customCss || null,
        version: (existing.content?.version || 1) + 1,
      },
    });
  }

  // Update SEO if provided
  if (input.seo) {
    await db.pageSeo.update({
      where: { pageId: id },
      data: {
        seoTitle: input.seo.seoTitle,
        metaDescription: input.seo.metaDescription,
        canonicalUrl: input.seo.canonicalUrl,
        robotsIndex: input.seo.robotsIndex !== false,
        robotsFollow: input.seo.robotsFollow !== false,
        ogTitle: input.seo.ogTitle,
        ogDescription: input.seo.ogDescription,
        ogImage: input.seo.ogImage,
        twitterTitle: input.seo.twitterTitle,
        twitterDescription: input.seo.twitterDescription,
        twitterImage: input.seo.twitterImage,
        schemaType: input.seo.schemaType,
        schemaJson: (input.seo.schemaJson as any) ?? undefined,
        focusKeyword: input.seo.focusKeyword,
      },
    });
  }

  const fullPage = await getPageById(id);

  // Snapshot revision
  await db.pageRevision.create({
    data: {
      pageId: id,
      contentSnapshot: fullPage?.content ? { blocks: fullPage.content.blocks, customCss: fullPage.content.customCss } : {},
      seoSnapshot: fullPage?.seo ? { ...fullPage.seo } : null,
      authorId: author.id,
      reason: input.reason || 'Content update',
    },
  });

  await createAuditLog({
    userId: author.id,
    action: 'UPDATE_PAGE',
    entityType: 'PAGE',
    entityId: id,
    metadata: { slug: fullPage?.slug, reason: input.reason },
  });

  return fullPage;
}

export async function publishPage(id: string, author: AdminUserSession) {
  const db = getDb();
  const page = await db.page.findUnique({
    where: { id },
    include: { content: true, seo: true },
  });

  if (!page) {
    throw new Error(`Page not found: ${id}`);
  }

  const updated = await db.page.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
    include: { content: true, seo: true },
  });

  if (page.content) {
    await db.pageContent.update({
      where: { pageId: id },
      data: { isPublished: true },
    });
  }

  await db.pageRevision.create({
    data: {
      pageId: id,
      contentSnapshot: updated.content ? { blocks: updated.content.blocks } : {},
      seoSnapshot: updated.seo ? { ...updated.seo } : null,
      authorId: author.id,
      reason: 'Published page',
    },
  });

  await createAuditLog({
    userId: author.id,
    action: 'PUBLISH_PAGE',
    entityType: 'PAGE',
    entityId: id,
    metadata: { slug: updated.slug },
  });

  return updated;
}

export async function unpublishPage(id: string, author: AdminUserSession) {
  const db = getDb();
  const page = await db.page.findUnique({ where: { id } });
  if (!page) throw new Error(`Page not found: ${id}`);

  const updated = await db.page.update({
    where: { id },
    data: {
      status: 'DRAFT',
    },
    include: { content: true, seo: true },
  });

  if (updated.content) {
    await db.pageContent.update({
      where: { pageId: id },
      data: { isPublished: false },
    });
  }

  await createAuditLog({
    userId: author.id,
    action: 'UNPUBLISH_PAGE',
    entityType: 'PAGE',
    entityId: id,
    metadata: { slug: updated.slug },
  });

  return updated;
}

export async function getPageRevisions(pageId: string) {
  const db = getDb();
  return db.pageRevision.findMany({
    where: { pageId },
    orderBy: { createdAt: 'desc' },
  });
}
