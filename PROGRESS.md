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

### ⏭ Phase 1 — Content architecture  (NEXT)
- Content Collections + Zod schemas (flashes, glossary, themes) per §5.
- All 33 Flash stubs + fully-authored 21st Flash (İhlas Risalesi).
- Core glossary (~15–20 terms, incl. the 10 seed terms) + starter themes.
- Base-aware data plumbing for source deep links.

## Open decisions / to-confirm later
- Exact erisale English `bookId` + per-section `pageNo` for each Flash (store as data; flag unknowns in `source.note`).
- Whether to enable per-deploy a custom domain later (would change `site`/`base`).
