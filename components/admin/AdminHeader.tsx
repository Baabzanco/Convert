'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ExternalLink,
  LogOut,
  ShieldCheck,
  User,
  Database,
  Menu,
} from 'lucide-react';
import { AdminUserSession } from '@/lib/admin/types';

interface AdminHeaderProps {
  user: AdminUserSession | null;
  dbStatus?: 'connected' | 'fallback_memory';
  onToggleSidebar?: () => void;
}

export function AdminHeader({
  user,
  dbStatus = 'connected',
  onToggleSidebar,
}: AdminHeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // Continue to redirect
    }
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#17202A] hover:bg-[#F1F5F9]"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm md:text-base text-[#17202A]">
            CMS Control Center
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E6F4F1] text-[#124A57]">
            <Database className="w-3 h-3" />
            {dbStatus === 'connected' ? 'PostgreSQL' : 'In-Memory DB'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#124A57] transition-colors"
          title="Open public website in new tab"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {user && (
          <div className="flex items-center gap-2 pl-3 border-l border-[#E5E7EB]">
            <div className="w-8 h-8 rounded-full bg-[#124A57] text-white flex items-center justify-center font-bold text-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-[#17202A] leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] font-medium text-[#124A57] flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-[#124A57]" />
                {user.role}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2] rounded-lg transition-colors disabled:opacity-50"
          title="Sign out of administration"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
