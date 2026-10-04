import React from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';
import Container from './Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F4F3FA] border-t border-[#E4E2F0] mt-auto">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-[#0F112E] hover:text-[#7C3AED] font-extrabold text-lg transition-colors"
              aria-label="Convert24 Home"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#6366F1] flex items-center justify-center text-white shadow-sm">
                <Layers className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span>Convert<span className="text-[#7C3AED]">24</span></span>
            </Link>
            <p className="text-sm text-[#5E6488] leading-relaxed">
              Fast, privacy-focused image and PDF utility tools. Process files safely in your browser without registration, subscriptions, or remote cloud uploads.
            </p>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-xs font-bold text-[#0F112E] uppercase tracking-widest mb-4">
              Tools & Converters
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5E6488]">
              <li>
                <Link href="/image-tools" className="hover:text-[#7C3AED] transition-colors">
                  Image Tools Hub
                </Link>
              </li>
              <li>
                <Link href="/pdf-tools" className="hover:text-[#7C3AED] transition-colors">
                  PDF Tools Hub
                </Link>
              </li>
              <li>
                <Link href="/tools/jpg-to-png" className="hover:text-[#7C3AED] transition-colors">
                  JPG to PNG
                </Link>
              </li>
              <li>
                <Link href="/tools/compress-image" className="hover:text-[#7C3AED] transition-colors">
                  Compress Image
                </Link>
              </li>
              <li>
                <Link href="/tools/merge-pdf" className="hover:text-[#7C3AED] transition-colors">
                  Merge PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-xs font-bold text-[#0F112E] uppercase tracking-widest mb-4">
              Formats & Guides
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5E6488]">
              <li>
                <Link href="/formats/jpg" className="hover:text-[#7C3AED] transition-colors">
                  JPG Format Guide
                </Link>
              </li>
              <li>
                <Link href="/formats/png" className="hover:text-[#7C3AED] transition-colors">
                  PNG Format Guide
                </Link>
              </li>
              <li>
                <Link href="/formats/webp" className="hover:text-[#7C3AED] transition-colors">
                  WEBP Format Guide
                </Link>
              </li>
              <li>
                <Link href="/formats/pdf" className="hover:text-[#7C3AED] transition-colors">
                  PDF Format Guide
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#7C3AED] transition-colors">
                  Blog & Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / Legal Column */}
          <div>
            <h3 className="text-xs font-bold text-[#0F112E] uppercase tracking-widest mb-4">
              About & Legal
            </h3>
            <ul className="space-y-2.5 text-sm text-[#5E6488]">
              <li>
                <Link href="/about" className="hover:text-[#7C3AED] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#7C3AED] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#7C3AED] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#7C3AED] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#E4E2F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5E6488] gap-4">
          <p>© {currentYear} Convert24. Free online file utility service. All rights reserved.</p>
          <p>Client-side processing • 100% Free • No registration</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
