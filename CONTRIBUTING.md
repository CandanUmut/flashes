# Contributing

Thank you for helping improve this companion. Because this project sits around a
sacred/scholarly text, **faithfulness matters more than speed or cleverness.**
Please read the editorial principles below before proposing content changes.

## Editorial principles (non-negotiable)

These come straight from the project's purpose. A change that conflicts with one
of these will not be merged, however well-written.

1. **Never reproduce the source text or a translation.** Not the full text, not
   paragraphs, not "just one quote" from a translation. We link out to
   [erisale.com](https://www.erisale.com/?locale=en) instead.
2. **Strict separation of voices.** Our notes are a companion aid in our own
   words. Never present them as Nursî's words. Every Flash page must keep its
   prominent link to the official text and its companion-aid notice.
3. **Not a "simplified Risale."** Frame everything as study notes, never as an
   easier or modernised version of the text.
4. **Faithfulness over cleverness.** Summaries describe and map the text; they do
   not editorialise, issue rulings, or extrapolate beyond it. Cite the specific
   Flash (and section, when relevant).
5. **Write in your own words.** Never paraphrase so closely that it reproduces a
   translation's wording.
6. **Qur'anic verses.** Arabic is fine. For English meanings, use a clearly
   open/permitted translation or our own plain rendering, and set
   `translationSource` to the source. Never paste a copyrighted translation in
   full.
7. **Mark uncertainty, don't invent.** When a theological nuance is at stake,
   leave a `TODO(review)` in the content and flag it in your pull request rather
   than guessing.

## How content is structured

Content lives in `src/content/` as data validated by Zod schemas
(`src/content.config.ts`):

- **`flashes`** — one entry per Flash (1–33). Fields include `number`, `slug`,
  `title`, `essence`, `themes`, `keyConcepts`, `outline`, `summary`,
  `openingVerses`, `crossRefs`, and `source` (the official deep links).
- **`glossary`** — recurring Risale terms with plain definitions.
- **`themes`** — thematic groupings used to cross-link the Flashes.

## Proposing a change

### Correcting an official-source link

The most valuable correction: confirming the exact erisale English `bookId` and
per-section `pageNo` for a Flash. If a link currently points to the Flashes
landing page with a `source.note` flag, replacing it with a confirmed deep link
is very welcome. Cite how you confirmed it.

### Adding or revising a Flash summary

1. Set `status` appropriately (`stub` → `in-review` → `complete`).
2. Keep summaries ~250–400 words, in your own words, clearly a companion aid.
3. End with the official-source link.
4. Open a pull request describing your sources and any `TODO(review)` items.

### Adding a glossary term

Provide `term` (transliteration), optional `arabic`, a short plain
`definitionEn`, `relatedTerms`, and the Flash numbers it `appearsIn`.

## Review expectation

Content changes are reviewed for faithfulness, not just prose quality. Expect
questions about sourcing and wording. That's the point — it protects the
integrity of the companion.
