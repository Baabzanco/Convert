import React from 'react';
import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { ShieldCheck, Zap, Heart, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us – Free Online File Utilities',
  description: 'Learn about FileTools, our mission to deliver fast, private, and 100% free image and PDF conversion utilities entirely within your browser.',
};

export default function AboutPage() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs items={[{ name: 'About' }]} />

        <div className="max-w-3xl mx-auto space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight">
              About FileTools
            </h1>
            <p className="text-lg text-[#667085] leading-relaxed">
              Fast, privacy-first image and PDF utilities designed to run directly on your own device.
            </p>
          </header>

          <section className="space-y-4 text-base text-[#17202A] leading-relaxed">
            <p>
              FileTools was founded with a straightforward conviction: basic file conversion and document management should be accessible to everyone without friction, paywalls, or privacy compromises.
            </p>
            <p>
              Most online file tools require users to upload confidential files to unfamiliar cloud servers, exposing personal receipts, tax filings, legal agreements, and cherished memories to potential data harvesting and security incidents.
            </p>
            <p>
              We leverage modern browser capabilities, including HTML5 Canvas and client-side processing, to run file conversions directly on your local hardware. Your files never leave your computer or phone.
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
            <div className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <Lock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-[#17202A]">Zero Server Uploads</h3>
              <p className="text-sm text-[#667085]">
                Complete privacy by default. We do not store, view, or retain your files.
              </p>
            </div>

            <div className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <Heart className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-[#17202A]">100% Free Service</h3>
              <p className="text-sm text-[#667085]">
                No subscriptions, account signups, credit cards, or hidden fees.
              </p>
            </div>

            <div className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <Zap className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-[#17202A]">Instant Processing</h3>
              <p className="text-sm text-[#667085]">
                Fast client execution eliminates network upload and download bottlenecks.
              </p>
            </div>

            <div className="p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-2">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-[#17202A]">Clean Design</h3>
              <p className="text-sm text-[#667085]">
                No intrusive popups or deceptive dark patterns. Pure utility.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
