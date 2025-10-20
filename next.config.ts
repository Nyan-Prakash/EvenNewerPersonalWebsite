// next.config.ts
const isProd = process.env.NODE_ENV === 'production'
const repo = 'EvenNewerPersonalWebsite' // <-- YOUR REPO NAME

export default {
  output: 'export',
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  images: { unoptimized: true },
  trailingSlash: true, // helps with GH Pages + static export
}
