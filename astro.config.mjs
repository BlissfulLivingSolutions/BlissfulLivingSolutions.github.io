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
