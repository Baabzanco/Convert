import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from './session';
import { hasPermission } from './permissions';
import { AdminPermission, AdminUserSession } from './types';
import { getDb } from '@/lib/db';

export async function getAuthenticatedAdmin(
  req: NextRequest
): Promise<AdminUserSession | null> {
  const cookie = req.cookies.get(ADMIN_COOKIE_NAME);
  let token = cookie?.value;

  if (!token) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return null;
  }

  // Verify that the user still exists and is active in the database
  try {
    const db = getDb();
    const user = await db.adminUser.findUnique({
      where: { id: session.id },
    });
    if (!user) {
      // Also try lookup by email if id differed between seeds/environments
      const userByEmail = await db.adminUser.findUnique({
        where: { email: session.email },
      });
      if (userByEmail) {
        if (!userByEmail.isActive) {
          return null;
        }
        return {
          id: userByEmail.id,
          email: userByEmail.email,
          name: userByEmail.name,
          role: userByEmail.role as AdminUserSession['role'],
        };
      }
      // If user is not found in database (e.g. database recreated/flushed),
      // allow the cryptographically verified JWT session payload
      return session;
    }

    if (!user.isActive) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as AdminUserSession['role'],
    };
  } catch {
    return session;
  }
}

export type AuthCheckResult =
  | { user: AdminUserSession; errorResponse?: never }
  | { user?: never; errorResponse: NextResponse };

export async function requireAdminAuth(
  req: NextRequest,
  requiredPermission?: AdminPermission
): Promise<AuthCheckResult> {
  const user = await getAuthenticatedAdmin(req);

  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Unauthorized: Authentication required to access administrative API.' },
        { status: 401 }
      ),
    };
  }

  if (requiredPermission && !hasPermission(user.role, requiredPermission)) {
    return {
      errorResponse: NextResponse.json(
        {
          error: `Forbidden: Role '${user.role}' does not have the '${requiredPermission}' permission.`,
        },
        { status: 403 }
      ),
    };
  }

  return { user };
}
