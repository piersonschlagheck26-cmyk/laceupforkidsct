/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Disable API routes completely
  async rewrites() {
    return []
  },
  // Additional redirects as backup
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: '/',
        permanent: false,
      },
    ]
  },
  // Error handling
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig

