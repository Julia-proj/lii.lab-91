/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
