import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminAuth } from '@/lib/admin/guard';
import { getPageById, getPageBySlug, publishPage, unpublishPage } from '@/lib/admin/services/page.service';
import { handleAdminApiError } from '@/lib/admin/api-error';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'PUBLISH_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'publish';

    let targetId = id;
    let existing = await getPageById(id);
    if (!existing && (id === 'home' || id === 'page-home')) {
      existing = await getPageBySlug('home');
      if (existing) targetId = existing.id;
    }

    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const page =
      action === 'unpublish'
        ? await unpublishPage(targetId, auth.user)
        : await publishPage(targetId, auth.user);

    // Invalidate Next.js route cache
    const targetPath = page.slug === 'home' ? '/' : `/${page.slug}`;
    try {
      revalidatePath(targetPath);
    } catch {
      // Safe no-op outside Next.js request context (e.g. test environment)
    }

    return NextResponse.json({ page });
  } catch (err: unknown) {
    return handleAdminApiError(err);
  }
}

