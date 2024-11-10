/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    async rewrites() {
        return [
          {
            source: '/sitemap.xml',
            destination: '/api/sitemap',
          },
        ]
      },
};

export default nextConfig;
