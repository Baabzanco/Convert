import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/lib/admin/services/auth.service';
import { ADMIN_COOKIE_NAME, sessionCookieOptions } from '@/lib/admin/session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const { user, token } = await loginAdmin({ email, password });

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set({
      ...sessionCookieOptions,
      value: token,
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Login failed.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
