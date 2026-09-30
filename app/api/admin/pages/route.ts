import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { getPages, createDraftPage } from '@/lib/admin/services/page.service';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'VIEW_CMS');
  if (auth.errorResponse) return auth.errorResponse;

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status') as 'DRAFT' | 'PUBLISHED' | null;

  const pages = await getPages({ status: statusParam || undefined });
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'EDIT_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const page = await createDraftPage(body, auth.user);
    return NextResponse.json({ page }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create page.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
