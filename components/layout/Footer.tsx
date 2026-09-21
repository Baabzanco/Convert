import React from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import Container from './Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-[#E5E7EB] mt-auto">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#17202A] font-semibold text-lg"
              aria-label="FileTools Home"
            >
              <div className="w-7 h-7 rounded-md bg-[#124A57] flex items-center justify-center text-white">
                <Layers className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span>FileTools</span>
            </Link>
            <p className="text-sm text-[#667085] leading-relaxed">
              Fast, privacy-focused image and PDF utility tools. Process files safely in your browser without registration or uploads.
            </p>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-xs font-semibold text-[#17202A] uppercase tracking-wider mb-3">
              Tools & Converters
            </h3>
            <ul className="space-y-2 text-sm text-[#667085]">
              <li>
                <Link href="/image-tools" className="hover:text-[#124A57] transition-colors">
                  Image Tools
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-[#124A57] transition-colors">
                  PDF Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/jpg-to-png" className="hover:text-[#124A57] transition-colors">
                  JPG to PNG
                </Link>
              </li>
              <li>
                <Link href="/tools/compress-image" className="hover:text-[#124A57] transition-colors">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="hover:text-[#124A57] transition-colors">
                  Merge PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-xs font-semibold text-[#17202A] uppercase tracking-wider mb-3">
              Formats & Guides
            </h3>
            <ul className="space-y-2 text-sm text-[#667085]">
              <li>
                <Link href="/formats/jpg" className="hover:text-[#124A57] transition-colors">
                  JPG Format Guide
                </Link>
              </li>
              <li>
                <Link href="/formats/png" className="hover:text-[#124A57] transition-colors">
                  PNG Format Guide
                </Link>
              </li>
              <li>
                <Link href="/formats/webp" className="hover:text-[#124A57] transition-colors">
                  WEBP Format Guide
                </Link>
              </li>
              <li>
                <Link href="/formats/pdf" className="hover:text-[#124A57] transition-colors">
                  PDF Format Guide
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#124A57] transition-colors">
                  Blog & Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / Legal Column */}
          <div>
            <h3 className="text-xs font-semibold text-[#17202A] uppercase tracking-wider mb-3">
              About & Legal
            </h3>
            <ul className="space-y-2 text-sm text-[#667085]">
              <li>
                <Link href="/about" className="hover:text-[#124A57] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#124A57] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#124A57] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#124A57] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#667085] gap-4">
          <p>© {currentYear} FileTools. Free online file utility service. All rights reserved.</p>
          <p>Client-side processing • 100% Free • No registration</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
