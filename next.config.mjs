/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['three'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
