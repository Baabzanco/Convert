import type { NextConfig } from 'next';

function sanitizeEnvVar(value?: string, prefix?: string): string | undefined {
  if (!value) return undefined;
  let val = value.trim();
  if (prefix && val.startsWith(prefix)) {
    val = val.substring(prefix.length).trim();
  }
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.substring(1, val.length - 1).trim();
  }
  return val || undefined;
}

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = sanitizeEnvVar(process.env.DATABASE_URL, 'DATABASE_URL=') || process.env.DATABASE_URL;
}

if (process.env.ADMIN_JWT_SECRET) {
  process.env.ADMIN_JWT_SECRET = sanitizeEnvVar(process.env.ADMIN_JWT_SECRET, 'JWT_SECRET=') || process.env.ADMIN_JWT_SECRET;
}

if (process.argv.includes('build')) {
  (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
