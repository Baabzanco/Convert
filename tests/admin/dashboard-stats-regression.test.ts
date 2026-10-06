import { describe, it, expect, beforeEach } from 'vitest';
import { getDashboardStats } from '@/lib/admin/services/dashboard.service';
import { getAuthenticatedAdmin, requireAdminAuth } from '@/lib/admin/guard';
import { createSessionToken, verifySessionToken } from '@/lib/admin/session';
import { getDb, resetMemoryDb } from '@/lib/db';
import { NextRequest } from 'next/server';

describe('Admin CMS — VPS Session & Dashboard Statistics Regression Tests', () => {
  beforeEach(() => {
    resetMemoryDb();
  });

  describe('1. Dashboard Statistics Resilience', () => {
    it('returns complete dashboard statistics with resilient metrics', async () => {
      const stats = await getDashboardStats();

      expect(stats).toBeDefined();
      expect(typeof stats.totalAdminUsers).toBe('number');
      expect(typeof stats.publishedPages).toBe('number');
      expect(typeof stats.draftPages).toBe('number');
      expect(typeof stats.totalPages).toBe('number');
      expect(typeof stats.totalTools).toBe('number');
      expect(typeof stats.customizedTools).toBe('number');
      expect(Array.isArray(stats.recentAuditLogs)).toBe(true);
      expect(['connected', 'fallback_memory']).toContain(stats.databaseStatus);
    });

    it('returns available total tools matching canonical count (25)', async () => {
      const stats = await getDashboardStats();
      expect(stats.totalTools).toBe(25);
    });
  });

  describe('2. Admin Authentication & Guard Behavior', () => {
    it('authenticates valid session token from cookie correctly', async () => {
      const sessionUser = {
        id: 'admin-super-01',
        email: 'admin@filetools.local',
        name: 'System Administrator',
        role: 'SUPER_ADMIN' as const,
      };

      const token = await createSessionToken(sessionUser);
      const req = new NextRequest('http://localhost:3000/api/admin/dashboard', {
        headers: {
          cookie: `admin_session=${token}`,
        },
      });

      const user = await getAuthenticatedAdmin(req);
      expect(user).not.toBeNull();
      expect(user?.email).toBe('admin@filetools.local');
      expect(user?.role).toBe('SUPER_ADMIN');
    });

    it('authenticates valid session token from Authorization header (Bearer)', async () => {
      const sessionUser = {
        id: 'admin-super-01',
        email: 'admin@filetools.local',
        name: 'System Administrator',
        role: 'SUPER_ADMIN' as const,
      };

      const token = await createSessionToken(sessionUser);
      const req = new NextRequest('http://localhost:3000/api/admin/dashboard', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const user = await getAuthenticatedAdmin(req);
      expect(user).not.toBeNull();
      expect(user?.email).toBe('admin@filetools.local');
    });

    it('returns 401 when no token is present', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/dashboard');
      const result = await requireAdminAuth(req, 'VIEW_CMS');

      expect(result.errorResponse).toBeDefined();
      expect(result.errorResponse?.status).toBe(401);
    });

    it('returns 403 when user does not have required permission', async () => {
      const sessionUser = {
        id: 'user-viewer-01',
        email: 'viewer@filetools.local',
        name: 'Viewer User',
        role: 'VIEWER' as const,
      };

      const token = await createSessionToken(sessionUser);
      const req = new NextRequest('http://localhost:3000/api/admin/users', {
        headers: {
          cookie: `admin_session=${token}`,
        },
      });

      // VIEWER does not have MANAGE_USERS permission
      const result = await requireAdminAuth(req, 'MANAGE_USERS');
      expect(result.errorResponse).toBeDefined();
      expect(result.errorResponse?.status).toBe(403);
    });

    it('strictly blocks deactivated users even with a valid signed token', async () => {
      const db = getDb();
      const deactivatedUser = await db.adminUser.create({
        data: {
          email: 'deactivated-admin@filetools.local',
          passwordHash: 'dummy-hash',
          name: 'Deactivated Admin',
          role: 'ADMIN',
          isActive: false,
        },
      });

      const token = await createSessionToken({
        id: deactivatedUser.id,
        email: deactivatedUser.email,
        name: deactivatedUser.name,
        role: deactivatedUser.role as any,
      });

      const req = new NextRequest('http://localhost:3000/api/admin/dashboard', {
        headers: {
          cookie: `admin_session=${token}`,
        },
      });

      const user = await getAuthenticatedAdmin(req);
      expect(user).toBeNull();

      const result = await requireAdminAuth(req, 'VIEW_CMS');
      expect(result.errorResponse?.status).toBe(401);
    });

    it('allows cryptographically valid session when database user record was recreated', async () => {
      const sessionUser = {
        id: 'cuid-recreated-999',
        email: 'superadmin-persisted@filetools.local',
        name: 'Super Admin',
        role: 'SUPER_ADMIN' as const,
      };

      const token = await createSessionToken(sessionUser);
      const req = new NextRequest('http://localhost:3000/api/admin/dashboard', {
        headers: {
          cookie: `admin_session=${token}`,
        },
      });

      const user = await getAuthenticatedAdmin(req);
      expect(user).not.toBeNull();
      expect(user?.email).toBe('superadmin-persisted@filetools.local');
      expect(user?.role).toBe('SUPER_ADMIN');
    });
  });

  describe('3. Session Token Verification', () => {
    it('correctly signs and verifies claims', async () => {
      const payload = {
        id: 'adm-123',
        email: 'ops@filetools.local',
        name: 'Operations Admin',
        role: 'ADMIN' as const,
      };

      const token = await createSessionToken(payload);
      const verified = await verifySessionToken(token);

      expect(verified).not.toBeNull();
      expect(verified?.id).toBe('adm-123');
      expect(verified?.email).toBe('ops@filetools.local');
      expect(verified?.role).toBe('ADMIN');
    });

    it('rejects tampered or forged JWT tokens', async () => {
      const token = await createSessionToken({
        id: 'adm-123',
        email: 'ops@filetools.local',
        name: 'Operations Admin',
        role: 'ADMIN' as const,
      });

      const parts = token.split('.');
      // Tamper payload
      const tampered = `${parts[0]}.eyJhZG1pbiI6dHJ1ZX0.${parts[2]}`;
      const verified = await verifySessionToken(tampered);

      expect(verified).toBeNull();
    });
  });
});
