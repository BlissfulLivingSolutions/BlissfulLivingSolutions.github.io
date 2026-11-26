// @ts-check
import { defineConfig, envField } from 'astro/config'
import sitemap from '@astrojs/sitemap'

const SITE = 'https://www.blissfullivingsolutions.com'

// Sitemap <lastmod> per page. Bump a page's date (YYYY-MM-DD) whenever its
// content changes — this keeps Google's crawl scheduling accurate.
const LASTMOD = {
  '/': '2026-11-25',
  '/privacy-policy': '2026-11-26',
}

export default defineConfig({
  site: SITE,

  // Pages build to dist/<name>.html and are linked without a trailing slash
  // (/privacy-policy). Both GitHub Pages and Cloudflare serve that form directly.
  build: { format: 'file' },
  trailingSlash: 'never',

  // Keep the HTML whitespace exactly as written. Astro 7's default ('jsx')
  // strips whitespace between inline elements, which would change the layout.
  compressHTML: false,

  vite: {
    build: {
      // Vite 8 defaults to Safari/iOS 16.4+, which lets the CSS minifier emit
      // media-query range syntax (width>=1024px) and drop -webkit- prefixes.
      // Older iPhones/iPads — common with our audience — would then lose the
      // whole responsive layout. These are the targets the site was built for
      // before (Vite 5's defaults).
      target: ['chrome87', 'edge88', 'firefox78', 'safari14', 'ios14'],
      cssTarget: ['chrome87', 'edge88', 'firefox78', 'safari14', 'ios14'],
    },
  },

  env: {
    schema: {
      // GA4 Measurement ID (G-XXXXXXXXXX). Optional: when it is absent, the gtag
      // tag, the cookie banner and all event tracking are silently disabled.
      PUBLIC_GA_MEASUREMENT_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
    },
  },

  integrations: [
    sitemap({
      filter: (page) => !/\/404(\.html)?$/.test(page),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/'
        const date = LASTMOD[/** @type {keyof typeof LASTMOD} */ (path)]
        return date ? { ...item, lastmod: date } : item
      },
    }),
  ],
})
