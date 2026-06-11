import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/**
 * Content collections for the companion. Per the project's non-negotiables,
 * none of this is the source text — it is our original structural/editorial
 * data (outlines, essences, glossary, themes) plus deep links to the official
 * text on erisale.com.
 *
 * For `flashes`, the Markdown body IS the companion summary (rendered), so the
 * schema below covers only the structured frontmatter.
 */

const verse = z.object({
  arabic: z.string(),
  translationEn: z.string(),
  reference: z.string(), // e.g. "Qur'an 8:46"
  translationSource: z.string(), // e.g. "Sahih International" or "project's own rendering"
});

const outlineNode = z.object({
  id: z.string(),
  heading: z.string(),
  note: z.string().optional(), // 1–2 line companion gloss (our analysis)
  sourcePageRef: z.string().url().optional(), // erisale deep link for this section, if known
});

const crossRef = z.object({
  work: z.string(),
  ref: z.string(),
  note: z.string().optional(),
});

const flashes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/flashes' }),
  schema: z.object({
    number: z.number().int().min(1).max(33),
    title: z.string(), // English
    titleTr: z.string().optional(),
    essence: z.string(), // one-line English summary (companion)
    themes: z.array(z.string()).default([]), // theme slugs
    keyConcepts: z.array(z.string()).default([]), // glossary slugs
    context: z
      .object({
        writtenWhere: z.string().optional(),
        writtenWhen: z.string().optional(),
        note: z.string().optional(),
      })
      .optional(),
    openingVerses: z.array(verse).optional(),
    outline: z.array(outlineNode).default([]),
    crossRefs: z.array(crossRef).optional(),
    readingTimeMin: z.number().optional(),
    source: z.object({
      erisaleUrlEn: z.string().url(),
      erisaleUrlTr: z.string().url().optional(),
      note: z.string().optional(),
    }),
    special: z
      .object({
        fifteenDayReminder: z.boolean().optional(),
      })
      .optional(),
    status: z.enum(['complete', 'in-review', 'stub']).default('stub'),
  }),
});

const glossary = defineCollection({
  loader: file('src/content/glossary.yaml'),
  schema: z.object({
    id: z.string(), // slug
    term: z.string(), // transliteration, e.g. "tefânî"
    arabic: z.string().optional(),
    definitionEn: z.string(),
    definitionTr: z.string().optional(),
    relatedTerms: z.array(z.string()).default([]), // glossary slugs
    appearsIn: z.array(z.number().int()).default([]), // flash numbers
  }),
});

const themes = defineCollection({
  loader: file('src/content/themes.yaml'),
  schema: z.object({
    id: z.string(), // slug
    name: z.string(),
    description: z.string(),
  }),
});

export const collections = { flashes, glossary, themes };
