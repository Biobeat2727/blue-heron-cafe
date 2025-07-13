/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://blueheronsamuels.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: '*',
        disallow: ['/admin', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://blueheronsamuels.com/sitemap.xml',
    ],
  },
  // Custom transformation for event pages
  transform: async (config, path) => {
    // Default transformation
    const defaultTransform = {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    };

    // Custom priorities
    if (path === '/') {
      return {
        ...defaultTransform,
        priority: 1.0,
        changefreq: 'weekly',
      };
    }

    if (path === '/menu') {
      return {
        ...defaultTransform,
        priority: 0.9,
        changefreq: 'weekly',
      };
    }

    if (path === '/events') {
      return {
        ...defaultTransform,
        priority: 0.8,
        changefreq: 'daily',
      };
    }

    if (path.startsWith('/events/')) {
      return {
        ...defaultTransform,
        priority: 0.6,
        changefreq: 'weekly',
      };
    }

    return defaultTransform;
  },
};