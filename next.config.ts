import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/storage/:path*',
          destination: 'https://whqqammiamoajavokauw.supabase.co/storage/:path*'
        }
      ]
    }
  }
};

export default nextConfig;
