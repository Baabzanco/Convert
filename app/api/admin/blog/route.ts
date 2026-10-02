import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { listPosts, createDraft } from '@/lib/admin/services/blog.service';
import { PostStatus } from '@/lib/admin/types';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'VIEW_CMS');
  if (auth.errorResponse) return auth.errorResponse;

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get('status') as PostStatus) || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const tagId = searchParams.get('tagId') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const result = await listPosts({
    status,
    categoryId,
    tagId,
    search,
    page,
    limit,
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'EDIT_CONTENT');
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const post = await createDraft(body, auth.user);
    return NextResponse.json({ post, success: true }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create blog post draft.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
