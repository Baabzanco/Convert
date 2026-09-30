import { getDb } from '@/lib/db';
import { UpdateSettingsInput, AdminUserSession } from '../types';
import { createAuditLog } from './audit.service';

const DEFAULT_SETTINGS = {
  id: 'default',
  siteName: 'Free Online File Tools',
  siteUrl: 'https://example.com',
  defaultSeoTitle: 'Free Online File Tools – Convert, Compress & Edit Files Free',
  defaultMetaDescription: 'Convert, compress and manage your files quickly and easily with 100% client-side privacy.',
  defaultOgImage: '/images/og-image.png',
  defaultTwitterImage: '/images/og-image.png',
  googleAnalyticsId: null,
  googleAdSenseId: null,
  socialLinks: {},
};

export async function getGlobalSettings() {
  const db = getDb();
  const settings = await db.globalSettings.findUnique({
    where: { id: 'default' },
  });

  return settings || DEFAULT_SETTINGS;
}

export async function updateGlobalSettings(
  input: UpdateSettingsInput,
  author: AdminUserSession
) {
  const db = getDb();
  const updated = await db.globalSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      siteName: input.siteName || DEFAULT_SETTINGS.siteName,
      siteUrl: input.siteUrl || DEFAULT_SETTINGS.siteUrl,
      defaultSeoTitle: input.defaultSeoTitle,
      defaultMetaDescription: input.defaultMetaDescription,
      defaultOgImage: input.defaultOgImage,
      defaultTwitterImage: input.defaultTwitterImage,
      googleAnalyticsId: input.googleAnalyticsId,
      googleAdSenseId: input.googleAdSenseId,
      socialLinks: (input.socialLinks ?? {}) as any,
    },
    update: {
      siteName: input.siteName,
      siteUrl: input.siteUrl,
      defaultSeoTitle: input.defaultSeoTitle,
      defaultMetaDescription: input.defaultMetaDescription,
      defaultOgImage: input.defaultOgImage,
      defaultTwitterImage: input.defaultTwitterImage,
      googleAnalyticsId: input.googleAnalyticsId,
      googleAdSenseId: input.googleAdSenseId,
      socialLinks: (input.socialLinks ?? {}) as any,
    },
  });

  await createAuditLog({
    userId: author.id,
    action: 'UPDATE_SETTINGS',
    entityType: 'SETTINGS',
    entityId: 'default',
    metadata: { siteName: updated.siteName, siteUrl: updated.siteUrl },
  });

  return updated;
}
