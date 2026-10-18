import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { getPostById, updateDraft, deletePost } from '@/lib/admin/services/blog.service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'VIEW_CMS');
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) {
    return NextResponse.json({ error: `Blog post '${id}' not found.` }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'EDIT_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await updateDraft(id, body, auth.user);
    return NextResponse.json({ post: updated, success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update blog post.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminAuth(req, 'EDIT_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  const { id } = await params;
  try {
    await deletePost(id, auth.user);
    return NextResponse.json({ success: true, message: `Blog post '${id}' deleted.` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete blog post.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
