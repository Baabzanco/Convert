import type { NextConfig } from 'next';

if (process.argv.includes('build')) {
  (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
