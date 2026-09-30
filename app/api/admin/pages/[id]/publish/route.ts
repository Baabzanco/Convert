import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { publishPage, unpublishPage } from '@/lib/admin/services/page.service';

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

    const page =
      action === 'unpublish'
        ? await unpublishPage(id, auth.user)
        : await publishPage(id, auth.user);

    return NextResponse.json({ page });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Publish action failed.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
