/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.4.3'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'https',
        hostname: 'backend.feetf1rst.tech',
      },
    ],
  },
}

export default nextConfig
