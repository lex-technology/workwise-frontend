/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production'
    return [
      {
        source: '/api/:path*',
        destination: isProd 
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` // Render URL
          : 'http://localhost:8000/api/:path*' // Local development
      }
    ]
  }
}

module.exports = nextConfig
