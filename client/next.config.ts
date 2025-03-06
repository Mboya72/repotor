import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'], // Allow Cloudinary domain for next/image
  },
};

export default nextConfig;
