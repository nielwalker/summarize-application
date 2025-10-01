/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  // Disable static optimization for API routes
  trailingSlash: false,
  // Ensure API routes are not treated as pages
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Disable static generation for API routes
  output: 'standalone',
  // Skip build-time data fetching for API routes
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

module.exports = nextConfig
