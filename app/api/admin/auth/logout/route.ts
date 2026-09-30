import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/admin/guard';
import { logoutAdmin } from '@/lib/admin/services/auth.service';
import { ADMIN_COOKIE_NAME } from '@/lib/admin/session';

export async function POST(req: NextRequest) {
  const user = await getAuthenticatedAdmin(req);
  if (user) {
    await logoutAdmin(user);
  }

  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully.',
  });

  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
