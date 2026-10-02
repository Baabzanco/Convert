import { getDb } from '@/lib/db';
import { CreatePageInput, UpdatePageInput, AdminUserSession } from '../types';
import { createAuditLog } from './audit.service';
import { validatePagePayload } from '../validation';

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
  const validation = validatePagePayload(input);
  if (!validation.isValid) {
    const errorDetails = validation.report.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${errorDetails}`);
  }

  const cleanSlug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

  const existing = await db.page.findUnique({
    where: { slug: cleanSlug },
  });
  if (existing) {
    throw new Error(`A page with slug '${cleanSlug}' already exists.`);
  }

  const sanitizedBlocks = validation.sanitizedBlocks.length > 0 ? validation.sanitizedBlocks : input.blocks || [];

  const page = await db.page.create({
    data: {
      slug: cleanSlug,
      name: input.name.trim(),
      status: input.status || 'DRAFT',
      content: {
        create: {
          version: 1,
          isPublished: input.status === 'PUBLISHED',
          blocks: sanitizedBlocks as any,
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
    action: 'PAGE_CREATED',
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

  const validation = validatePagePayload(input);
  if (!validation.isValid) {
    const errorDetails = validation.report.errors.map((e) => `${e.field}: ${e.message}`).join(', ');
    throw new Error(`Validation failed: ${errorDetails}`);
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
    const blocksToSave =
      input.blocks !== undefined
        ? validation.sanitizedBlocks.length > 0
          ? validation.sanitizedBlocks
          : input.blocks
        : existing.content?.blocks || [];

    await db.pageContent.update({
      where: { pageId: id },
      data: {
        blocks: blocksToSave as any,
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
    action: 'PAGE_UPDATED',
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
    action: 'PAGE_PUBLISHED',
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
    action: 'PAGE_UNPUBLISHED',
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

export async function getPageRevisionById(pageId: string, revisionId: string) {
  const db = getDb();
  const revision = await db.pageRevision.findUnique({
    where: { id: revisionId },
  });
  if (!revision || revision.pageId !== pageId) {
    return null;
  }
  return revision;
}

export async function restorePageRevision(
  pageId: string,
  revisionId: string,
  author: AdminUserSession
) {
  const db = getDb();
  const page = await db.page.findUnique({
    where: { id: pageId },
    include: { content: true, seo: true },
  });
  if (!page) throw new Error(`Page not found: ${pageId}`);

  const revision = await getPageRevisionById(pageId, revisionId);
  if (!revision) throw new Error(`Revision ${revisionId} not found for page ${pageId}`);

  // Restore content snapshot
  const contentSnapshot = (revision.contentSnapshot || {}) as Record<string, any>;
  const blocks = contentSnapshot.blocks || [];
  const customCss = contentSnapshot.customCss || null;

  await db.pageContent.update({
    where: { pageId },
    data: {
      blocks: blocks as any,
      customCss,
      version: (page.content?.version || 1) + 1,
    },
  });

  // Restore SEO snapshot if present
  if (revision.seoSnapshot) {
    const seoSnapshot = revision.seoSnapshot as Record<string, any>;
    await db.pageSeo.update({
      where: { pageId },
      data: {
        seoTitle: seoSnapshot.seoTitle ?? null,
        metaDescription: seoSnapshot.metaDescription ?? null,
        canonicalUrl: seoSnapshot.canonicalUrl ?? null,
        robotsIndex: seoSnapshot.robotsIndex !== false,
        robotsFollow: seoSnapshot.robotsFollow !== false,
        ogTitle: seoSnapshot.ogTitle ?? null,
        ogDescription: seoSnapshot.ogDescription ?? null,
        ogImage: seoSnapshot.ogImage ?? null,
        twitterTitle: seoSnapshot.twitterTitle ?? null,
        twitterDescription: seoSnapshot.twitterDescription ?? null,
        twitterImage: seoSnapshot.twitterImage ?? null,
        schemaType: seoSnapshot.schemaType ?? null,
        schemaJson: seoSnapshot.schemaJson ?? undefined,
        focusKeyword: seoSnapshot.focusKeyword ?? null,
      },
    });
  }

  // Create a brand new revision snapshot recording the restoration
  const newRevision = await db.pageRevision.create({
    data: {
      pageId,
      contentSnapshot: { blocks, customCss },
      seoSnapshot: revision.seoSnapshot,
      authorId: author.id,
      reason: `Restored from revision ${revisionId}`,
    },
  });

  await createAuditLog({
    userId: author.id,
    action: 'PAGE_REVISION_RESTORED',
    entityType: 'PAGE',
    entityId: pageId,
    metadata: {
      restoredRevisionId: revisionId,
      newRevisionId: newRevision.id,
      pageSlug: page.slug,
    },
  });

  return getPageById(pageId);
}

export async function previewDraftPage(id: string, author: AdminUserSession) {
  const page = await getPageById(id);
  if (!page) return null;

  await createAuditLog({
    userId: author.id,
    action: 'PAGE_PREVIEWED',
    entityType: 'PAGE',
    entityId: id,
    metadata: { slug: page.slug },
  });

  return page;
}

