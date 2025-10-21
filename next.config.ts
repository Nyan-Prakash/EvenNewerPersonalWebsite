// next.config.ts
const isProd = process.env.NODE_ENV === 'production'
const repo = 'EvenNewerPersonalWebsite' // <-- YOUR REPO NAME
const customDomain = 'www.nyanprakash.com' // set to '' to serve from repo-name.github.io/<repo>

const hasCustomDomain = Boolean(customDomain)
const basePath = isProd && !hasCustomDomain ? `/${repo}` : ''
const assetPrefix = isProd && !hasCustomDomain ? `/${repo}/` : ''

export default {
  output: 'export',
  basePath,
  assetPrefix,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_CUSTOM_DOMAIN: customDomain,
  },
  images: { unoptimized: true },
  trailingSlash: true, // helps with GH Pages + static export
}
