'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Wrench,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Database,
  RefreshCw,
  Activity,
} from 'lucide-react';
import { DashboardStats } from '@/lib/admin/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/dashboard');
      if (!res.ok) {
        throw new Error('Failed to load dashboard statistics.');
      }
      const data = await res.json();
      setStats(data.stats);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading dashboard.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#17202A]">
            Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time status and database statistics for your self-hosted CMS.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#475467] bg-white border border-[#CBD5E1] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          className="p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-center gap-3 text-sm text-[#991B1B]"
          role="alert"
        >
          <ShieldAlert className="w-5 h-5 text-[#DC2626] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Published Pages */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Published Pages
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#124A57] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#17202A]">
              {isLoading ? '...' : stats?.publishedPages ?? 0}
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Out of {stats?.totalPages ?? 0} total registered pages
            </p>
          </div>
        </div>

        {/* Metric 2: Draft Pages */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Draft Pages
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#FFFBEB] text-[#B45309] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#17202A]">
              {isLoading ? '...' : stats?.draftPages ?? 0}
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Unpublished draft versions in progress
            </p>
          </div>
        </div>

        {/* Metric 3: Active Tools */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Available Tools
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#17202A]">
              {stats?.totalTools ?? 25}
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              {stats?.customizedTools ?? 0} tools with CMS custom overrides
            </p>
          </div>
        </div>

        {/* Metric 4: Admin Accounts */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Admin Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#6D28D9] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-[#17202A]">
              {isLoading ? '...' : stats?.totalAdminUsers ?? 1}
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Protected by server-side RBAC
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Sections: Quick Modules & Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Content Foundations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick CMS Modules Panel */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-subtle p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748B] mb-4">
              Core CMS Foundations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/admin/pages"
                className="group p-4 rounded-xl border border-[#E2E8F0] hover:border-[#124A57] hover:bg-[#F8FAFC] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#E6F4F1] text-[#124A57] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#17202A] group-hover:text-[#124A57]">
                    Manage Public Pages
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Control Home, Directories, About, Terms, Privacy, and new public routes.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#124A57]">
                  <span>Open Pages CMS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link
                href="/admin/tools"
                className="group p-4 rounded-xl border border-[#E2E8F0] hover:border-[#124A57] hover:bg-[#F8FAFC] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#E6F4F1] text-[#124A57] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#17202A] group-hover:text-[#124A57]">
                    Manage Tool Overrides
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    Override titles, descriptions, and SEO for all 25 public media tools.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-semibold text-[#124A57]">
                  <span>Open Tools CMS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* Database & Architecture Summary */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-subtle p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">
                Database Architecture
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#E6F4F1] text-[#124A57]">
                <Database className="w-3.5 h-3.5" />
                {stats?.databaseStatus === 'connected' ? 'PostgreSQL Active' : 'In-Memory Testing'}
              </span>
            </div>
            <p className="text-xs text-[#475467] leading-relaxed mb-4">
              All models (AdminUser, Page, PageContent, PageSeo, ToolContent, ToolSeo, PageRevision, AuditLog, GlobalSettings) are compiled into Prisma schema and migration <code className="bg-[#F1F5F9] px-1 py-0.5 rounded text-[11px]">20260930000000_init_cms_foundation</code>.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#64748B] text-[10px] uppercase font-semibold">Roles</div>
                <div className="font-bold text-[#17202A] mt-0.5">5 Canonical</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#64748B] text-[10px] uppercase font-semibold">Password Hash</div>
                <div className="font-bold text-[#17202A] mt-0.5">Bcrypt 12 Rounds</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#64748B] text-[10px] uppercase font-semibold">Sessions</div>
                <div className="font-bold text-[#17202A] mt-0.5">HttpOnly JWT</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="text-[#64748B] text-[10px] uppercase font-semibold">Audit Logs</div>
                <div className="font-bold text-[#17202A] mt-0.5">Enabled</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Recent Activity Audit Stream */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-subtle p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#124A57]" />
                <span>Recent Audit Activity</span>
              </h2>
              <Link
                href="/admin/audit"
                className="text-xs font-semibold text-[#124A57] hover:underline"
              >
                View all
              </Link>
            </div>

            {stats?.recentAuditLogs && stats.recentAuditLogs.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAuditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#17202A]">
                      <span className="font-mono text-[11px] text-[#124A57]">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="text-[#64748B] truncate">
                      {log.entityType} {log.entityId ? `(${log.entityId})` : ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#94A3B8]">
                No administrative activity logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
