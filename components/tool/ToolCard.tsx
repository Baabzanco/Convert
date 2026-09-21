import React from 'react';
import Link from 'next/link';
import { ArrowRight, Image as ImageIcon, FileText, Sparkles } from 'lucide-react';
import { ToolDefinition } from '@/lib/tools';

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isImage = tool.category.startsWith('image');

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group flex flex-col justify-between p-5 bg-[#FFFFFF] border border-[#E5E7EB] rounded-card hover:border-[#124A57]/40 hover:shadow-subtle transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57]"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isImage ? 'bg-[#F0F7F8] text-[#124A57]' : 'bg-[#FAF0F6] text-[#CD78B3]'
            }`}
          >
            {isImage ? (
              <ImageIcon className="w-5 h-5" aria-hidden="true" />
            ) : (
              <FileText className="w-5 h-5" aria-hidden="true" />
            )}
          </div>
          {tool.clientSide && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#124A57] bg-[#F0F7F8] px-2 py-0.5 rounded-full whitespace-nowrap">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Client-side
            </span>
          )}
        </div>

        <h3 className="font-semibold text-[#17202A] text-lg mb-1.5 group-hover:text-[#124A57] transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-[#667085] line-clamp-2 leading-relaxed mb-4">
          {tool.intro}
        </p>
      </div>

      <div className="flex items-center text-xs font-semibold text-[#124A57] group-hover:translate-x-0.5 transition-transform">
        <span>Use Tool</span>
        <ArrowRight className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
      </div>
    </Link>
  );
}

export default ToolCard;
