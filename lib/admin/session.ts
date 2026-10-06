import { SignJWT, jwtVerify } from 'jose';
import { AdminUserSession } from './types';

export const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'admin_session';
const SESSION_DURATION_SECONDS = 8 * 60 * 60; // 8 hours

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET || 'fallback-dev-secret-only-for-local-testing-min-32-chars';
  return new TextEncoder().encode(secret);
}

/**
 * Creates and signs an admin session token.
 */
export async function createSessionToken(user: AdminUserSession): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

/**
 * Verifies an admin session token and returns the authenticated user payload.
 */
export async function verifySessionToken(token: string): Promise<AdminUserSession | null> {
  if (!token) return null;
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || !payload.email || !payload.role) {
      return null;
    }
    return {
      id: payload.sub,
      email: payload.email as string,
      name: (payload.name as string) || '',
      role: payload.role as AdminUserSession['role'],
    };
  } catch {
    return null;
  }
}

const isCookieSecure =
  process.env.COOKIE_SECURE === 'true' ||
  (process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false');

/**
 * Cookie options for the admin session.
 */
export const sessionCookieOptions = {
  name: ADMIN_COOKIE_NAME,
  httpOnly: true,
  secure: isCookieSecure,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_DURATION_SECONDS,
};
