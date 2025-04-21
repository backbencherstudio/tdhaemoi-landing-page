/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['192.168.4.3'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'antivirus-duck-agricultural-vast.trycloudflare.com',
      },
    ],
  },
}

export default nextConfig
