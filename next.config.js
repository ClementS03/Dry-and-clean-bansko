/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization — add external domains here if needed
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  // Compression
  compress: true,
  // Trailing slash for cleaner URLs
  trailingSlash: false,
  // Power header
  poweredByHeader: false,
}

module.exports = nextConfig
