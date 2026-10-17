import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin/guard';
import { hasPermission } from '@/lib/admin/permissions';
import { getGlobalSettings, updateGlobalSettings } from '@/lib/admin/services/settings.service';

export async function GET(req: NextRequest) {
  const auth = await requireAdminAuth(req, 'VIEW_CMS');
  if (auth.errorResponse) return auth.errorResponse;

  const settings = await getGlobalSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdminAuth(req);
  if (auth.errorResponse) return auth.errorResponse;

  // Enforce that user must have either MANAGE_SETTINGS or EDIT_CONTENT permission
  if (
    !hasPermission(auth.user.role, 'MANAGE_SETTINGS') &&
    !hasPermission(auth.user.role, 'EDIT_CONTENT')
  ) {
    return NextResponse.json(
      {
        error: `Forbidden: Role '${auth.user.role}' does not have permission to update shared site settings.`,
        failureType: 'forbidden',
      },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const updated = await updateGlobalSettings(body, auth.user);
    return NextResponse.json({ settings: updated, success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update settings.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
