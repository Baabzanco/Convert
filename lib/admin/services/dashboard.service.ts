import { getDb, isPrismaHealthy } from '@/lib/db';
import { getAllTools } from '@/lib/tools';
import { DashboardStats } from '../types';
import { getAuditLogs } from './audit.service';

export async function getDashboardStats(): Promise<DashboardStats> {
  const db = getDb();
  const allTools = getAllTools();

  const [
    totalAdminUsers,
    publishedPages,
    draftPages,
    totalPages,
    customizedTools,
    { logs: recentAuditLogs },
  ] = await Promise.all([
    db.adminUser.count(),
    db.page.count({ where: { status: 'PUBLISHED' } }),
    db.page.count({ where: { status: 'DRAFT' } }),
    db.page.count(),
    db.toolContent.count(),
    getAuditLogs({ limit: 6 }),
  ]);

  const databaseStatus = isPrismaHealthy() ? 'connected' : 'fallback_memory';

  return {
    totalAdminUsers,
    publishedPages,
    draftPages,
    totalPages,
    customizedTools,
    totalTools: allTools.length,
    publishedBlogPosts: 0,
    draftBlogPosts: 0,
    recentAuditLogs,
    databaseStatus,
  };
}
