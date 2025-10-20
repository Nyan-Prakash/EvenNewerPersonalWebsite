
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 👈 Required for static export
  basePath: '/EvenNewerPersonalWebsite',
  assetPrefix: '/EvenNewerPersonalWebsite',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;

export default nextConfig
