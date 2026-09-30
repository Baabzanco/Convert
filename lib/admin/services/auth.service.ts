import { getDb } from '@/lib/db';
import { verifyPassword } from '../crypto';
import { createSessionToken } from '../session';
import { createAuditLog } from './audit.service';
import { AdminUserSession } from '../types';

export interface LoginResult {
  user: AdminUserSession;
  token: string;
}

export async function loginAdmin(credentials: {
  email?: string;
  password?: string;
}): Promise<LoginResult> {
  const email = credentials.email?.trim().toLowerCase();
  const password = credentials.password;

  if (!email || !password) {
    throw new Error('Please enter both email and password.');
  }

  const db = getDb();
  const user = await db.adminUser.findUnique({
    where: { email },
  });

  if (!user) {
    await createAuditLog({
      action: 'LOGIN_FAILED',
      entityType: 'AUTH',
      metadata: { email, reason: 'user_not_found' },
    });
    throw new Error('Invalid email or password.');
  }

  if (!user.isActive) {
    await createAuditLog({
      userId: user.id,
      action: 'LOGIN_BLOCKED',
      entityType: 'AUTH',
      metadata: { email, reason: 'inactive_account' },
    });
    throw new Error('Your administrative account has been deactivated. Please contact a super administrator.');
  }

  const isMatch = await verifyPassword(password, user.passwordHash);
  if (!isMatch) {
    await createAuditLog({
      userId: user.id,
      action: 'LOGIN_FAILED',
      entityType: 'AUTH',
      metadata: { email, reason: 'incorrect_password' },
    });
    throw new Error('Invalid email or password.');
  }

  // Update lastLoginAt
  await db.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const sessionUser: AdminUserSession = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as AdminUserSession['role'],
  };

  const token = await createSessionToken(sessionUser);

  await createAuditLog({
    userId: user.id,
    action: 'LOGIN',
    entityType: 'AUTH',
    entityId: user.id,
    metadata: { email: user.email, role: user.role },
  });

  return {
    user: sessionUser,
    token,
  };
}

export async function logoutAdmin(user: AdminUserSession): Promise<void> {
  await createAuditLog({
    userId: user.id,
    action: 'LOGOUT',
    entityType: 'AUTH',
    entityId: user.id,
    metadata: { email: user.email },
  });
}

export async function getAdminProfile(userId: string) {
  const db = getDb();
  const user = await db.adminUser.findUnique({
    where: { id: userId },
  });
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}
