// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Project-page deployment on GitHub Pages.
// site + base must be correct for every internal link to resolve on the subpath.
// See README "GitHub Pages base-path" note.
export default defineConfig({
  site: 'https://candanumut.github.io',
  base: '/flashes/',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', tr: 'tr' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  build: {
    // Emit pretty directory URLs (e.g. /flashes/21/ -> /flashes/21/index.html)
    format: 'directory',
  },
});
