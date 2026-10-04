import {
  PageSeoInput,
  StructuredPageBlock,
  CreatePageInput,
  UpdatePageInput,
  UpdateToolContentInput,
  ToolHowToStep,
  ToolFeatureItem,
  ToolFaqItem,
} from './types';
import { getToolBySlug } from '@/lib/tools';
import { normalizeBlock } from '@/lib/cms/blocks';

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

/**
 * Validates URLs to prevent script injection (XSS) via javascript:, vbscript:, or data: URLs.
 */
export function isSafeUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim().toLowerCase();
  if (trimmed === '') return true;

  // Block dangerous schemes
  const dangerousSchemes = ['javascript:', 'vbscript:', 'data:text/html'];
  for (const scheme of dangerousSchemes) {
    if (trimmed.startsWith(scheme)) return false;
  }

  // Allow relative URLs, http, https, mailto, tel
  if (
    trimmed.startsWith('/') ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return true;
  }

  // Reject malformed or unrecognized protocol strings
  return false;
}

/**
 * Sanitizes rich text HTML by removing malicious tags, attributes, event handlers, and javascript URLs.
 */
export function sanitizeRichTextHtml(rawHtml?: string | null): string {
  if (!rawHtml || typeof rawHtml !== 'string') return '';

  let sanitized = rawHtml;

  // 1. Remove dangerous tags entirely (script, iframe, object, embed, applet, style, form, input, button)
  sanitized = sanitized.replace(/<\s*(script|iframe|object|embed|applet|style|form|input|button)[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  sanitized = sanitized.replace(/<\s*(script|iframe|object|embed|applet|style|form|input|button)[\s\S]*?>/gi, '');

  // 2. Remove inline event handlers (onload, onerror, onclick, onmouseover, etc.)
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Remove javascript: or vbscript: in href or src attributes
  sanitized = sanitized.replace(/\s+(href|src)\s*=\s*["']?\s*(javascript|vbscript):[^"'>\s]+/gi, ' $1="#"');

  return sanitized;
}

/**
 * Validates JSON-LD input ensuring it is parseable JSON and contains no executable code or injection.
 */
export function validateJsonLd(rawJson: unknown): { isValid: boolean; error?: string; parsed?: Record<string, any> } {
  if (!rawJson) return { isValid: true, parsed: undefined };

  let parsed: Record<string, any>;
  if (typeof rawJson === 'string') {
    const trimmed = rawJson.trim();
    if (!trimmed) return { isValid: true, parsed: undefined };

    // Check for obvious script injection attempts
    if (/<script/i.test(trimmed) || /javascript:/i.test(trimmed)) {
      return { isValid: false, error: 'JSON-LD cannot contain script tags or javascript: schemes.' };
    }

    try {
      parsed = JSON.parse(trimmed);
    } catch {
      return { isValid: false, error: 'Malformed JSON syntax in structured data.' };
    }
  } else if (typeof rawJson === 'object' && rawJson !== null) {
    parsed = rawJson as Record<string, any>;
    const stringified = JSON.stringify(parsed);
    if (/<script/i.test(stringified) || /javascript:/i.test(stringified)) {
      return { isValid: false, error: 'JSON-LD cannot contain script tags or javascript: schemes.' };
    }
  } else {
    return { isValid: false, error: 'JSON-LD must be an object or valid JSON string.' };
  }

  return { isValid: true, parsed };
}

/**
 * Validates SEO metadata fields and produces errors (blocking) and warnings (informational).
 */
export function validateSeo(seo?: PageSeoInput | null): ValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  if (!seo) {
    return { isValid: true, errors, warnings };
  }

  // SEO Title checks
  if (seo.seoTitle) {
    const titleLen = seo.seoTitle.trim().length;
    if (titleLen < 10) {
      warnings.push({
        field: 'seoTitle',
        message: 'SEO title is shorter than 10 characters. Consider making it more descriptive.',
      });
    } else if (titleLen > 70) {
      warnings.push({
        field: 'seoTitle',
        message: 'SEO title exceeds 70 characters and may be truncated by search engines.',
      });
    }
  } else {
    warnings.push({
      field: 'seoTitle',
      message: 'No custom SEO title configured; default site title will be used.',
    });
  }

  // Meta Description checks
  if (seo.metaDescription) {
    const descLen = seo.metaDescription.trim().length;
    if (descLen < 50) {
      warnings.push({
        field: 'metaDescription',
        message: 'Meta description is under 50 characters. Aim for 50-160 characters.',
      });
    } else if (descLen > 160) {
      warnings.push({
        field: 'metaDescription',
        message: 'Meta description exceeds 160 characters and may be clipped in search snippets.',
      });
    }
  } else {
    warnings.push({
      field: 'metaDescription',
      message: 'No meta description configured; a generic fallback will be used.',
    });
  }

  // Canonical URL check
  if (seo.canonicalUrl) {
    if (!isSafeUrl(seo.canonicalUrl)) {
      errors.push({
        field: 'canonicalUrl',
        message: 'Canonical URL must be a valid http, https, or relative URL.',
      });
    }
  }

  // Open Graph & Twitter image URLs
  if (seo.ogImage && !isSafeUrl(seo.ogImage)) {
    errors.push({ field: 'ogImage', message: 'OG Image URL must be a valid, safe URL.' });
  }
  if (seo.twitterImage && !isSafeUrl(seo.twitterImage)) {
    errors.push({ field: 'twitterImage', message: 'Twitter Image URL must be a valid, safe URL.' });
  }

  // JSON-LD validation
  if (seo.schemaJson) {
    const jsonLdCheck = validateJsonLd(seo.schemaJson);
    if (!jsonLdCheck.isValid && jsonLdCheck.error) {
      errors.push({ field: 'schemaJson', message: jsonLdCheck.error });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a structured block and sanitizes text/HTML fields.
 */
export function validateAndSanitizeBlock(block: any): {
  isValid: boolean;
  block?: any;
  error?: string;
} {
  if (!block || typeof block !== 'object') {
    return { isValid: false, error: 'Block must be an object.' };
  }

  // Normalize block into standard UniversalContentBlock structure with legacy root fields
  const normalized = normalizeBlock(block);
  const type = normalized.type;
  const content = normalized.content || {};

  // Check CTA/Link/Image URL safety
  if (type === 'cta' || type === 'link') {
    const href = String(content.href || normalized.href || '').trim();
    if (href && !isSafeUrl(href)) {
      return { isValid: false, error: `Unsafe URL detected in ${type}: ${href}` };
    }
    content.href = href || '#';
  }

  if (type === 'image') {
    const src = String(content.src || normalized.src || '').trim();
    if (src && !isSafeUrl(src)) {
      return { isValid: false, error: `Unsafe Image URL detected: ${src}` };
    }
    content.src = src || '';
  }

  // HTML Sanitization for rich text
  if (type === 'rich_text' && (content.html !== undefined || normalized.html !== undefined)) {
    content.html = sanitizeRichTextHtml(content.html || normalized.html || '');
  }

  // Sync content back to root properties for backward-compatible rendering
  for (const [key, value] of Object.entries(content)) {
    normalized[key] = value;
  }

  return {
    isValid: true,
    block: normalized,
  };
}

/**
 * Validates page input (create or update) and sanitizes blocks.
 */
export function validatePagePayload(
  input: CreatePageInput | UpdatePageInput
): {
  isValid: boolean;
  sanitizedBlocks: StructuredPageBlock[];
  report: ValidationReport;
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const sanitizedBlocks: StructuredPageBlock[] = [];

  // Slug check if present
  if ('slug' in input && input.slug !== undefined) {
    const slug = input.slug.trim();
    if (!slug) {
      errors.push({ field: 'slug', message: 'URL slug cannot be empty.' });
    } else if (!/^[a-z0-9-_]+$/i.test(slug)) {
      errors.push({
        field: 'slug',
        message: 'URL slug must only contain letters, numbers, hyphens, and underscores.',
      });
    }
  }

  // Name check if present
  if (input.name !== undefined && !input.name.trim()) {
    errors.push({ field: 'name', message: 'Page name cannot be empty.' });
  }

  // Blocks check
  if (input.blocks && Array.isArray(input.blocks)) {
    for (let i = 0; i < input.blocks.length; i++) {
      const b = input.blocks[i];
      const validated = validateAndSanitizeBlock(b);
      if (!validated.isValid || !validated.block) {
        errors.push({
          field: `blocks[${i}]`,
          message: validated.error || 'Invalid block structure.',
        });
      } else {
        sanitizedBlocks.push(validated.block);
      }
    }
  }

  // SEO check
  const seoReport = validateSeo(input.seo);
  errors.push(...seoReport.errors);
  warnings.push(...seoReport.warnings);

  return {
    isValid: errors.length === 0,
    sanitizedBlocks,
    report: {
      isValid: errors.length === 0,
      errors,
      warnings,
    },
  };
}

/**
 * Validates tool content and SEO input, checking limits, formatting, and canonical references.
 */
export function validateToolPayload(
  slug: string,
  input: UpdateToolContentInput
): {
  isValid: boolean;
  sanitized: {
    customTitle?: string | null;
    customH1?: string | null;
    customIntro?: string | null;
    customDescription?: string | null;
    customValueProp?: string | null;
    customHowTo?: ToolHowToStep[] | null;
    customFeatures?: ToolFeatureItem[] | null;
    customFaq?: ToolFaqItem[] | null;
    customRelatedTools?: string[] | null;
    blocks?: any[] | null;
  };
  report: ValidationReport;
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // 1. Slug check against canonical registry
  const canonical = getToolBySlug(slug);
  if (!canonical) {
    errors.push({ field: 'slug', message: `Tool with slug '${slug}' not found in canonical registry.` });
  }

  // 2. Length limits on basic content fields
  if (input.customTitle && input.customTitle.length > 200) {
    errors.push({ field: 'customTitle', message: 'Title exceeds maximum length of 200 characters.' });
  }
  if (input.customH1 && input.customH1.length > 200) {
    errors.push({ field: 'customH1', message: 'H1 exceeds maximum length of 200 characters.' });
  }
  if (input.customDescription && input.customDescription.length > 1000) {
    errors.push({ field: 'customDescription', message: 'Description exceeds maximum length of 1000 characters.' });
  }
  if (input.customIntro && input.customIntro.length > 3000) {
    errors.push({ field: 'customIntro', message: 'Intro exceeds maximum length of 3000 characters.' });
  }
  if (input.customValueProp && input.customValueProp.length > 1000) {
    errors.push({ field: 'customValueProp', message: 'Value proposition exceeds maximum length of 1000 characters.' });
  }

  // 3. How-to steps validation
  let sanitizedHowTo: ToolHowToStep[] | null = null;
  if (input.customHowTo !== undefined && input.customHowTo !== null) {
    if (!Array.isArray(input.customHowTo)) {
      errors.push({ field: 'customHowTo', message: 'How-to must be an array of steps.' });
    } else {
      sanitizedHowTo = [];
      for (let i = 0; i < input.customHowTo.length; i++) {
        const step = input.customHowTo[i];
        if (!step || typeof step !== 'object') {
          errors.push({ field: `customHowTo[${i}]`, message: 'Step must be an object with title and description.' });
          continue;
        }
        const title = String(step.title || '').trim();
        const description = String(step.description || '').trim();
        if (!title) {
          errors.push({ field: `customHowTo[${i}].title`, message: 'Step title is required.' });
        }
        if (!description) {
          errors.push({ field: `customHowTo[${i}].description`, message: 'Step description is required.' });
        }
        sanitizedHowTo.push({ title, description });
      }
    }
  }

  // 4. Features validation
  let sanitizedFeatures: ToolFeatureItem[] | null = null;
  if (input.customFeatures !== undefined && input.customFeatures !== null) {
    if (!Array.isArray(input.customFeatures)) {
      errors.push({ field: 'customFeatures', message: 'Features must be an array of items.' });
    } else {
      sanitizedFeatures = [];
      for (let i = 0; i < input.customFeatures.length; i++) {
        const feat = input.customFeatures[i];
        if (!feat || typeof feat !== 'object') {
          errors.push({ field: `customFeatures[${i}]`, message: 'Feature must be an object with title and description.' });
          continue;
        }
        const title = String(feat.title || '').trim();
        const description = String(feat.description || '').trim();
        if (!title) {
          errors.push({ field: `customFeatures[${i}].title`, message: 'Feature title is required.' });
        }
        if (!description) {
          errors.push({ field: `customFeatures[${i}].description`, message: 'Feature description is required.' });
        }
        sanitizedFeatures.push({ title, description });
      }
    }
  }

  // 5. FAQ validation
  let sanitizedFaq: ToolFaqItem[] | null = null;
  if (input.customFaq !== undefined && input.customFaq !== null) {
    if (!Array.isArray(input.customFaq)) {
      errors.push({ field: 'customFaq', message: 'FAQ must be an array of questions and answers.' });
    } else {
      sanitizedFaq = [];
      const seenQuestions = new Set<string>();
      for (let i = 0; i < input.customFaq.length; i++) {
        const item = input.customFaq[i];
        if (!item || typeof item !== 'object') {
          errors.push({ field: `customFaq[${i}]`, message: 'FAQ item must be an object.' });
          continue;
        }
        const question = String(item.question || '').trim();
        const answer = String(item.answer || '').trim();
        if (!question) {
          errors.push({ field: `customFaq[${i}].question`, message: 'FAQ question is required.' });
        }
        if (!answer) {
          errors.push({ field: `customFaq[${i}].answer`, message: 'FAQ answer is required.' });
        }
        const normQ = question.toLowerCase();
        if (seenQuestions.has(normQ)) {
          warnings.push({ field: `customFaq[${i}]`, message: `Duplicate question: "${question}"` });
        } else {
          seenQuestions.add(normQ);
        }
        sanitizedFaq.push({ question, answer });
      }
    }
  }

  // 6. Related Tools validation: only canonical slugs, no self-reference, no duplicates
  let sanitizedRelatedTools: string[] | null = null;
  if (input.customRelatedTools !== undefined && input.customRelatedTools !== null) {
    if (!Array.isArray(input.customRelatedTools)) {
      errors.push({ field: 'customRelatedTools', message: 'Related tools must be an array of slugs.' });
    } else {
      sanitizedRelatedTools = [];
      const seenSlugs = new Set<string>();
      for (let i = 0; i < input.customRelatedTools.length; i++) {
        const relSlug = String(input.customRelatedTools[i] || '').trim();
        if (!relSlug) continue;
        if (relSlug === slug) {
          errors.push({ field: `customRelatedTools[${i}]`, message: 'Tool cannot reference itself as a related tool.' });
          continue;
        }
        if (!getToolBySlug(relSlug)) {
          errors.push({ field: `customRelatedTools[${i}]`, message: `'${relSlug}' is not one of the 25 canonical tools.` });
          continue;
        }
        if (seenSlugs.has(relSlug)) {
          warnings.push({ field: `customRelatedTools[${i}]`, message: `Duplicate related tool '${relSlug}' ignored.` });
        } else {
          seenSlugs.add(relSlug);
          sanitizedRelatedTools.push(relSlug);
        }
      }
    }
  }

  // 7. SEO validation
  if (input.seo) {
    const seoReport = validateSeo(input.seo);
    errors.push(...seoReport.errors);
    warnings.push(...seoReport.warnings);

    if (input.seo.canonicalUrl) {
      const cUrl = input.seo.canonicalUrl.trim();
      if (!isSafeUrl(cUrl)) {
        errors.push({ field: 'seo.canonicalUrl', message: 'Canonical URL contains an unsafe scheme.' });
      }
    }
  }

  // 8. Content Blocks validation
  let sanitizedBlocks: any[] | null = null;
  if (input.blocks !== undefined && input.blocks !== null) {
    if (!Array.isArray(input.blocks)) {
      errors.push({ field: 'blocks', message: 'Blocks must be an array.' });
    } else {
      sanitizedBlocks = [];
      for (let i = 0; i < input.blocks.length; i++) {
        const b = input.blocks[i];
        const validated = validateAndSanitizeBlock(b);
        if (!validated.isValid) {
          errors.push({ field: `blocks[${i}]`, message: validated.error || 'Invalid block structure.' });
        } else {
          sanitizedBlocks.push(validated.block);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    sanitized: {
      customTitle: input.customTitle ? input.customTitle.trim() : input.customTitle,
      customH1: input.customH1 ? input.customH1.trim() : input.customH1,
      customIntro: input.customIntro ? input.customIntro.trim() : input.customIntro,
      customDescription: input.customDescription ? input.customDescription.trim() : input.customDescription,
      customValueProp: input.customValueProp ? input.customValueProp.trim() : input.customValueProp,
      customHowTo: sanitizedHowTo,
      customFeatures: sanitizedFeatures,
      customFaq: sanitizedFaq,
      customRelatedTools: sanitizedRelatedTools,
      blocks: sanitizedBlocks,
    },
    report: {
      isValid: errors.length === 0,
      errors,
      warnings,
    },
  };
}

/**
 * Validates Blog Post creation and update payloads.
 * Strips malicious scripts/iframes, checks safe URLs, and validates SEO.
 */
export function validateBlogPostPayload(input: {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  featuredImage?: string | null;
  featuredImageAlt?: string | null;
  status?: string;
  scheduledFor?: string | Date | null;
  seo?: PageSeoInput;
}): {
  isValid: boolean;
  sanitized: {
    title: string;
    slug?: string;
    excerpt?: string | null;
    content: string;
    featuredImage?: string | null;
    featuredImageAlt?: string | null;
  };
  report: ValidationReport;
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // 1. Title validation
  const title = (input.title || '').trim();
  if (!title) {
    errors.push({ field: 'title', message: 'Blog post title is required.' });
  } else if (title.length > 200) {
    errors.push({ field: 'title', message: 'Title cannot exceed 200 characters.' });
  }

  // 2. Slug validation
  let slug: string | undefined = undefined;
  if (input.slug !== undefined) {
    const rawSlug = input.slug.trim();
    if (!rawSlug && title) {
      slug = title.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    } else {
      slug = rawSlug.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }
    if (slug.length > 120) {
      errors.push({ field: 'slug', message: 'Slug cannot exceed 120 characters.' });
    }
  }

  // 3. Excerpt validation
  let excerpt: string | null = null;
  if (input.excerpt) {
    excerpt = input.excerpt.trim();
    if (excerpt.length > 500) {
      warnings.push({ field: 'excerpt', message: 'Excerpt is longer than recommended 500 characters.' });
    }
  }

  // 4. Content sanitization
  const rawContent = input.content || '';
  const sanitizedContent = sanitizeRichTextHtml(rawContent);

  // 5. Featured Image URL safety
  let featuredImage: string | null = null;
  if (input.featuredImage) {
    const imgUrl = input.featuredImage.trim();
    if (imgUrl) {
      if (!isSafeUrl(imgUrl)) {
        errors.push({ field: 'featuredImage', message: 'Featured image URL contains an unsafe scheme.' });
      } else {
        featuredImage = imgUrl;
      }
    }
  }

  const featuredImageAlt = input.featuredImageAlt ? input.featuredImageAlt.trim().slice(0, 200) : null;

  // 6. Scheduled Date validation
  if (input.scheduledFor) {
    const d = new Date(input.scheduledFor);
    if (isNaN(d.getTime())) {
      errors.push({ field: 'scheduledFor', message: 'Scheduled date is invalid.' });
    }
  }

  // 7. SEO validation
  if (input.seo) {
    const seoReport = validateSeo(input.seo);
    errors.push(...seoReport.errors);
    warnings.push(...seoReport.warnings);

    if (input.seo.canonicalUrl && !isSafeUrl(input.seo.canonicalUrl.trim())) {
      errors.push({ field: 'seo.canonicalUrl', message: 'Canonical URL contains an unsafe scheme.' });
    }
  }

  return {
    isValid: errors.length === 0,
    sanitized: {
      title,
      slug,
      excerpt,
      content: sanitizedContent,
      featuredImage,
      featuredImageAlt,
    },
    report: {
      isValid: errors.length === 0,
      errors,
      warnings,
    },
  };
}

/**
 * Validates Category creation and update payloads.
 */
export function validateCategoryPayload(input: { name?: string; slug?: string; description?: string | null }): {
  isValid: boolean;
  sanitized: { name: string; slug: string; description?: string | null };
  report: ValidationReport;
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const name = (input.name || '').trim();
  if (!name) {
    errors.push({ field: 'name', message: 'Category name is required.' });
  } else if (name.length > 100) {
    errors.push({ field: 'name', message: 'Category name cannot exceed 100 characters.' });
  }

  let slug = (input.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!slug && name) {
    slug = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
  if (!slug) {
    errors.push({ field: 'slug', message: 'Category slug is required.' });
  }

  return {
    isValid: errors.length === 0,
    sanitized: {
      name,
      slug,
      description: input.description ? input.description.trim() : null,
    },
    report: {
      isValid: errors.length === 0,
      errors,
      warnings,
    },
  };
}

/**
 * Validates Tag creation and update payloads.
 */
export function validateTagPayload(input: { name?: string; slug?: string }): {
  isValid: boolean;
  sanitized: { name: string; slug: string };
  report: ValidationReport;
} {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const name = (input.name || '').trim();
  if (!name) {
    errors.push({ field: 'name', message: 'Tag name is required.' });
  } else if (name.length > 50) {
    errors.push({ field: 'name', message: 'Tag name cannot exceed 50 characters.' });
  }

  let slug = (input.slug || '').trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!slug && name) {
    slug = name.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
  if (!slug) {
    errors.push({ field: 'slug', message: 'Tag slug is required.' });
  }

  return {
    isValid: errors.length === 0,
    sanitized: {
      name,
      slug,
    },
    report: {
      isValid: errors.length === 0,
      errors,
      warnings,
    },
  };
}

