import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // imagens
  images: {
    remotePatterns: [
      new URL('https://revalife-files.s3.us-east-2.amazonaws.com/**'),
    ],
  },
};

export default nextConfig;
