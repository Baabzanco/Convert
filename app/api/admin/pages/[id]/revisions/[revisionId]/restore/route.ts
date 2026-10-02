import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { restorePageRevision } from '@/lib/admin/services/page.service';

interface RouteParams {
  params: Promise<{ id: string; revisionId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'EDIT_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  const { id, revisionId } = await params;
  try {
    const updated = await restorePageRevision(id, revisionId, auth.user);
    return NextResponse.json({ page: updated, message: 'Revision restored successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to restore revision';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
