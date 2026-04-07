/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/images/**',
      },
    ],
    remotePatterns: [
      // Vercel Blob Storage (service images uploaded via admin)
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      // Google OAuth profile avatars
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
