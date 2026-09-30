export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CONTENT_MANAGER'
  | 'EDITOR'
  | 'VIEWER';

export type AdminPermission =
  | 'MANAGE_USERS'
  | 'MANAGE_SETTINGS'
  | 'PUBLISH_CONTENT'
  | 'EDIT_CONTENT'
  | 'MANAGE_MEDIA'
  | 'MANAGE_SEO'
  | 'VIEW_AUDIT_LOGS'
  | 'VIEW_CMS';

export type PageStatus = 'DRAFT' | 'PUBLISHED';

export interface AdminUserSession {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface ContentBlock {
  id: string;
  type:
    | 'heading'
    | 'paragraph'
    | 'rich_text'
    | 'button'
    | 'section'
    | 'faq'
    | 'tool_ref'
    | 'image'
    | 'link';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
}

export interface PageSeoInput {
  seoTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  schemaType?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schemaJson?: Record<string, any> | null;
  focusKeyword?: string | null;
}

export interface CreatePageInput {
  slug: string;
  name: string;
  status?: PageStatus;
  blocks?: ContentBlock[];
  customCss?: string;
  seo?: PageSeoInput;
}

export interface UpdatePageInput {
  name?: string;
  slug?: string;
  status?: PageStatus;
  blocks?: ContentBlock[];
  customCss?: string;
  seo?: PageSeoInput;
  reason?: string;
}

export interface UpdateToolContentInput {
  customTitle?: string | null;
  customH1?: string | null;
  customDescription?: string | null;
  customIntro?: string | null;
  customValueProp?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customHowTo?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFeatures?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFaq?: any;
  isPublished?: boolean;
  seo?: PageSeoInput;
}

export interface UpdateSettingsInput {
  siteName?: string;
  siteUrl?: string;
  defaultSeoTitle?: string | null;
  defaultMetaDescription?: string | null;
  defaultOgImage?: string | null;
  defaultTwitterImage?: string | null;
  googleAnalyticsId?: string | null;
  googleAdSenseId?: string | null;
  socialLinks?: Record<string, string> | null;
}

export interface AuditLogItem {
  id: string;
  userId: string | null;
  userName?: string | null;
  userEmail?: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface DashboardStats {
  totalAdminUsers: number;
  publishedPages: number;
  draftPages: number;
  totalPages: number;
  customizedTools: number;
  totalTools: number;
  publishedBlogPosts: number;
  draftBlogPosts: number;
  recentAuditLogs: AuditLogItem[];
  databaseStatus: 'connected' | 'fallback_memory';
}
