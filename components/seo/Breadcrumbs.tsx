import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[#667085]">
        <li>
          <Link
            href="/"
            className="hover:text-[#124A57] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57] rounded"
          >
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-[#667085]/60 flex-shrink-0" aria-hidden="true" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-[#124A57] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#124A57] rounded"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="font-medium text-[#17202A] truncate" aria-current={isLast ? 'page' : undefined}>
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
