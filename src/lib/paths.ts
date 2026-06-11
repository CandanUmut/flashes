/**
 * Base-aware URL helpers.
 *
 * On GitHub Pages this site lives at a subpath (`/flashes/`), so EVERY internal
 * link must be prefixed with `import.meta.env.BASE_URL`. Route all internal hrefs
 * through `withBase()` rather than hand-writing leading-slash paths — that is the
 * single most common reason a project-page deploy 404s.
 */

const BASE = import.meta.env.BASE_URL; // e.g. "/flashes/"

/**
 * Join the configured base path with an internal path.
 * `withBase('/glossary/')` -> `/flashes/glossary/`
 * `withBase('flashes/21')` -> `/flashes/flashes/21/` is avoided — leading/trailing
 * slashes are normalized so callers can pass either form.
 */
export function withBase(path = ''): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE; // strip trailing slash
  const rel = path.startsWith('/') ? path : `/${path}`;
  // collapse any accidental double slashes in the relative part
  const cleaned = rel.replace(/\/{2,}/g, '/');
  return `${base}${cleaned}` || '/';
}

/** True if `href` points to the current page (compares normalized pathnames). */
export function isActive(href: string, currentPath: string): boolean {
  const norm = (p: string) => (p.endsWith('/') ? p : `${p}/`);
  return norm(currentPath) === norm(href);
}
