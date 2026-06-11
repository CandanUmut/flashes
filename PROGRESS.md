# Progress

Living state for "The Flashes — A Companion". Updated at the end of each phase.

## Working agreement
- Building autonomously through the phases; stopping only for **big decisions**
  (copyright / theology / faithfulness, or anything hard to reverse).
- One logical change per commit. Quality floor (§11) treated as a per-phase gate.

## Locked decisions
- **Deploy:** GitHub Pages project page. `site: https://candanumut.github.io`, `base: /flashes/`. Repo `candanumut/flashes`.
- **Stack:** Astro 5 + TS strict, `output: 'static'`. Hand-written CSS tokens (no Tailwind). Self-hosted fonts via `@fontsource`.
- **Search:** `astro-pagefind`, companion content only.
- **i18n:** EN default + TR routing scaffold; TR data fields where faithful wording exists.
- **Qur'anic verses:** Sahih International, treated as limited attributed quotation of individual verses (`translationSource: "Sahih International"`), per-verse and trivially swappable. (User's editorial call, recorded.)

---

## Phase status

### ✅ Phase 0 — Scaffolding & deploy spine  (DONE)
- Astro 5 + TS strict, `output: 'static'`, `site`/`base` configured for `/flashes/`.
- Base-aware link helper (`src/lib/paths.ts` → `withBase()` / `isActive()`); verified all built links carry `/flashes/`.
- Design tokens (`src/styles/tokens.css`) — full light + dark palettes, fluid type scale, spacing, motion, gleam divider, radial title glow.
- Global stylesheet, self-hosted fonts (Cormorant Garamond, Spectral, Amiri, Inter) via `@fontsource` with Turkish + Arabic subsets.
- Layout shell: `BaseLayout` (no-flash theme script, meta/OG), `Header` (sticky nav + brand), `Footer` (companion + license notice), `ThemeToggle` (persisted light/dark), `CompanionNotice` (reusable voice-separation banner), `GleamDivider` via `.gleam`.
- Pages: Home (honest intro + 4 entry points + source link), About (intention, faithfulness principles, **copyright/disclaimer**, privacy, license), and stub index pages for /flashes /glossary /themes /search.
- Docs/legal: `README` (with base-path note), `LICENSE` (MIT, pre-existing), `CONTENT-LICENSE` (CC BY-SA 4.0), `DISCLAIMER.md`, `CONTRIBUTING.md` (editorial rules), this `PROGRESS.md`.
- CI/CD: `.github/workflows/deploy.yml` — Astro build (+ Pagefind via integration) → GitHub Pages.
- `astro check`: 0 errors / 0 warnings. `astro build`: clean, Pagefind indexed 6 pages.

**Preview locally:** `npm install && npm run dev` → open `http://localhost:4321/flashes/`.
Toggle the theme (top-right); check Home → About; confirm nav links work.

### ✅ Phase 1 — Content architecture  (DONE)
- `src/content.config.ts`: Zod schemas + loaders for **flashes** (glob markdown; body = companion summary), **glossary** (`file()` YAML), **themes** (`file()` YAML).
- All **33 Flash entries** created. 21st Flash (İhlâs Risâlesi) fully authored (`status: complete`) — opening verses (Sahih International), 5-node outline, ~380-word companion summary, fifteen-day reminder flag. Remaining 32 generated as stubs via `scripts/seed-flashes.mjs` (idempotent, never overwrites).
- Subjects/titles for Flashes 1–30 taken from the Vahide TOC; essences written in our own words. 5/6 noted as folded into the 29th; 8/18 noted as published in Sikke-i Tasdîk-i Gayb.
- Confirmed erisale (bookId=203) start pages baked in: 1→18, 10→80, 11→82, 13→127, 15→142, 19→189, 21→216, 25→265, 26→312. Unconfirmed ones link to the book landing with a `source.note` flag.
- Core **glossary**: 22 terms (the 10 seed terms + iman, tevhid, marifetullah, tefekkür, esmâ-i hüsnâ, sünnet, bid'at, iktisâd, şükür, şefkat, besmele, nefis) with Arabic, plain definitions, related terms, `appearsIn`.
- **Themes**: 12 starter themes.
- `astro check`: 0/0/0. `astro build`: clean, content syncs.

**Preview:** content isn't surfaced in pages yet (that's Phase 2). To inspect, open the `.md`/`.yaml` files under `src/content/`. `npm run check` validates all of it against the schemas.

### ✅ Phase 2 — Reading/companion pages  (DONE)
- **Flashes index** (`/flashes/`): responsive card grid (number, title, essence, theme chips, 15-day badge, status badge), client-side **theme filter** (accessible buttons, aria-pressed, empty state), **read-status** dots (reads localStorage). `FlashCard` component.
- **Single Flash page** (`/flashes/[slug]/`): header (no., title, TR title, essence, est. read time, context, prominent gold **erisale source button**, **mark-as-read** toggle), 15-day notice on the 21st, `CompanionNotice` banner, **opening verses** (Arabic RTL + translation + source attribution), clickable **outline** (deep-links where `sourcePageRef` set), rendered **companion summary**, **key concepts** (→ glossary), **cross-refs**, theme chips, footer source link + **prev/next** nav.
- New components: `FlashCard`, `OpeningVerses`, `ReadToggle`. New lib: `progress.ts` (localStorage read-status store, fully guarded).
- 39 pages build clean; Pagefind indexed 39; all internal links base-aware (verified `/flashes/flashes/21/`, concept/theme deep links). `astro check`: 0/0/0.
- Note: concept/theme links currently point to `/glossary/#slug` and `/themes/#slug` (index anchors). Phase 3 upgrades these to dedicated term/theme pages.

### ✅ Phase 3 — Glossary & themes  (DONE)
- **Glossary index** (`/glossary/`): alphabetised term cards with a live filter box (term/slug/definition), id anchors, line-clamped previews.
- **Term pages** (`/glossary/[slug]/`): term, Arabic, definition (+TR), **related terms** (bidirectional — includes incoming links), **"appears in"** Flash links.
- **Themes index** (`/themes/`): theme cards with per-theme Flash counts (sorted by count), id anchors.
- **Theme pages** (`/themes/[slug]/`): description, count, FlashCard grid of member Flashes (with read-status).
- **Inline term popovers** on Flash pages (`TermPopover`): hover/tap/focus reveals a short definition + link to the full term page. Single delegated controller; click-outside and **Escape** close (Escape returns focus to trigger); `aria-expanded`/`aria-controls`/`role="dialog"`.
- Upgraded Flash-page concept links → glossary term pages, theme chips → theme pages.
- 73 pages build clean (6 + 33 + 22 + 12); Pagefind indexed 73; `astro check` 0/0/0. Verified 10 popovers on the 21st Flash and all cross-links resolve.

### ✅ Phase 4 — Search  (DONE)
- `/search/` uses `astro-pagefind`'s `Search` component, themed to our design tokens (both modes); bundle correctly base-pathed to `/flashes/pagefind/`.
- Header/Footer marked `data-pagefind-ignore`; search page self-excluded — only companion content is indexed (we host no source text regardless).
- `?q=` query param syncs into the box so searches are linkable; `<noscript>` fallback with base-aware links.
- 73 fragments indexed at build. **Note:** search only works in `build`/`preview`, not `dev` (Pagefind indexes at build time).

### ✅ Phase 5 — Personalization  (DONE)
- `progress.ts` expanded: read-status, **bookmarks**, **per-Flash notes**, **continue-reading** (`lastRead`), **15-day İhlas tracker** (`ihlasReadAt`), and `resetAll()`. All access guarded.
- Flash page personal tools: `ReadToggle`, `BookmarkToggle`, `NotePanel` (debounced autosave + "Saved ✓" + flush on unload). Visiting a Flash records continue-reading. Marking the 21st read stamps the İhlas tracker.
- `IhlasReminder` (gentle, non-gamified): on Home (invitation + "I read it today") and on the 21st Flash page (compact tracker: days since / due / overdue).
- Home "Continue reading" entry rewrites client-side to the last-read Flash.
- Flash cards show **read dot + bookmark star**, reflected on the index and theme pages.
- About → privacy: `ResetData` control (confirm dialog, clears all on-device data, keeps theme) + one-line privacy note.
- 73 pages build clean; `astro check` 0/0/0.

### ✅ Phase 6 — i18n scaffold  (DONE)
- `src/i18n/ui.ts`: locales, `t()` dictionary (EN + TR chrome), `getLocale`/`logicalPath`/`localePath`/`languageSwitchTarget`. `@i18n` path alias added.
- **Bilingual chrome**: Header + Footer localize labels/links by URL locale; `LanguageSwitch` in the header (EN↔TR, falls back to the other locale's home when a page has no twin).
- **Turkish pages**: `/tr/` Home and `/tr/about/` — fully translated (our own copy), honest note that the English companion is complete while Turkish content is in progress; TR content-section links point to the (English) reading routes for now.
- Data already carries `titleTr`/`definitionTr` (e.g. 21st Flash) for future TR content.
- 75 pages build clean; `astro check` 0/0/0. Verified `lang="tr"`, localized nav, and switch targets both directions.
- **Partial by design** (per brief): TR translations of the Flash/glossary/theme content routes are future work; chrome + Home + About demonstrate the routing.

### ✅ Phase 7 — Production hardening  (DONE)
- **SEO**: `@astrojs/sitemap` (i18n-aware, base-correct `sitemap-index.xml`); per-page **canonical** + **OG/Twitter** tags; **hreflang** alternates (en/tr/x-default) on twinned pages (`localeAlternates`).
- **Print stylesheet** (`print.css`): drops chrome/toggles/notes/search, near-black on white, prints the official-source **URL** after the link, keeps outline/verses/cards from breaking across pages, full-width reading measure.
- **A11y audit**: landmarks (banner/main/contentinfo) + labelled nav; visible focus ring; semantic heading order; popover gains **focus open + focus-out close** (plus click/hover/Escape); buttons use `aria-pressed`; search/notes labelled.
- **Contrast (AA)**: measured the palette; light-mode gold `#9c7322` was ~3.87:1 as text/button — **darkened to `#8a6410`** (~4.8:1) to clear AA §11 (dark mode ~9.5:1). Deliberate, brief-aligned (§8 marked it "darkened for contrast"); trivially revertible in `tokens.css`.
- Smoke-tested the production build via `preview`: all key routes + the Pagefind bundle return 200.
- 75 pages, `astro check` 0/0/0, clean build with Pagefind + sitemap.

---

## 🎉 All phases complete
The companion is production-ready and deployable. To ship: push `main` →
GitHub Actions builds (Astro + Pagefind + sitemap) and deploys to
`https://candanumut.github.io/flashes/`. Enable Pages → "GitHub Actions" as the
source in the repo settings once.

### Remaining content work (not blockers — documented for follow-up)
- Confirm erisale `pageNo` for Flashes without a verified start page (flagged in each `source.note`).
- Decide subject/status for **Flashes 31–33** (currently honest `TODO(review)` stubs).
- Author full companion summaries for the remaining stubs (the 21st sets the bar).
- Optional: extend Turkish from chrome+Home+About to the content routes.

## ⚠️ Needs your attention (faithfulness)
- **Flashes 31–33:** the Vahide collection's contents run to the 30th Flash; I could not confirm reliable subjects for 31–33, so they are honest stubs with `TODO(review)` notes and neutral essences (no invented subjects). Please advise on their correct subjects/status, or whether the collection should present only 1–30 as discrete Flashes.
- **Flashes 24 (veiling):** authored as a neutral, descriptive stub essence given the sensitivity; flag if you want different framing.

## Open decisions / to-confirm later
- Remaining exact erisale `pageNo` values for Flashes without a confirmed start page (currently flagged in `source.note`); these are a clean contribution task.
- Whether to enable a custom domain later (would change `site`/`base`).
- Slugs are numeric (`/flashes/21/`); revisit if descriptive slugs are wanted.
