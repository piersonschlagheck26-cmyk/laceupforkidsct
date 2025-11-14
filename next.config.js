/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  // Ensure all routes are properly handled
  async rewrites() {
    return []
  },
  // Redirect any /api/* requests to home to prevent 404s
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: '/',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig

