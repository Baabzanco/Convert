import { prisma } from './prisma';
import type { Role, PageStatus } from '@prisma/client';

export const DEFAULT_ADMIN = {
  id: 'admin-super-01',
  email: 'admin@filetools.local',
  passwordHash: '$2b$12$EcWOLShVkkA4lZAFbx1LCeBdIZKb4cDOjK/cw6w0TWs9uh9SB70YC', // 'AdminPassword123!'
  name: 'System Administrator',
  role: 'SUPER_ADMIN' as Role,
  isActive: true,
  lastLoginAt: null as Date | null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
};

interface MemoryStorage {
  adminUsers: Map<string, any>;
  pages: Map<string, any>;
  pageContents: Map<string, any>;
  pageSeos: Map<string, any>;
  toolContents: Map<string, any>;
  toolSeos: Map<string, any>;
  pageRevisions: any[];
  auditLogs: any[];
  globalSettings: any;
}

const memoryStore: MemoryStorage = {
  adminUsers: new Map([
    [DEFAULT_ADMIN.id, { ...DEFAULT_ADMIN }],
  ]),
  pages: new Map(),
  pageContents: new Map(),
  pageSeos: new Map(),
  toolContents: new Map(),
  toolSeos: new Map(),
  pageRevisions: [],
  auditLogs: [],
  globalSettings: {
    id: 'default',
    siteName: 'Free Online File Tools',
    siteUrl: 'https://example.com',
    defaultSeoTitle: 'Free Online File Tools – Convert, Compress & Edit Files Free',
    defaultMetaDescription: 'Convert, compress and manage your files quickly and easily with 100% client-side privacy.',
    defaultOgImage: '/images/og-image.png',
    defaultTwitterImage: '/images/og-image.png',
    googleAnalyticsId: null,
    googleAdSenseId: null,
    socialLinks: {},
    updatedAt: new Date(),
  },
};

// Seed default initial pages into memory
const DEFAULT_PAGES = [
  { id: 'page-home', slug: 'home', name: 'Home Page', status: 'PUBLISHED' as PageStatus },
  { id: 'page-image-tools', slug: 'image-tools', name: 'Image Tools Directory', status: 'PUBLISHED' as PageStatus },
  { id: 'page-pdf-tools', slug: 'pdf-tools', name: 'PDF Tools Directory', status: 'PUBLISHED' as PageStatus },
  { id: 'page-about', slug: 'about', name: 'About Us', status: 'PUBLISHED' as PageStatus },
  { id: 'page-privacy', slug: 'privacy', name: 'Privacy Policy', status: 'PUBLISHED' as PageStatus },
  { id: 'page-terms', slug: 'terms', name: 'Terms of Service', status: 'PUBLISHED' as PageStatus },
  { id: 'page-contact', slug: 'contact', name: 'Contact Us', status: 'PUBLISHED' as PageStatus },
];

for (const p of DEFAULT_PAGES) {
  memoryStore.pages.set(p.id, {
    ...p,
    publishedAt: new Date('2026-01-01T00:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  });
}

function shouldUsePrisma(): boolean {
  return Boolean(process.env.DATABASE_URL && !process.env.USE_MEMORY_DB);
}

/**
 * In-memory repository implementing standard Prisma query contracts
 * for reliable unit testing and offline development.
 */
export const memoryDb = {
  adminUser: {
    async findUnique({ where }: { where: { id?: string; email?: string } }) {
      if (where.id) {
        return memoryStore.adminUsers.get(where.id) || null;
      }
      if (where.email) {
        for (const u of memoryStore.adminUsers.values()) {
          if (u.email.toLowerCase() === where.email.toLowerCase()) return { ...u };
        }
      }
      return null;
    },
    async findFirst({ where }: { where?: any }) {
      for (const u of memoryStore.adminUsers.values()) {
        if (where?.email && u.email.toLowerCase() !== where.email.toLowerCase()) continue;
        if (where?.isActive !== undefined && u.isActive !== where.isActive) continue;
        return { ...u };
      }
      return null;
    },
    async findMany({ where, orderBy }: { where?: any; orderBy?: any } = {}) {
      let list = Array.from(memoryStore.adminUsers.values());
      if (where?.role) list = list.filter((u) => u.role === where.role);
      if (where?.isActive !== undefined) list = list.filter((u) => u.isActive === where.isActive);
      return list;
    },
    async create({ data }: { data: any }) {
      const id = data.id || `admin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const user = {
        id,
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role || 'EDITOR',
        isActive: data.isActive !== undefined ? data.isActive : true,
        lastLoginAt: data.lastLoginAt || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.adminUsers.set(id, user);
      return { ...user };
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      const existing = memoryStore.adminUsers.get(where.id);
      if (!existing) throw new Error(`AdminUser not found: ${where.id}`);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      memoryStore.adminUsers.set(where.id, updated);
      return { ...updated };
    },
    async count() {
      return memoryStore.adminUsers.size;
    },
  },

  page: {
    async findUnique({ where, include }: { where: { id?: string; slug?: string }; include?: any }) {
      let found: any = null;
      if (where.id) {
        found = memoryStore.pages.get(where.id) || null;
      } else if (where.slug) {
        for (const p of memoryStore.pages.values()) {
          if (p.slug === where.slug) {
            found = p;
            break;
          }
        }
      }
      if (!found) return null;
      const res = { ...found };
      if (include?.content) {
        res.content = memoryStore.pageContents.get(found.id) || null;
      }
      if (include?.seo) {
        res.seo = memoryStore.pageSeos.get(found.id) || null;
      }
      return res;
    },
    async findMany({ where, include, orderBy }: { where?: any; include?: any; orderBy?: any } = {}) {
      let list = Array.from(memoryStore.pages.values());
      if (where?.status) {
        list = list.filter((p) => p.status === where.status);
      }
      return list.map((p) => {
        const res = { ...p };
        if (include?.content) res.content = memoryStore.pageContents.get(p.id) || null;
        if (include?.seo) res.seo = memoryStore.pageSeos.get(p.id) || null;
        return res;
      });
    },
    async create({ data, include }: { data: any; include?: any }) {
      const id = data.id || `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const page = {
        id,
        slug: data.slug,
        name: data.name,
        status: data.status || 'DRAFT',
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.pages.set(id, page);

      if (data.content?.create) {
        const c = {
          id: `content-${id}`,
          pageId: id,
          version: data.content.create.version || 1,
          isPublished: data.content.create.isPublished || false,
          blocks: data.content.create.blocks || [],
          customCss: data.content.create.customCss || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.pageContents.set(id, c);
      }

      if (data.seo?.create) {
        const s = {
          id: `seo-${id}`,
          pageId: id,
          ...data.seo.create,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.pageSeos.set(id, s);
      }

      const res: any = { ...page };
      if (include?.content) res.content = memoryStore.pageContents.get(id) || null;
      if (include?.seo) res.seo = memoryStore.pageSeos.get(id) || null;
      return res;
    },
    async update({ where, data, include }: { where: { id: string }; data: any; include?: any }) {
      const existing = memoryStore.pages.get(where.id);
      if (!existing) throw new Error(`Page not found: ${where.id}`);
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      memoryStore.pages.set(where.id, updated);
      const res: any = { ...updated };
      if (include?.content) res.content = memoryStore.pageContents.get(where.id) || null;
      if (include?.seo) res.seo = memoryStore.pageSeos.get(where.id) || null;
      return res;
    },
    async count({ where }: { where?: any } = {}) {
      if (!where) return memoryStore.pages.size;
      let count = 0;
      for (const p of memoryStore.pages.values()) {
        if (where.status && p.status !== where.status) continue;
        count++;
      }
      return count;
    },
  },

  pageContent: {
    async findUnique({ where }: { where: { pageId: string } }) {
      return memoryStore.pageContents.get(where.pageId) || null;
    },
    async create({ data }: { data: any }) {
      const c = {
        id: data.id || `content-${data.pageId}`,
        pageId: data.pageId,
        version: data.version || 1,
        isPublished: data.isPublished || false,
        blocks: data.blocks || [],
        customCss: data.customCss || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.pageContents.set(data.pageId, c);
      return { ...c };
    },
    async update({ where, data }: { where: { pageId: string }; data: any }) {
      const existing = memoryStore.pageContents.get(where.pageId) || {
        id: `content-${where.pageId}`,
        pageId: where.pageId,
        version: 1,
        isPublished: false,
        blocks: [],
        createdAt: new Date(),
      };
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      memoryStore.pageContents.set(where.pageId, updated);
      return { ...updated };
    },
  },

  pageSeo: {
    async findUnique({ where }: { where: { pageId: string } }) {
      return memoryStore.pageSeos.get(where.pageId) || null;
    },
    async create({ data }: { data: any }) {
      const s = {
        id: data.id || `seo-${data.pageId}`,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.pageSeos.set(data.pageId, s);
      return { ...s };
    },
    async update({ where, data }: { where: { pageId: string }; data: any }) {
      const existing = memoryStore.pageSeos.get(where.pageId) || {
        id: `seo-${where.pageId}`,
        pageId: where.pageId,
        createdAt: new Date(),
      };
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date(),
      };
      memoryStore.pageSeos.set(where.pageId, updated);
      return { ...updated };
    },
  },

  toolContent: {
    async findUnique({ where, include }: { where: { toolSlug?: string; id?: string }; include?: any }) {
      let found: any = null;
      if (where.toolSlug) {
        found = memoryStore.toolContents.get(where.toolSlug) || null;
      }
      if (!found) return null;
      const res = { ...found };
      if (include?.seo) {
        res.seo = memoryStore.toolSeos.get(found.id) || null;
      }
      return res;
    },
    async findMany({ include }: { include?: any } = {}) {
      return Array.from(memoryStore.toolContents.values()).map((t) => {
        const res = { ...t };
        if (include?.seo) res.seo = memoryStore.toolSeos.get(t.id) || null;
        return res;
      });
    },
    async upsert({ where, create, update, include }: { where: { toolSlug: string }; create: any; update: any; include?: any }) {
      const existing = memoryStore.toolContents.get(where.toolSlug);
      let target: any;
      if (existing) {
        target = { ...existing, ...update, updatedAt: new Date() };
      } else {
        const id = `tc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        target = { id, ...create, createdAt: new Date(), updatedAt: new Date() };
      }
      memoryStore.toolContents.set(where.toolSlug, target);

      if (create.seo?.create || update.seo?.upsert) {
        const seoData = create.seo?.create || update.seo?.upsert?.create || update.seo?.upsert?.update;
        if (seoData) {
          memoryStore.toolSeos.set(target.id, {
            id: `ts-${target.id}`,
            toolContentId: target.id,
            ...seoData,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      const res = { ...target };
      if (include?.seo) res.seo = memoryStore.toolSeos.get(target.id) || null;
      return res;
    },
    async count() {
      return memoryStore.toolContents.size;
    },
  },

  pageRevision: {
    async create({ data }: { data: any }) {
      const rev = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        createdAt: new Date(),
      };
      memoryStore.pageRevisions.push(rev);
      return { ...rev };
    },
    async findMany({ where, orderBy }: { where?: any; orderBy?: any } = {}) {
      let list = [...memoryStore.pageRevisions];
      if (where?.pageId) list = list.filter((r) => r.pageId === where.pageId);
      if (orderBy?.createdAt === 'desc') {
        list.reverse();
      }
      return list;
    },
  },

  auditLog: {
    async create({ data }: { data: any }) {
      const log = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        createdAt: new Date(),
      };
      memoryStore.auditLogs.unshift(log);
      return { ...log };
    },
    async findMany({ where, orderBy, take, skip }: { where?: any; orderBy?: any; take?: number; skip?: number } = {}) {
      let list = [...memoryStore.auditLogs];
      if (where?.userId) list = list.filter((l) => l.userId === where.userId);
      if (where?.entityType) list = list.filter((l) => l.entityType === where.entityType);
      const start = skip || 0;
      const end = take ? start + take : undefined;
      return list.slice(start, end).map((l) => {
        const user = l.userId ? memoryStore.adminUsers.get(l.userId) : null;
        return {
          ...l,
          user: user ? { id: user.id, name: user.name, email: user.email } : null,
        };
      });
    },
    async count() {
      return memoryStore.auditLogs.length;
    },
  },

  globalSettings: {
    async findUnique({ where }: { where: { id: string } }) {
      return { ...memoryStore.globalSettings };
    },
    async update({ where, data }: { where: { id: string }; data: any }) {
      memoryStore.globalSettings = {
        ...memoryStore.globalSettings,
        ...data,
        updatedAt: new Date(),
      };
      return { ...memoryStore.globalSettings };
    },
    async upsert({ where, create, update }: { where: { id: string }; create: any; update: any }) {
      memoryStore.globalSettings = {
        ...memoryStore.globalSettings,
        ...update,
        updatedAt: new Date(),
      };
      return { ...memoryStore.globalSettings };
    },
  },
};

/**
 * Returns the active database client:
 * Uses Prisma when DATABASE_URL is configured, or resilient in-memory repository for unit tests.
 */
export function getDb(): typeof memoryDb | typeof prisma {
  if (shouldUsePrisma()) {
    return prisma as any;
  }
  return memoryDb;
}

/**
 * Resets the in-memory database to default state (useful for test isolation).
 */
export function resetMemoryDb() {
  memoryStore.adminUsers.clear();
  memoryStore.adminUsers.set(DEFAULT_ADMIN.id, { ...DEFAULT_ADMIN });
  memoryStore.pages.clear();
  for (const p of DEFAULT_PAGES) {
    memoryStore.pages.set(p.id, {
      ...p,
      publishedAt: new Date('2026-01-01T00:00:00.000Z'),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    });
  }
  memoryStore.pageContents.clear();
  memoryStore.pageSeos.clear();
  memoryStore.toolContents.clear();
  memoryStore.toolSeos.clear();
  memoryStore.pageRevisions = [];
  memoryStore.auditLogs = [];
}
