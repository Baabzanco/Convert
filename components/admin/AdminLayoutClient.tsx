'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminUserSession } from '@/lib/admin/types';

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<AdminUserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'fallback_memory'>('connected');

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (isLoginPage) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          if (isMounted) {
            router.push('/admin/login');
          }
          return;
        }
        const data = await res.json();
        if (isMounted) {
          setUser(data.user);
          setIsLoading(false);
        }

        // Fetch DB status non-blockingly; do NOT let dashboard stats errors affect the authenticated session
        try {
          const dashRes = await fetch('/api/admin/dashboard');
          if (dashRes.ok) {
            const dashData = await dashRes.json();
            if (isMounted && dashData.stats?.databaseStatus) {
              setDbStatus(dashData.stats.databaseStatus);
            }
          }
        } catch {
          // Ignore background status polling errors
        }
      } catch {
        if (isMounted) {
          router.push('/admin/login');
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router]);

  // If on login page, render clean standalone view without admin sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#124A57] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-[#64748B]">Verifying administrative session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:pl-64 text-[#17202A]">
      <AdminSidebar
        role={user?.role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={user}
          dbStatus={dbStatus}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayoutClient;
