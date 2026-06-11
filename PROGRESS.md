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

### 🔧 Phase 8 — Bug fixes & content pass  (IN PROGRESS)
Tracking the A/B/C work from the maintainer's review brief.

- **A1 — "Mark as read" did nothing — FIXED.** Root cause: `ReadToggle`,
  `ThemeToggle`, `BookmarkToggle` and `NotePanel` each bound their handler via
  `document.currentScript?.previousElementSibling`. Astro bundles these
  `<script>`s as ES modules, where `document.currentScript` is **always `null`**,
  so the element was never found and no handler ever bound. Rebound every
  instance by selector (`querySelectorAll('.read-toggle[data-flash]')` etc.).
  Verified in the built output. The localStorage key scheme was already
  consistent (`flashes:read` via `src/lib/progress.ts`); the index already
  reflects saved state, so it now works end-to-end.
- **A2 — Theme toggle did nothing — FIXED.** Same `currentScript` root cause in
  `ThemeToggle`. The no-flash `<head>` init and the `:root[data-theme=...]` CSS
  tokens were already correct; only the click binding was broken. Confirmed the
  built HTML now binds `querySelectorAll('.theme-toggle')`.
- **A3 — deep links — URL FORMAT was the real bug (now fixed).** erisale
  **ignores `?pageNo=`** and only honours the hash anchor
  `#content.<locale>.<bookId>.<page>` (e.g.
  `…?locale=en&bookId=203#content.en.203.216`). So every link — even the ones
  with a "confirmed" page — was landing on the book start (= the First Flash).
  Converted all stored links (frontmatter + bodies + seed script) to the hash
  form via a one-pass transform; 12 Flashes now deep-link correctly, the rest
  honestly link to the book landing pending a confirmed page. The link-building
  code was already correct (uses each Flash's own source, not index 0).
- *(superseded)* earlier note: `[slug].astro`
  already builds links from the *current* item (`d.source.erisaleUrlEn`), not
  index 0. The "always opens the first Flash" symptom comes from ~20 stub
  Flashes whose `source` URL is the bare `bookId=203` landing (= page 1 = the
  First Flash). Confirmed start pages via erisale's indexed page titles and
  applied: **2→24, 20→208, 24→257** (added to the already-correct
  1, 10, 11, 13, 15, 19, 21, 25, 26). Remaining Flashes still link to the
  landing with a flag — see "Needs your attention" below.
- **A4 — search → official source link — DONE.** Replaced the default Pagefind
  UI with a custom results list built on the Pagefind JS API
  (`/flashes/pagefind/pagefind.js`). Each Flash page now exposes its source deep
  link to the index via `data-pagefind-meta="source[href]"`; every search result
  shows the companion-page link **and**, for Flash results, a prominent
  "Read on the official source →" link to the correct deep link. Keeps `?q=`
  sync, themed styling, AA contrast, and the `<noscript>` fallback. (Search runs
  in `build`/`preview` only — Pagefind indexes at build time.) Verified: page +
  bundle serve 200, metadata captured with correct per-Flash links, dual-link
  markup renders. Note: not browser-click-tested (no headless browser in this
  env) — recommend a quick manual smoke test in `npm run preview`.
- **B — content authoring:** BLOCKED — see network note below. (Maintainer chose
  to pause §B and keep 31–33 as flagged stubs.)
- **C — disclaimer copy consolidation — DONE.** Full disclaimer stays in one
  place (About); a single short footer line is site-wide (`footer.companion`).
  The heavy per-Flash `CompanionNotice` banner is replaced by one quiet cue near
  the source link ("Companion notes — read Nursî's own words at the source →"),
  sourced from the i18n dictionary (`companion.cue`, EN+TR) so it's defined once.
  Lightened the Home lede (disclaimer now carried by footer/About, not repeated).
  Deleted the unused `CompanionNotice` component and its dangling print rule.
- **Redundancy pass (production polish).** A Flash page used to repeat the source
  link / voice-separation ~5×. Now: one prominent "Read on erisale.com →" button
  (top) + one quiet "Read this Flash on erisale.com →" link (bottom) + the global
  footer line; the voice cue is a single non-link caption ("Companion notes — a
  map of the Flash, not Nursî's own words."). Removed the duplicate cue link, the
  "not the text itself" outline sub, the stub-body "companion notes in our own
  words" boilerplate + body source link (32 stubs collapsed to one plain line),
  the 21st's intro/closing source repetition, and the obsolete first-paragraph
  styling. Lightened the glossary intro.

#### ✅ Source-text access is now UNBLOCKED (2026-06-11)
The earlier 403 wall is gone in the current environment. `erisale.com` returns
200, and — decisively — the full **Şükran Vahide English translation** (2009
edition, *The Flashes Collection*, © Sözler Neşriyat) is reachable as a 455-page
PDF and extractable to clean text. The source is now **read** (not paraphrased
from the copyrighted wording) before authoring, per the faithfulness rule.

Also recovered the **authoritative canonical TOC** straight from erisale's own
`sections/sections.en.cache.js`: all 33 Flashes, their titles, order, and start
pages (book 203). Confirms 31/32/33 *do* exist as discrete Flashes (each ~1
page, p456). Per-Flash start pages (erisale TOC `c` value): 1→17, 2→21, 3→30,
4→35, 5→45, 6→45, 7→46, 8→56, 9→58, 10→70, 11→81, 12→95, 13→104, 14→128,
15→142, 16→143, 17→157, 18→188, 19→189, 20→200, 21→213, 22→223, 23→232,
24→254, 25→265, 26→285, 27→336, 28→337, 29→378, 30→392, 31/32/33→456.
**Anchor convention RESOLVED (per maintainer):** deep links must open the
**first page** of each Flash = the erisale TOC `c` value (no +3 offset; the old
2→24 / 21→216 anchors landed several pages *into* the Flash). All 33 Flashes'
`source.erisaleUrlEn` rewritten to `#content.en.203.<c>` and stale "start page
not confirmed / folded / not included" notes corrected from the authoritative
TOC. (Also confirmed from the PDF: the **Fifth Flash's place was left
unoccupied** — its treatise became the Eleventh — so it carries only a brief
note; the 8th & 18th *do* appear in erisale's Flashes at pp. 56 / 188, some
editions placing them in Sikke-i Tasdîk-i Gayb.)

#### 🔬 §10 pilot — Second Flash authored + first review pass applied
Authored **the Second Flash (Job's Prayer in Illness)** to the §7 gold-standard
bar: own-words ~380-word summary, 7-node outline, opening verse (21:83),
`context`, two confident cross-refs (26th & 21st Words, both cited in the text
itself), 8 key concepts. Added 5 new glossary terms — `sabir`, `tevekkul`,
`riza`, `kader`, `gaflet` — and tagged `şükür` with Flash 2.

Maintainer review applied (these become standing rules for the rest):
- **Verses use Sahih International** (`translationSource`), and every Qur'anic
  Arabic is verified against the Uthmani mushaf (api.alquran.cloud). Fixed a real
  error in the 21st Flash: 91:9–10 `زَكّٰيهَا/دَسّٰيهَا` → `زَكَّاهَا/دَسَّاهَا`.
- **Outline no longer auto-numbers** (`[slug].astro`): the CSS counter clashed
  with the source's own "First Point / Second Point" headings ("2. First Point").
  Headings now name themselves.
- **Key-concept popovers no longer spill off-screen** (`TermPopover.astro`):
  replaced absolute placement with viewport-clamped `position: fixed`, computed
  from the trigger rect, flipping above when it would clip the bottom; repositions
  on scroll/resize.

Status `in-review`. `astro check` 0/0/0; build clean (80 pages). Awaiting review
before batch authoring (§9).

#### 📦 Batch 1 — Flashes 1, 3, 4, 5–6, 7 (authored, in-review)
All read in full from the source PDF and authored to the §7 bar (Sahih
International verses, all Arabic verified against the Uthmani mushaf):
- **1 — Jonah's Prayer / Refuge in God Alone:** when causes fail, turn to the
  Causer of Causes; the prayer's three clauses over future, world, soul.
- **3 — "O Eternal One, You Alone Are Eternal":** the cut and the salve; love of
  immortality; the expansion of time. (Carries Nursî's own "not for the scales of
  logic" caveat.)
- **4 — Love for the Prophet's Family:** compassion, the Âl-i Beyt, the
  Sunni–Shi'a Caliphate dispute (described, not adjudicated), and the plea for
  Sunni–Alevi unity. **Flagged sensitive** (`TODO(review)` on framing).
- **5 & 6 — placeholder author's notes:** corrected from the earlier "folded into
  the 29th" claim. The Fifth's treatise became the Eleventh; the Sixth was
  deferred to the end of the Flashes. Short companion notes, no invented content.
- **7 — The Qur'an's News of the Unseen:** seven fulfilled predictions from the
  close of Sūrat al-Fath; the Torah/Gospel likenesses; the 4:68–69 postscript.
- **New glossary terms (6):** `esbab`, `beka`, `al-i-beyt`, `icaz`,
  `ihbar-i-gaybi`, `sahabe`; `appearsIn` updated across reused terms.
- `astro check` 0/0/0; build clean (86 pages); all key-concept popovers resolve.

**Lowest-confidence / flags for review:**
- **Flash 4** sectarian framing — the most delicate piece in the batch; please
  check the neutrality of the Caliphate-dispute summary.
- **Reading-time estimates** are rough (1–12 min); normalise to your preferred
  scale if wanted.
- **Descriptive titles** added throughout ("The Nth Flash — Subject"); flag if
  you'd rather keep bare titles.

**Remaining stubs (after batch 1):** 8, 9, 10, 12, 14, 16, 17, 18, 22, 23, 27,
28, 29, 30, 31–33.

#### 🛠 Popover fix + 📦 Batch 2 — Flashes 8, 9, 10, 12, 14 (authored, in-review)
- **Key-concept popover bug fixed:** a `<button>` fires `focusin` (and on touch
  `mouseenter`) *before* `click`, so the auto-open handlers opened the panel and
  the click handler then toggled it closed — tapping a term did nothing. Made it
  **click/tap-only** (keyboard-accessible via the button's click; Escape /
  outside-click still close).
- **8 — published elsewhere:** honest one-line note (it lives in *Sikke-i
  Tasdîk-i Gaybî*, not reproduced in full here); no content invented.
- **9 — Unity of Existence:** respectful critique of vahdetü'l-vücud
  (Ibn al-ʿArabi); mirror-and-sun; "all from Him, not all Him"; the sober Unity
  of Witnessing. **Flagged sensitive** (contested Sufi doctrine).
- **10 — Compassionate Slaps:** autobiographical; the "şefkat tokadı" pattern and
  why friends are corrected here while opponents' reckoning is deferred.
- **12 — Provision & cosmology:** guaranteed rızık (inverse to power/will); the
  seven heavens/earths as layered universal meaning (argued in the science of his
  day — noted as such).
- **14 — Mysteries of "In the Name of God":** First Station (the Bull-and-Fish
  Hadith; the People of the Cloak) + the beloved Bismillah treatise (six
  mysteries, divine mercy, ehadiyet within vahidiyet). First Station again
  touches the early-Caliphate question — described, not adjudicated.
- **New glossary terms (7):** `vahdet-i-vucud`, `vahdet-i-suhud`, `tecelli`,
  `keramet`, `rizik`, `rahmet`, `ehadiyet`; `appearsIn` updated across reused
  terms. All verses Sahih International, Arabic verified.
- `astro check` 0/0/0; build clean (93 pages); all popovers resolve.

**Flags:** 9 and 14's First Station touch contested theological/sectarian ground
— handled descriptively, attributed to Nursî, flagged `TODO(review)`. 12's
cosmology rests on period science (ether), framed as such.

**Remaining stubs:** 16, 17, 18, 22, 23, 27, 28, 29, 30, 31–33.

#### Page numbers — RESOLVED
All 33 start pages now come from erisale's authoritative TOC (`c` values, listed
above) and link to each Flash's first page. The earlier "unconfirmed starts"
list and the 10th/1st-Flash page questions are closed (10→70, 1→17).

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
