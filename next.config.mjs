/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.4.3'],
    remotePatterns: [
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '3000',
      // },
      {
        protocol: 'https',
        hostname: 'aymeecel-backend.signalsmind.com',
      },
      {
        protocol: 'https',
        hostname: 'manually-thomson-cure-fundamentals.trycloudflare.com',
      },
      {
        protocol: 'https',
        hostname: 'manually-thomson-cure-fundamentals.trycloudflare.com',
      },

      {
        protocol: 'https',
        hostname: 'date-advanced-electrical-hypothetical.trycloudflare.com',
      },

      
    ],
  },
}

export default nextConfig
