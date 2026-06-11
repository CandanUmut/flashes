# Build Prompt — "The Flashes: A Companion" (Risale-i Nur · Lem'alar)

> Paste this entire document into Claude Code as the project brief. **Do not start coding yet.** Read §0 first — you must propose a plan and wait for my approval before writing any code, and stop for my review after every phase.

---

## 0. How we work together (read this first)

- This is a **production** build, not a throwaway MVP. Plan for the whole application.
- Work in **phases**. Before writing any code, produce: (a) the full phase plan, (b) a list of any clarifying questions or risks, (c) the exact tech decisions you'll make. Then **STOP and wait for my approval.**
- After completing **each phase**: stop, write a short summary of what changed, tell me exactly how to preview/run it locally and what to look at, then **wait for my review and direction** before starting the next phase. Never roll into the next phase automatically.
- Maintain a `PROGRESS.md` at the repo root: current phase, what's done, what's next, open decisions. Update it at the end of every phase so state survives across sessions.
- Keep commits small and well-described. One logical change per commit.
- When unsure about anything that touches faithfulness to the source text, copyright, or theology, **ask me rather than guess.**

---

## 1. What we're building and why

A **companion / study guide** website for **Lem'alar ("The Flashes")** by Bediüzzaman Said Nursî — one of the books of the Risale-i Nur collection. The audience is **English-speaking readers** who want to understand, navigate, search, and remember this dense work.

Critical framing: **this is NOT a reader/host of the book.** We do **not** host or reproduce the copyrighted text or its English translation. The actual reading happens on the **official source (erisale.com)**, which we deep-link to. Our site is the **map, the outline, the summaries, the glossary, the concept index, the search, and the reading-progress layer** that sits *around* the original and sends the reader to it.

The whole product is original work (our summaries, glossary, structure, tools), legally clean, and built with adab (reverence) toward a sacred/scholarly text.

Primary language: **English.** Secondary (nice-to-have, scaffold but don't block on it): **Turkish.**

Working title: **"The Flashes — A Companion"** (renameable; expose it as one config value).

---

## 2. Non-negotiable constraints

These override convenience. If a feature conflicts with one of these, drop the feature.

1. **Never host or reproduce the Risale-i Nur text or any copyrighted translation** — not full text, not paragraphs, not "just one quote" from a translation. The original Turkish is under copyright in Turkey until ~end of 2030; the English translations (e.g., Şükran Vahide / Sözler Publications) are separately and currently copyrighted. We **link out** to the official source instead.
2. **Strict separation of voices.** Our companion summaries/notes must never be presented as Nursî's words. Every Flash page must visibly state that our content is a companion aid and that the actual text is read at the official source, with a prominent link.
3. **Not a "simplified Risale."** Frame everything as *companion notes / study aid*, never as an easy or modernized version of the text (this is a sensitive issue in the community — avoid the "sadeleştirme" perception entirely).
4. **Faithfulness over cleverness.** Companion summaries describe and map the text; they do not editorialize, issue rulings, or extrapolate beyond it. Cite the specific Flash/section. Mark anything uncertain.
5. **Qur'anic verses:** Arabic text is fine. For English meanings, use only a clearly open/permitted translation **or our own plain rendering**, and attribute the source in a `translationSource` field. Never paste a copyrighted translation.
6. **Privacy-first:** no accounts, no backend, no analytics, no third-party tracking, no ads. All personal data (progress, bookmarks, notes) lives in `localStorage` only.
7. **Accessibility and performance are part of "done,"** not polish (see §11).
8. **Licensing:** code under **MIT**; our original content under **CC BY-SA 4.0**. A disclaimer must state we don't own/redistribute the Risale text and link to official sources.

---

## 3. Tech stack & infrastructure

- **Astro** (latest), **TypeScript**, static output (`output: 'static'`) — no SSR, no server runtime.
- **Astro Content Collections** with **Zod** schemas for all content (see §5).
- **Hosting: GitHub Pages** (project page). Configure `astro.config.mjs` `site` and `base` correctly for a project subpath, and make **every internal link base-aware** (use Astro's `import.meta.env.BASE_URL` / `<a href={...}>` helpers). This is a common footgun — get it right early and add a note in README.
- **Search: Pagefind** (static, client-side, zero-backend). Prefer the `astro-pagefind` integration; index only our companion content (summaries, outlines, glossary, concepts) — never the source text. Wire indexing into the production build.
- **Deployment: GitHub Actions** → GitHub Pages (official Astro Pages workflow). Build must run the Pagefind step before deploy.
- **Personalization: `localStorage` only**, accessed in client-side Astro islands (hydrate on client to avoid static-HTML mismatch). No SSR of user state.
- **i18n:** use Astro's i18n routing. English is the default and only required locale; scaffold Turkish as a second locale but it may ship empty/partial.
- No CSS framework required; hand-write a small token-based CSS system (see §8). Tailwind is acceptable only if it doesn't bloat the reading pages — your call, justify it.
- Fonts: self-host or use Google Fonts with `display=swap`. Ensure full Turkish glyph coverage (ş ğ ı İ ç ö ü).

---

## 4. Information architecture

Routes (English shown; Turkish mirrors under `/tr/`):

- `/` — **Home.** Honest one-paragraph explanation of what this is (a companion, not the book). Four entry points: Browse the Flashes, Glossary, Search, Continue reading. "Nur/light" hero. Clear link to the official source.
- `/flashes/` — **Index of all 33 Flashes.** Card grid: number, title, one-line essence, theme tags, read-status. Filter by theme. The 21st Flash (İhlas Risalesi) carries a "read every 15 days" badge.
- `/flashes/[slug]/` — **Single Flash (the heart).** Sections: header (number, title, essence, context, est. reading time, prominent **"Read the full text on erisale.com →"**); structural **outline** (clickable, each node deep-links to the matching official page where known); **companion summary** (clearly labeled); **key concepts** (linked to glossary); **opening verses** (if any); **cross-references**; personal tools (mark read, bookmark, notes).
- `/glossary/` — searchable term list. `/glossary/[slug]/` — term page: definition, Arabic root, related terms, "appears in" Flash links.
- `/themes/` and `/themes/[slug]/` — thematic index / concept navigation across Flashes.
- `/search/` — global search over companion content (Pagefind UI).
- `/about/` — project intention, faithfulness principles, copyright/disclaimer, how to contribute, links to official sources, license.

---

## 5. Content model (define as Zod schemas in content collections)

```ts
// collection: "flashes"
Flash = {
  number: number;            // 1–33
  slug: string;
  title: string;             // English
  titleTr?: string;
  essence: string;           // one-line English summary
  themes: string[];          // theme slugs
  keyConcepts: string[];     // glossary slugs
  context?: { writtenWhere?: string; writtenWhen?: string; note?: string };
  openingVerses?: {
    arabic: string;
    translationEn: string;
    reference: string;       // e.g. "Qur'an 8:46"
    translationSource: string; // e.g. "project's own rendering" or an open translation
  }[];
  outline: {                 // structural map (our analysis, not the text)
    id: string;
    heading: string;
    note?: string;           // 1–2 line companion gloss, optional
    sourcePageRef?: string;  // erisale deep link to this section if known
  }[];
  summary: string;           // markdown; companion summary, clearly companion
  crossRefs?: { work: string; ref: string; note?: string }[];
  readingTimeMin?: number;
  source: {                  // official text deep links
    erisaleUrlEn: string;
    erisaleUrlTr?: string;
    note?: string;
  };
  special?: { fifteenDayReminder?: boolean };
  status: "complete" | "in-review" | "stub";
};

// collection: "glossary"
GlossaryTerm = {
  slug: string;
  term: string;              // transliteration, e.g. "tefânî"
  arabic?: string;
  definitionEn: string;      // short, plain
  definitionTr?: string;
  relatedTerms: string[];    // glossary slugs
  appearsIn: number[];       // flash numbers
};

// collection: "themes"
Theme = { slug: string; name: string; description: string };
```

erisale deep-link pattern (confirm exact English `bookId` for The Flashes during build): `https://www.erisale.com/?locale=en&bookId=<id>&pageNo=<n>`. Store the URL per Flash as data so it's trivial to fill/correct. If the exact English book/page mapping can't be confirmed for a given Flash, link to the official Flashes landing page and flag it in `source.note`.

---

## 6. Seed content

Create all **33 Flash entries** at minimum as `status: "stub"` (number, slug, title, a short essence, theme tags, and a `source` link). Then fully author the **21st Flash (İhlas Risalesi)** as `status: "complete"` to set the quality bar and prove the schema. Use the following as accurate, faithfully-paraphrased companion data for the 21st Flash (this is our own wording, not the translation):

- **Essence:** Sincerity (ihlas) — doing every act for God's pleasure alone, purified of show, ego, and worldly reward.
- **Note:** Nursî asked that this Flash be read at least once every fifteen days.
- **Opening verses (Arabic + our rendering + reference):**
  - وَلَا تَنَازَعُوا فَتَفْشَلُوا وَتَذْهَبَ رِيحُكُمْ — "Do not dispute, or you will lose heart and your strength will depart." (Qur'an 8:46)
  - وَقُومُوا لِلّٰهِ قَانِتِينَ — "Stand before God in devout obedience." (Qur'an 2:238)
  - قَدْ اَفْلَحَ مَنْ زَكّٰيهَا وَقَدْ خَابَ مَنْ دَسّٰيهَا — "He who purifies the soul has succeeded; he who corrupts it has failed." (Qur'an 91:9–10)
  - وَلَا تَشْتَرُوا بِاٰيَاتِى ثَمَنًا قَلِيلًا — "Do not sell My signs for a small price." (Qur'an 2:41)
- **Outline:** (1) Why sincerity is the most important foundation of otherworldly service; (2) Three things that break sincerity — rivalry from material gain; love of status / desire for fame (which Nursî calls "hidden shirk," i.e. riya); fear and greed; (3) Four principles to win and protect sincerity — (i) seek only God's pleasure in your work; (ii) do not criticize your brothers or provoke envy by showing off virtue; (iii) know that all your strength is in truth and sincerity; (iv) take grateful pride in your brothers' merits as if your own (tefânî — self-effacement among brothers); (4) Two protectors — contemplation of death (rabıta-i mevt) and awareness of God's presence (huzur); (5) The secret of shared reward (iştirak-i a'mal) — illustrated by the lamp and the needle analogies; with true sincerity and unity, the whole collective light enters each person's record.
- **Key concepts (seed glossary):** ihlas, riya, uhuvvet, tefânî, şahs-ı manevî, tûl-i emel, enaniyet, rabıta-i mevt, iştirak-i a'mal, hubb-u câh.
- **Summary:** author a faithful companion summary in our own words, ~250–400 words, clearly labeled as a companion aid, ending with a link to the official text.

Also seed the **core glossary** (~15–20 recurring Risale terms, starting with the ten above) and a starter set of **themes** (e.g., sincerity, brotherhood, the self/ego, death & the hereafter, knowledge of God, the Qur'an).

---

## 7. Features (production scope)

- **Flashes index** with theme filter and read-status indicators.
- **Single Flash page** as specified in §4, including clickable outline with per-section deep links where available, and the prominent official-source link.
- **Glossary** with term pages, related-term graph (simple links is fine), and inline term references on Flash pages (tap/hover to reveal a short definition popover that links to the full term page; keyboard-accessible).
- **Theme/concept index** for cross-Flash navigation.
- **Search** (Pagefind) over companion content with a clean results page.
- **Personalization (localStorage):** mark-as-read, bookmarks, short personal notes per Flash, "continue where you left off" on Home, and a **15-day reminder/tracker for the 21st Flash** (gentle, never gamified into points). Include a clear "reset my data" control and a one-line privacy note ("stored only on this device").
- **Light + dark mode**, both first-class; default to system preference, with a manual toggle persisted in localStorage.
- **Print stylesheet** for Flash pages (clean, ink-saving), echoing the companion card style.

---

## 8. Design system

Carry a calm, luminous, dignified aesthetic — the "Flash / lamp / nur (light)" motif is the brand, grounded in the subject itself. Avoid generic AI defaults (no cream+serif+terracotta template, no acid-green-on-black, no broadsheet hairline columns).

- **Typography:** Display = **Cormorant Garamond** (used with restraint for titles); Body = **Spectral** (literary, screen-readable, full Turkish coverage); Arabic = **Amiri**; small UI labels may use a clean sans (e.g., Inter). Set an intentional type scale with `clamp()`.
- **Color tokens (define both modes):**
  - Dark: bg `#15132a`, surface `#1c1939`, text `#ECE6D8`, muted `#a9a1b8`, gold accent `#E0B458`, hairline `rgba(224,180,88,.2)`.
  - Light: bg `#F7F3EA`, surface `#FFFFFF`, text `#1E1B2E`, muted `#6b6478`, gold accent `#9c7322` (darkened for contrast), hairline `rgba(28,25,57,.12)`.
- **Signature element:** a recurring thin **"gleam" divider** (a gold gradient hairline that brightens at center, like light) and a subtle radial glow behind page titles. Spend boldness here; keep everything else quiet.
- **Motion:** restrained — a gentle load fade and soft hover lift on cards/outline nodes. Respect `prefers-reduced-motion`.
- **Layout:** single-column reading width (~`680–720px`), generous vertical rhythm, mobile-first (assume the reader is on a phone).
- Reverent tone in all copy; no marketing voice. Plain, specific, humble.

---

## 9. Editorial rules for any companion text you write

- Write summaries/notes **in your own words**; never paraphrase so closely that it reproduces the translation's wording.
- Foreground the original: every Flash page links prominently to the official source and states the companion is an aid.
- Cite the specific Flash (and section, when relevant). Describe; don't extrapolate, rule, or preach.
- For Qur'anic verses: Arabic ok; English meaning only from an open/permitted translation or our own rendering, with `translationSource` set.
- Mark uncertainty rather than inventing. When a theological nuance is at stake, leave a `TODO(review)` and surface it to me.

---

## 10. Repository & deployment

- `README.md`: what this is, the companion framing, how to run/build, GitHub Pages base-path note, how to add/correct a Flash or glossary term, links to official sources.
- `LICENSE` (MIT, code) and `CONTENT-LICENSE` (CC BY-SA 4.0, content). Disclaimer file: we do not own or redistribute the Risale-i Nur text; all rights to the original and its translations belong to their holders; we link to official sources.
- `CONTRIBUTING.md`: editorial principles from §9, review expectation for content changes, how to propose corrections.
- `.github/workflows/deploy.yml`: Astro build + Pagefind + deploy to GitHub Pages.
- `PROGRESS.md`: living state (per §0).

---

## 11. Quality floor / definition of done (every phase)

- Responsive from 320px up; no horizontal scroll; touch targets ≥ 44px.
- Keyboard accessible; visible focus states; semantic HTML; ARIA only where needed; popovers dismissible by keyboard.
- Color contrast ≥ WCAG AA in both modes.
- `prefers-reduced-motion` respected.
- Fast: static, no layout shift, fonts swap gracefully, Lighthouse perf/a11y/SEO in the 90s.
- No console errors/warnings. TypeScript strict, no `any` without reason.
- All internal links base-aware (work on GitHub Pages project subpath).
- Builds cleanly with `astro build` and the Pagefind step.

---

## 12. Suggested phase plan (refine and propose your own, then wait for approval)

- **Phase 0 — Scaffolding:** Astro+TS, static config with correct `site`/`base`, GitHub Actions → Pages pipeline, design tokens + fonts + light/dark, layout shell, header/footer, README/LICENSE/CONTENT-LICENSE/disclaimer, PROGRESS.md. Deliverable: a deployable empty shell live on Pages.
- **Phase 1 — Content architecture:** content collections + Zod schemas (flashes, glossary, themes), all 33 Flash stubs + full 21st Flash, core glossary + starter themes, base-aware data plumbing.
- **Phase 2 — Reading/companion pages:** Flashes index (with theme filter + read-status), single Flash page (header, clickable outline with deep links, summary, concepts, verses, cross-refs, official-source link). Fully responsive + accessible.
- **Phase 3 — Glossary & themes:** glossary list/term pages, inline term popovers on Flash pages, theme index pages, cross-linking.
- **Phase 4 — Search:** Pagefind integration over companion content + results page.
- **Phase 5 — Personalization:** localStorage progress, bookmarks, notes, continue-reading, 15-day reminder for the 21st Flash, reset control, privacy note. Light/dark toggle persistence.
- **Phase 6 — i18n:** English/Turkish routing scaffold; English complete, Turkish structured (may be partial).
- **Phase 7 — Production hardening:** accessibility audit, performance/SEO pass, print styles, content-backfill workflow + contribution docs, final review.

---

## 13. Your first action

Do **not** write code yet. Respond with:
1. Your refined phase plan (adjust the above as you see fit, with reasoning for any changes).
2. Any clarifying questions or risks (especially around the erisale English `bookId`/page mapping, fonts, and base-path).
3. The concrete tech decisions you'll lock in.

Then wait for my approval before starting Phase 0.
