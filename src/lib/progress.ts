/**
 * Reading-progress store — localStorage only, no backend (brief §2.6).
 * Everything here runs in the browser. Guard every access: localStorage can
 * throw (private mode, disabled cookies) and must never break the page.
 *
 * Phase 2 uses read-status (mark/unmark read). Bookmarks, notes,
 * continue-reading and the 15-day tracker build on the same keys in Phase 5.
 */

export const KEYS = {
  read: 'flashes:read', // JSON array of flash numbers
  theme: 'flashes:theme', // 'light' | 'dark' (set in BaseLayout/ThemeToggle)
  lastRead: 'flashes:lastRead', // { number, slug, at } — continue reading
} as const;

function readNumberSet(key: string): Set<number> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((n): n is number => typeof n === 'number'));
  } catch {
    return new Set();
  }
}

function writeNumberSet(key: string, set: Set<number>): void {
  try {
    localStorage.setItem(key, JSON.stringify([...set].sort((a, b) => a - b)));
  } catch {
    /* storage unavailable — silently no-op */
  }
}

export function getReadFlashes(): Set<number> {
  return readNumberSet(KEYS.read);
}

export function isRead(n: number): boolean {
  return getReadFlashes().has(n);
}

/** Toggle read state for a flash number; returns the new state. */
export function toggleRead(n: number): boolean {
  const set = getReadFlashes();
  let nowRead: boolean;
  if (set.has(n)) {
    set.delete(n);
    nowRead = false;
  } else {
    set.add(n);
    nowRead = true;
  }
  writeNumberSet(KEYS.read, set);
  return nowRead;
}

export function setRead(n: number, value: boolean): void {
  const set = getReadFlashes();
  if (value) set.add(n);
  else set.delete(n);
  writeNumberSet(KEYS.read, set);
}
