import React from 'react';
import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy – FileTools',
  description: 'Our privacy commitment: zero file uploads, client-side processing, no account registration, and complete user privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs items={[{ name: 'Privacy Policy' }]} />

        <div className="max-w-3xl mx-auto space-y-6 text-[#17202A] leading-relaxed">
          <header className="space-y-2 mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-[#667085]">
              Last updated: March 2026
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17202A]">1. Client-Side Processing Architecture</h2>
            <p className="text-[#667085]">
              FileTools operates under a strict privacy-by-design architecture. Whenever technically possible, all file conversions, image compression, cropping, resizing, and PDF manipulations are executed exclusively on your local device within your web browser.
            </p>
            <p className="text-[#667085]">
              Your files (including images, documents, and personal metadata) are never transmitted to, inspected by, or stored on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17202A]">2. No Account Registration Required</h2>
            <p className="text-[#667085]">
              We do not ask for or collect names, email addresses, phone numbers, passwords, or personal credentials. You can use all 25 tools anonymously without creating an account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17202A]">3. Analytics & Logging</h2>
            <p className="text-[#667085]">
              We may collect standard aggregate website traffic metrics (such as page view counts and general browser user agent types) strictly for diagnostic, performance tuning, and security purposes. No file contents or personally identifiable information are associated with these operational logs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17202A]">4. Banner Advertising</h2>
            <p className="text-[#667085]">
              To maintain our service as 100% free without charging subscription fees or selling user data, our website may display banner advertisements provided by standard advertising partners. We do not use intrusive popups, interstitial blockers, or force downloads.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17202A]">5. Contact Us</h2>
            <p className="text-[#667085]">
              If you have any questions or feedback regarding this Privacy Policy, please visit our contact page.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
