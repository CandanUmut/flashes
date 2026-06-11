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

### ⏭ Phase 2 — Reading/companion pages  (NEXT)
- Flashes index (`/flashes/`): card grid (number, title, essence, theme tags, read-status placeholder), theme filter, 15-day badge on the 21st.
- Single Flash page (`/flashes/[slug]/`): header (number, title, essence, context, est. time, prominent erisale link), clickable outline with deep links, companion summary (rendered), key concepts, opening verses (Arabic + translation + source), cross-refs, `CompanionNotice`.
- Fully responsive + accessible; quality floor (§11) per page.

## ⚠️ Needs your attention (faithfulness)
- **Flashes 31–33:** the Vahide collection's contents run to the 30th Flash; I could not confirm reliable subjects for 31–33, so they are honest stubs with `TODO(review)` notes and neutral essences (no invented subjects). Please advise on their correct subjects/status, or whether the collection should present only 1–30 as discrete Flashes.
- **Flashes 24 (veiling):** authored as a neutral, descriptive stub essence given the sensitivity; flag if you want different framing.

## Open decisions / to-confirm later
- Remaining exact erisale `pageNo` values for Flashes without a confirmed start page (currently flagged in `source.note`); these are a clean contribution task.
- Whether to enable a custom domain later (would change `site`/`base`).
- Slugs are numeric (`/flashes/21/`); revisit if descriptive slugs are wanted.
