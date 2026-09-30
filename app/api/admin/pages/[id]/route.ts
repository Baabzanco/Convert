import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { getPageById, updateDraftPage } from '@/lib/admin/services/page.service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'VIEW_CMS');
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  const page = await getPageById(id);
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
    const updated = await updateDraftPage(id, body, auth.user);
    return NextResponse.json({ page: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update page.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
