import React from 'react';
import type { Metadata } from 'next';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us – FileTools',
  description: 'Get in touch with the FileTools team for feedback, bug reports, and general inquiries.',
};

export default function ContactPage() {
  return (
    <div className="py-8 md:py-12">
      <Container>
        <Breadcrumbs items={[{ name: 'Contact' }]} />

        <div className="max-w-2xl mx-auto space-y-8">
          <header className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#17202A] tracking-tight">
              Contact Us
            </h1>
            <p className="text-base md:text-lg text-[#667085] leading-relaxed">
              Have questions, feedback, or need to report a problem with a tool? We appreciate hearing from our users.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <Mail className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-semibold text-lg text-[#17202A]">General Inquiries</h2>
              <p className="text-sm text-[#667085]">
                For questions about our platform, partnerships, or features:
              </p>
              <p className="text-sm font-medium text-[#124A57]">
                support@filetools.example
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F0F7F8] text-[#124A57] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2 className="font-semibold text-lg text-[#17202A]">Bug Reports</h2>
              <p className="text-sm text-[#667085]">
                Encountered an issue with a particular file format or browser?
              </p>
              <p className="text-sm font-medium text-[#124A57]">
                bugs@filetools.example
              </p>
            </div>
          </div>

          <div className="p-6 bg-[#F8FAFC] border border-[#E5E7EB] rounded-card space-y-2 text-sm text-[#667085]">
            <h3 className="font-semibold text-[#17202A]">Frequently Asked Inquiries</h3>
            <p>
              Before sending a message, please check our{' '}
              <a href="/#faq-heading" className="text-[#124A57] font-medium underline">
                FAQ section
              </a>
              . Common questions regarding file limits, security, and supported formats are answered there.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
