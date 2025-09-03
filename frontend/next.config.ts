// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // matches http://localhost:8000/...
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      // matches http://localhost/... (no explicit port)
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      // common aliases that might appear in Docker/WSL
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'host.docker.internal',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
