import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { getPageById, getPageBySlug, updateDraftPage, deletePage } from '@/lib/admin/services/page.service';
import { handleAdminApiError } from '@/lib/admin/api-error';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'VIEW_CMS');
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  let page = await getPageById(id);
  if (!page && (id === 'home' || id === 'page-home')) {
    page = await getPageBySlug('home');
  }

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json({ page });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'EDIT_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  try {
    const body = await req.json();
    let targetId = id;
    let existing = await getPageById(id);
    if (!existing && (id === 'home' || id === 'page-home')) {
      existing = await getPageBySlug('home');
      if (existing) targetId = existing.id;
    }

    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const updated = await updateDraftPage(targetId, body, auth.user);
    return NextResponse.json({ page: updated });
  } catch (err: unknown) {
    return handleAdminApiError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'EDIT_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  try {
    let targetId = id;
    let existing = await getPageById(id);
    if (!existing && (id === 'home' || id === 'page-home')) {
      existing = await getPageBySlug('home');
      if (existing) targetId = existing.id;
    }

    if (!existing) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const result = await deletePage(targetId, auth.user);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return handleAdminApiError(err);
  }
}

