import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { getAllTools } from '@/lib/tools';
import { getAllToolContents } from '@/lib/admin/services/tool.service';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'VIEW_CMS');
  if (auth.errorResponse) return auth.errorResponse;

  const canonicalTools = getAllTools();
  const overrides = await getAllToolContents();
  const overridesBySlug = new Map(overrides.map((o: any) => [o.toolSlug, o]));

  const tools = canonicalTools.map((t) => {
    const override = overridesBySlug.get(t.slug);
    return {
      slug: t.slug,
      name: t.name,
      category: t.category,
      hasCmsOverride: Boolean(override),
      isPublished: override?.isPublished || false,
      customTitle: override?.customTitle || null,
      updatedAt: override?.updatedAt || null,
    };
  });

  return NextResponse.json({ tools });
}
