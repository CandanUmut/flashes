/**
 * Personalization store — localStorage only, no backend (brief §2.6).
 * Everything here runs in the browser. Every access is guarded: localStorage
 * can throw (private mode, disabled storage) and must never break the page.
 */

export const KEYS = {
  read: 'flashes:read', // number[]
  bookmarks: 'flashes:bookmarks', // number[]
  notes: 'flashes:notes', // Record<number, string>
  theme: 'flashes:theme', // 'light' | 'dark' (BaseLayout/ThemeToggle)
  lastRead: 'flashes:lastRead', // LastRead — continue reading
  ihlasReadAt: 'flashes:ihlasReadAt', // ISO date string — 21st Flash tracker
} as const;

export const IHLAS_FLASH = 21;
export const IHLAS_INTERVAL_DAYS = 15;

export interface LastRead {
  number: number;
  slug: string;
  title: string;
  at: string; // ISO timestamp
}

/* ---------- low-level helpers ---------- */

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — silently no-op */
  }
}

function readNumberSet(key: string): Set<number> {
  const arr = readJson<unknown>(key, []);
  if (!Array.isArray(arr)) return new Set();
  return new Set(arr.filter((n): n is number => typeof n === 'number'));
}

function writeNumberSet(key: string, set: Set<number>): void {
  writeJson(key, [...set].sort((a, b) => a - b));
}

function toggleInSet(key: string, n: number): boolean {
  const set = readNumberSet(key);
  let now: boolean;
  if (set.has(n)) {
    set.delete(n);
    now = false;
  } else {
    set.add(n);
    now = true;
  }
  writeNumberSet(key, set);
  return now;
}

/* ---------- read status ---------- */

export function getReadFlashes(): Set<number> {
  return readNumberSet(KEYS.read);
}
export function isRead(n: number): boolean {
  return getReadFlashes().has(n);
}
export function toggleRead(n: number): boolean {
  const now = toggleInSet(KEYS.read, n);
  if (n === IHLAS_FLASH && now) markIhlasReadToday();
  return now;
}
export function setRead(n: number, value: boolean): void {
  const set = getReadFlashes();
  if (value) set.add(n);
  else set.delete(n);
  writeNumberSet(KEYS.read, set);
}

/* ---------- bookmarks ---------- */

export function getBookmarks(): Set<number> {
  return readNumberSet(KEYS.bookmarks);
}
export function isBookmarked(n: number): boolean {
  return getBookmarks().has(n);
}
export function toggleBookmark(n: number): boolean {
  return toggleInSet(KEYS.bookmarks, n);
}

/* ---------- notes ---------- */

export function getAllNotes(): Record<number, string> {
  const obj = readJson<Record<string, string>>(KEYS.notes, {});
  const out: Record<number, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') out[Number(k)] = v;
  }
  return out;
}
export function getNote(n: number): string {
  return getAllNotes()[n] ?? '';
}
export function setNote(n: number, text: string): void {
  const notes = getAllNotes();
  const trimmed = text.trim();
  if (trimmed) notes[n] = text;
  else delete notes[n];
  writeJson(KEYS.notes, notes);
}

/* ---------- continue reading ---------- */

export function setLastRead(entry: LastRead): void {
  writeJson(KEYS.lastRead, entry);
}
export function getLastRead(): LastRead | null {
  const v = readJson<LastRead | null>(KEYS.lastRead, null);
  if (v && typeof v.number === 'number' && typeof v.slug === 'string') return v;
  return null;
}

/* ---------- 21st Flash (İhlas) 15-day tracker ---------- */

export function markIhlasReadToday(): void {
  try {
    localStorage.setItem(KEYS.ihlasReadAt, new Date().toISOString());
  } catch {
    /* no-op */
  }
}
export function getIhlasReadAt(): Date | null {
  try {
    const raw = localStorage.getItem(KEYS.ihlasReadAt);
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}
/** Whole days since the 21st Flash was last marked read, or null if never. */
export function daysSinceIhlas(): number | null {
  const at = getIhlasReadAt();
  if (!at) return null;
  const ms = Date.now() - at.getTime();
  return Math.floor(ms / 86_400_000);
}
/** Days remaining until the next 15-day reading is due (can be negative = overdue). */
export function ihlasDaysRemaining(): number | null {
  const since = daysSinceIhlas();
  return since === null ? null : IHLAS_INTERVAL_DAYS - since;
}

/* ---------- reset ---------- */

export function resetAll(): void {
  for (const key of Object.values(KEYS)) {
    if (key === KEYS.theme) continue; // keep the visual theme preference
    try {
      localStorage.removeItem(key);
    } catch {
      /* no-op */
    }
  }
}
