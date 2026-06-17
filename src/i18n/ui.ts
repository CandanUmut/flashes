/**
 * Lightweight i18n. English is the default and complete locale; Turkish is a
 * scaffold (chrome + Home + About translated; content routes English for now).
 *
 * Routing uses Astro i18n with `prefixDefaultLocale: false`, so English lives at
 * the root and Turkish under `/tr/`.
 */
import { withBase } from '@lib/paths';

export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/**
 * Logical paths that have a Turkish twin page. The Flashes index and every
 * single-Flash page now exist under /tr/, so they switch in place; other
 * sections (glossary, themes) fall back to the other locale's home for now.
 */
function hasTwin(logical: string): boolean {
  if (['/', '/about/', '/flashes/', '/glossary/', '/themes/'].includes(logical)) return true;
  // Single Flash, glossary term and theme pages all have Turkish twins.
  return /^\/(flashes|glossary|themes)\/[^/]+\/$/.test(logical);
}

type Dict = Record<string, string>;

const ui: Record<Locale, Dict> = {
  en: {
    'brand.companion': 'A Companion',
    'nav.flashes': 'The Flashes',
    'nav.glossary': 'Glossary',
    'nav.themes': 'Themes',
    'nav.search': 'Search',
    'nav.about': 'About',
    'skip.toContent': 'Skip to content',
    'lang.switch': 'Türkçe',
    'lang.label': 'Language',
    // One quiet caption shown on Flash pages near the source link (not a banner,
    // not a link — the source button sits right above it).
    'companion.cue': 'Companion notes — a map of the Flash, not Nursî’s own words.',
    'footer.companion':
      'An independent companion and study aid — not the Risale-i Nur itself. Read the original on the official source,',
    'footer.aboutIntent': 'About & intention',
    'footer.copyright': 'Copyright & disclaimer',
    'footer.officialSource': 'Official source',
    'footer.license':
      'Code: MIT · Original companion content: CC BY-SA 4.0. All rights to the Risale-i Nur and its translations belong to their holders.',
  },
  tr: {
    'brand.companion': 'Bir Rehber',
    'nav.flashes': 'Lem’alar',
    'nav.glossary': 'Sözlük',
    'nav.themes': 'Temalar',
    'nav.search': 'Ara',
    'nav.about': 'Hakkında',
    'skip.toContent': 'İçeriğe geç',
    'lang.switch': 'English',
    'lang.label': 'Dil',
    'companion.cue': 'Rehber notları — Lem’a’nın bir haritası, Nursî’nin kendi sözleri değil.',
    'footer.companion':
      'Bağımsız bir rehber ve çalışma aracı — Risale-i Nur’un kendisi değildir. Aslını resmî kaynaktan okuyun:',
    'footer.aboutIntent': 'Hakkında & niyet',
    'footer.copyright': 'Telif & sorumluluk reddi',
    'footer.officialSource': 'Resmî kaynak',
    'footer.license':
      'Kod: MIT · Özgün rehber içeriği: CC BY-SA 4.0. Risale-i Nur ve tercümelerine ait tüm haklar sahiplerine aittir.',
  },
};

/** Translate a key for a locale, falling back to English then the key itself. */
export function t(locale: Locale, key: string): string {
  return ui[locale]?.[key] ?? ui.en[key] ?? key;
}

/** Determine the active locale from a URL (base-aware). */
export function getLocale(url: URL): Locale {
  const base = import.meta.env.BASE_URL;
  let p = url.pathname;
  if (p.startsWith(base)) p = p.slice(base.length);
  p = p.replace(/^\/+/, '');
  return p === 'tr' || p.startsWith('tr/') ? 'tr' : 'en';
}

/** The locale-independent logical path, e.g. "/about/" (no base, no locale prefix). */
export function logicalPath(url: URL): string {
  const base = import.meta.env.BASE_URL;
  let p = url.pathname;
  if (p.startsWith(base)) p = p.slice(base.length);
  if (!p.startsWith('/')) p = `/${p}`;
  // strip a leading /tr
  p = p.replace(/^\/tr(\/|$)/, '/');
  if (!p.endsWith('/')) p = `${p}/`;
  return p;
}

/** Build a base-aware href for a logical path in a given locale. */
export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return withBase(locale === 'en' ? clean : `/tr${clean}`);
}

/**
 * hreflang alternates for the current page. Returns links only for pages that
 * exist in both locales (Home, About); other pages get just their canonical.
 */
export function localeAlternates(url: URL): { hreflang: string; path: string }[] {
  const logical = logicalPath(url);
  if (!hasTwin(logical)) return [];
  return [
    { hreflang: 'en', path: localePath(logical, 'en') },
    { hreflang: 'tr', path: localePath(logical, 'tr') },
    { hreflang: 'x-default', path: localePath(logical, 'en') },
  ];
}

/** Where the language switch should point for the current page. */
export function languageSwitchTarget(url: URL): { locale: Locale; href: string } {
  const current = getLocale(url);
  const other: Locale = current === 'en' ? 'tr' : 'en';
  const logical = logicalPath(url);
  // If the page has no twin in the other locale, fall back to that locale's home.
  const target = hasTwin(logical) ? logical : '/';
  return { locale: other, href: localePath(target, other) };
}
