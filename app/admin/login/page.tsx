'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, AlertCircle, ArrowRight, Lock, Mail, ExternalLink } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed.';
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-[#124A57] text-white flex items-center justify-center mx-auto shadow-md mb-4">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#17202A]">
          FileTools CMS
        </h1>
        <p className="mt-1.5 text-sm text-[#64748B]">
          Self-hosted Administrative Control Center
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-subtle rounded-2xl border border-[#E5E7EB]">
          {error && (
            <div
              id="login-error-alert"
              className="mb-6 p-4 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-3 text-xs sm:text-sm text-[#991B1B] animate-fadeIn"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-semibold uppercase tracking-wider text-[#475467] mb-1.5"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@filetools.local"
                  className="block w-full pl-9 pr-3 py-2.5 border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#124A57] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#475467] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94A3B8]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 border border-[#CBD5E1] rounded-lg text-sm text-[#17202A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#124A57] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#124A57] hover:bg-[#0E3B46] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#124A57] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign in to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#F1F5F9] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#124A57] transition-colors"
            >
              <span>Back to public site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Security badge */}
        <p className="mt-6 text-center text-xs text-[#94A3B8]">
          Protected by server-side RBAC and encrypted session cookies.
        </p>
      </div>
    </div>
  );
}
