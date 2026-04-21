// Next.js Config - Turbopack enabled, image domains, env config
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbo: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  // Next.js 15 requires explicit app directory configuration
  transpilePackages: ['lucide-react'],
}

export default nextConfig
