// Next.js Config - image domains, env config
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  // Next.js 15 requires explicit app directory configuration
  transpilePackages: ['lucide-react', 'framer-motion'],
  // Tailwind v4 configuration
  webpack: (config: any) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'tailwindcss': 'tailwindcss',
    }
    return config
  },
}

export default nextConfig
