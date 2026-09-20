import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/country/', '/privacy', '/terms'],
        disallow: ['/dashboard/', '/api/', '/login', '/onboarding'],
      },
    ],
    sitemap: 'https://abroadsimplified.com/sitemap.xml',
  };
}
