import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.pinimg.com', 'res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
