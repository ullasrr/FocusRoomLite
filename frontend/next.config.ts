import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/themes/**',
      },
    ],
  },
  /* config options here */
  reactStrictMode: false
};

export default nextConfig;
