/**
 * Tiny bilingual client-side search over the JSON index emitted by
 * `/search-index.json` (see src/pages/search-index.json.ts). Each document
 * carries both English and Turkish fields; `searchDocs` picks the right language
 * and `linkWithBase` builds the right locale URL.
 */
export type Doc = {
  type: 'flash' | 'term' | 'theme';
  title: string;
  titleTr?: string;
  url: string; // base-relative route, e.g. "/flashes/21/"
  body: string;
  bodyTr?: string;
  number?: number;
  source?: string | null;
  sourceTr?: string | null;
};

export type Locale = 'en' | 'tr';
export type Hit = {
  type: Doc['type'];
  title: string;
  url: string;
  source?: string | null;
  score: number;
  excerptHtml: string;
};

let cache: Doc[] | null = null;
let inflight: Promise<Doc[]> | null = null;

/** Fetch (and memoise) the search index. Returns [] if it can't be loaded. */
export async function loadIndex(base: string): Promise<Doc[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch(`${base}search-index.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Doc[]>) : []))
      .then((d) => (cache = d))
      .catch(() => (cache = []));
  }
  return inflight;
}

/** Prefix a base-relative route with the deploy base path and locale. */
export function linkWithBase(base: string, url: string, locale: Locale = 'en'): string {
  const route = locale === 'tr' ? `/tr${url}` : url;
  return `${base.replace(/\/$/, '')}${route.startsWith('/') ? route : `/${route}`}`;
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));
const escRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function searchDocs(
  docs: Doc[],
  query: string,
  opts: { locale?: Locale; limit?: number } = {}
): Hit[] {
  const locale = opts.locale ?? 'en';
  const limit = opts.limit ?? 20;
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const hits: Hit[] = [];

  for (const d of docs) {
    const title = (locale === 'tr' ? d.titleTr ?? d.title : d.title) || d.title;
    const body = (locale === 'tr' ? d.bodyTr ?? d.body : d.body) || d.body;
    const tl = title.toLowerCase();
    const bl = body.toLowerCase();
    let score = 0;
    let all = true;
    for (const t of tokens) {
      const inTitle = tl.includes(t);
      const inBody = bl.includes(t);
      if (!inTitle && !inBody) {
        all = false;
        break;
      }
      score += (inTitle ? 6 : 0) + (inBody ? 1 : 0);
      if (tl.startsWith(t)) score += 4;
    }
    if (!all) continue;
    if (tl.includes(q) || bl.includes(q)) score += 3;
    hits.push({
      type: d.type,
      title,
      url: d.url,
      source: locale === 'tr' ? d.sourceTr ?? d.source : d.source,
      score,
      excerptHtml: excerpt(body, tokens),
    });
  }

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return hits.slice(0, limit);
}

function excerpt(body: string, tokens: string[]): string {
  const lower = body.toLowerCase();
  let pos = -1;
  for (const t of tokens) {
    const i = lower.indexOf(t);
    if (i >= 0 && (pos < 0 || i < pos)) pos = i;
  }
  const start = pos < 0 ? 0 : Math.max(0, pos - 60);
  let snippet = body.slice(start, start + 180);
  if (start > 0) snippet = `…${snippet}`;
  if (start + 180 < body.length) snippet = `${snippet}…`;
  let html = esc(snippet);
  for (const t of tokens) {
    html = html.replace(new RegExp(`(${escRe(t)})`, 'ig'), '<mark>$1</mark>');
  }
  return html;
}
