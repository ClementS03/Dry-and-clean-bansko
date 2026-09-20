/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization — add external domains here if needed
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images aggressively (1 year)
    minimumCacheTTL: 31536000,
  },
  // Next 16 ajoute sa propre section a CLAUDE.md a chaque demarrage.
  // Le fichier est ecrit a la main et tenu a jour, on refuse la generation.
  agentRules: false,
  // Compression
  compress: true,
  // Trailing slash for cleaner URLs
  trailingSlash: false,
  // Power header
  poweredByHeader: false,
  // Strip the console.* calls from the client bundle in production (smaller JS, less TBT)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  // Tree-shake large icon/animation libs so only used exports ship to the client
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

module.exports = nextConfig
