import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { restoreRevision } from '@/lib/admin/services/blog.service';

interface RouteParams {
  params: Promise<{ id: string; revisionId: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'EDIT_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  const { id, revisionId } = await params;
  try {
    const post = await restoreRevision(id, revisionId, auth.user);
    return NextResponse.json({ post, message: 'Revision restored successfully' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to restore revision';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
