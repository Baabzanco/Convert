import React from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-20 md:py-32">
      <Container className="text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#F0F7F8] text-[#124A57] flex items-center justify-center mx-auto">
            <FileQuestion className="w-8 h-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#124A57]">
              404 – Page Not Found
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#17202A] tracking-tight">
              Tool or Page Not Found
            </h1>
            <p className="text-sm md:text-base text-[#667085] leading-relaxed">
              The tool, format guide, or page you requested does not exist or may have been moved.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[#124A57] hover:bg-[#0E3943] transition-colors shadow-subtle text-sm"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/image-tools"
              className="w-full sm:w-auto px-5 py-3 rounded-lg text-sm font-medium text-[#17202A] hover:bg-[#F8FAFC] border border-[#E5E7EB] transition-colors"
            >
              Browse Image Tools
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
