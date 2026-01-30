import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const internal = (process.env.INTERNAL_API_URL ?? '').trim();
    const publicBase = (process.env.NEXT_PUBLIC_API_URL ?? '').trim();
    const apiBase = internal || publicBase || 'http://localhost:8080';

    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
