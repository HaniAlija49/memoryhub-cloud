import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Externalize large native packages from serverless bundle (Next.js 16+)
  serverExternalPackages: ['sharp', 'onnxruntime-node', '@xenova/transformers'],

  // Empty turbopack config to silence webpack warning
  turbopack: {},

  // Optimize for Vercel deployment
  output: 'standalone',
};

export default nextConfig;
