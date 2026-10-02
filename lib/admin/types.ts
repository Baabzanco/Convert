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

export type BlockType =
  | 'section'
  | 'heading'
  | 'paragraph'
  | 'rich_text'
  | 'cta'
  | 'link'
  | 'image'
  | 'faq'
  | 'feature';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface SectionBlock extends BaseBlock {
  type: 'section';
  title: string;
  description?: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3;
  text: string;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
}

export interface RichTextBlock extends BaseBlock {
  type: 'rich_text';
  html: string;
}

export interface CtaBlock extends BaseBlock {
  type: 'cta';
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface LinkBlock extends BaseBlock {
  type: 'link';
  text: string;
  href: string;
  isExternal?: boolean;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
}

export interface FaqBlock extends BaseBlock {
  type: 'faq';
  question: string;
  answer: string;
}

export interface FeatureBlock extends BaseBlock {
  type: 'feature';
  title: string;
  description: string;
  icon?: string;
}

export type StructuredPageBlock =
  | SectionBlock
  | HeadingBlock
  | ParagraphBlock
  | RichTextBlock
  | CtaBlock
  | LinkBlock
  | ImageBlock
  | FaqBlock
  | FeatureBlock;

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
    | 'link'
    | 'feature'
    | 'cta';
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

export interface ToolHowToStep {
  title: string;
  description: string;
}

export interface ToolFeatureItem {
  title: string;
  description: string;
}

export interface ToolFaqItem {
  question: string;
  answer: string;
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
  customRelatedTools?: string[] | null;
  isPublished?: boolean;
  seo?: PageSeoInput;
  reason?: string;
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

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface BlogCategoryItem {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogTagItem {
  id: string;
  slug: string;
  name: string;
  postCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  readingTime?: string | null;
  status: PostStatus;
  publishedAt?: string | null;
  scheduledFor?: string | null;
  authorId?: string | null;
  author?: { id: string; name: string; email: string; role?: string } | null;
  categoryId?: string | null;
  category?: BlogCategoryItem | null;
  tags?: { postId?: string; tagId: string; tag?: BlogTagItem | null }[];
  seo?: PageSeoInput | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  status?: PostStatus;
  publishedAt?: string | Date | null;
  scheduledFor?: string | Date | null;
  categoryId?: string | null;
  tagIds?: string[];
  seo?: PageSeoInput;
}

export interface UpdateBlogPostInput {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  status?: PostStatus;
  publishedAt?: string | Date | null;
  scheduledFor?: string | Date | null;
  categoryId?: string | null;
  tagIds?: string[];
  seo?: PageSeoInput;
  reason?: string;
}

export interface ListBlogPostsOptions {
  status?: PostStatus;
  categoryId?: string;
  categorySlug?: string;
  tagId?: string;
  tagSlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  publishedOnly?: boolean;
}

export interface BlogPostRevisionItem {
  id: string;
  postId: string;
  contentSnapshot: any;
  seoSnapshot?: any;
  authorId?: string | null;
  author?: { id: string; name: string; email: string } | null;
  reason?: string | null;
  createdAt: string;
}

export interface MediaAssetItem {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  url: string;
  storagePath: string;
  alt: string | null;
  title: string | null;
  caption: string | null;
  description: string | null;
  uploadedById: string | null;
  uploadedBy?: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadMediaInput {
  file: Buffer | Uint8Array;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  alt?: string | null;
  title?: string | null;
  caption?: string | null;
  description?: string | null;
}

export interface UpdateMediaInput {
  title?: string | null;
  alt?: string | null;
  caption?: string | null;
  description?: string | null;
}

export interface ListMediaOptions {
  search?: string;
  mimeType?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'size' | 'filename';
  sortOrder?: 'asc' | 'desc';
}

