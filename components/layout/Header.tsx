'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Layers } from 'lucide-react';
import Container from './Container';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname() || '';

  const navLinks = [
    { href: '/image-tools', label: 'Image Tools' },
    { href: '/pdf-tools', label: 'PDF Tools' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E5E7EB]">
      <Container>
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[#17202A] hover:text-[#124A57] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57] rounded-md p-1"
            aria-label="Free Online File Tools Home"
          >
            <div className="w-9 h-9 rounded-lg bg-[#124A57] flex items-center justify-center text-white shadow-subtle">
              <Layers className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="font-semibold text-lg tracking-tight text-[#17202A]">
              FileTools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = Boolean(
                pathname && (pathname === link.href || pathname.startsWith(`${link.href}/`))
              );
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57] ${
                    isActive
                      ? 'text-[#124A57] bg-[#F0F7F8]'
                      : 'text-[#17202A] hover:text-[#124A57] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-[#17202A] hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 space-y-1 shadow-subtle"
        >
          {navLinks.map((link) => {
            const isActive = Boolean(
              pathname && (pathname === link.href || pathname.startsWith(`${link.href}/`))
            );
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'text-[#124A57] bg-[#F0F7F8]'
                    : 'text-[#17202A] hover:bg-[#F8FAFC]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default Header;
