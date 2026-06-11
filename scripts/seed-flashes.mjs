/**
 * One-time seed generator for the 33 Flash stub entries.
 *
 * Subjects/titles are taken from the table of contents of the Şükran Vahide
 * translation of "The Flashes" (Sözler, 2009). Essences are written in our own
 * words (companion aids), never copied from the translation.
 *
 * erisale (bookId=203) start pages are filled where independently confirmed;
 * where not, the link points to the Flashes book and `source.note` flags it as
 * pending confirmation (see CONTRIBUTING.md).
 *
 * Safe to re-run: it never overwrites an existing file (so the hand-authored
 * 21.md and any edited stubs are preserved).
 *
 *   node scripts/seed-flashes.mjs
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'content', 'flashes');

/** Confirmed erisale (bookId=203) start pages, by Flash number. */
const erisalePage = { 1: 18, 10: 80, 11: 82, 13: 127, 15: 142, 19: 189, 21: 216, 25: 265, 26: 312 };

const erisaleUrl = (n) =>
  erisalePage[n]
    ? `https://www.erisale.com/?locale=en&bookId=203&pageNo=${erisalePage[n]}`
    : 'https://www.erisale.com/?locale=en&bookId=203';

const PENDING_NOTE =
  'Exact erisale start page not yet confirmed — links to The Flashes (bookId 203). Help us pin it: see CONTRIBUTING.md.';

/**
 * data: [number, title, essence, themes[], keyConcepts[], extra?]
 * extra may include: { note, status }
 */
const data = [
  [1, 'The First Flash',
    "The Prophet Jonah's supplication from within the fish, the night and the sea — and why his cry of pure need belongs to every believer in distress.",
    ['the-quran', 'knowledge-of-god'], []],
  [2, 'The Second Flash',
    "The patient prayer of the Prophet Job, expounded in five points as a remedy and consolation for those struck by illness and affliction.",
    ['trials-and-illness', 'the-quran'], ['sefkat']],
  [3, 'The Third Flash',
    "Two truths drawn from 'Everything will perish save His countenance' — the passing world set against the One who remains, in the cry 'O Eternal One, You are the Eternal!'",
    ['transience', 'knowledge-of-god'], []],
  [4, 'The Fourth Flash',
    "The question of the Imamate and the long dispute between Sunnis and Shi'a, approached through the highway of the Prophet's practice and two Qur'anic verses.",
    ['prophetic-sunna'], ['sunnet']],
  [5, 'The Fifth Flash',
    "Incorporated into the Twenty-Ninth Flash; it is not printed as a separate piece in this collection.",
    [], [], { note: 'Per the source collection, the Fifth Flash is included within the Twenty-Ninth Flash.' }],
  [6, 'The Sixth Flash',
    "Incorporated into the Twenty-Ninth Flash; it is not printed as a separate piece in this collection.",
    [], [], { note: 'Per the source collection, the Sixth Flash is included within the Twenty-Ninth Flash.' }],
  [7, 'The Seventh Flash',
    "Seven foretellings of the Unseen drawn from the closing verses of Sūrat al-Fath, presented as one facet of the Qur'an's inimitability.",
    ['the-quran'], []],
  [8, 'The Eighth Flash',
    "Published in Sikke-i Tasdîk-i Gayb (The Ratifying Stamp of the Unseen) rather than in the main Flashes collection.",
    [], [], { note: 'Published in Sikke-i Tasdîk-i Gayb; not included in the present Flashes collection.' }],
  [9, 'The Ninth Flash',
    "Replies to four questions from a student — touching prophetic lineage, the doctrine of the Unity of Existence (wahdat al-wujūd), and related matters.",
    ['knowledge-of-god'], []],
  [10, 'The Tenth Flash',
    "Fourteen 'compassionate blows' — small misfortunes read as merciful warnings to those who serve the Qur'an when human nature leads them to slip.",
    ['trials-and-illness'], ['sefkat']],
  [11, 'The Eleventh Flash',
    "Eleven points on following the Prophet's Sunna as a stairway of guidance, and as the antidote to the sickness of innovation (bid'a).",
    ['prophetic-sunna'], ['sunnet', 'bidat']],
  [12, 'The Twelfth Flash',
    "Two Qur'anic verses questioned by science — that all provision comes directly from God, and that the earth, like the heavens, has 'seven levels.'",
    ['the-quran', 'knowledge-of-god'], []],
  [13, 'The Thirteenth Flash',
    "Thirteen indications unfolding the meaning of seeking refuge in God from Satan — the reality of evil, temptation, and the path of resistance.",
    ['belief'], []],
  [14, 'The Fourteenth Flash',
    "Two stations: principles for rightly understanding certain hadiths, and the six mysteries of 'In the name of God, the Most Merciful, the Most Compassionate.'",
    ['the-quran', 'prophetic-sunna'], ['besmele']],
  [15, 'The Fifteenth Flash',
    "An index to the earlier Risale-i Nur volumes — The Words, the Letters, and the Flashes (first through fifteenth) — rather than a treatise of its own.",
    [], [], { note: 'Reference/index material; included in the relevant volumes rather than as a standalone treatise.' }],
  [16, 'The Sixteenth Flash',
    "Concise answers to several questions put to the author — about his conduct under persecution and about a few disputed points.",
    [], []],
  [17, 'The Seventeenth Flash',
    "Fifteen 'Notes' from the author's early reflections — brief, dense meditations on belief, the ego, and the transient world.",
    ['knowledge-of-god', 'the-self'], ['enaniyet']],
  [18, 'The Eighteenth Flash',
    "Published in Sikke-i Tasdîk-i Gayb and in some editions of The Flashes rather than in the main collection.",
    [], [], { note: 'Published in Sikke-i Tasdîk-i Gayb; not included in the present Flashes collection.' }],
  [19, 'The Nineteenth Flash',
    "Seven points on frugality and gratitude — moderate, thankful use of provision as a form of worship, set against waste and excess.",
    ['gratitude-and-frugality'], ['iktisat', 'sukur']],
  [20, 'The Twentieth Flash',
    "A first treatise on sincerity: seven causes that breed discord among those who serve the truth, and how to guard against them.",
    ['sincerity', 'brotherhood'], ['ihlas', 'riya']],
  [22, 'The Twenty-Second Flash',
    "Three indications answering questions put about the author and his work.",
    [], []],
  [23, 'The Twenty-Third Flash',
    "The Treatise on Nature — a sustained refutation of attributing creation to 'nature,' chance or causes, establishing the necessity of a single Creator.",
    ['belief'], ['tevhid', 'iman']],
  [24, 'The Twenty-Fourth Flash',
    "On the Qur'anic injunction concerning the veiling of women, argued in four points.",
    [], []],
  [25, 'The Twenty-Fifth Flash',
    "Twenty-five 'remedies' offering consolation and perspective to the sick, reframing illness within divine mercy and wisdom.",
    ['trials-and-illness'], ['sefkat']],
  [26, 'The Twenty-Sixth Flash',
    "Twenty-six 'Hopes' — consolations for old age drawn from the author's own life, turning the losses of age toward hope in God.",
    ['trials-and-illness', 'death-and-the-hereafter'], ['rabita-i-mevt']],
  [27, 'The Twenty-Seventh Flash',
    "The author's defence speeches from the Eskişehir trials, gathered among the Flashes.",
    [], []],
  [28, 'The Twenty-Eighth Flash',
    "A collection of short pieces written during the author's imprisonment in Eskişehir.",
    [], []],
  [29, 'The Twenty-Ninth Flash',
    "On reflective thought (tefekkür); the included chapter unfolds, in seven degrees, the meaning disclosed by the phrase 'God is Most Great.'",
    ['knowledge-of-god'], ['tefekkur', 'marifetullah']],
  [30, 'The Thirtieth Flash',
    "Six 'points,' each unfolding one of the divine names that bear the Greatest Name — among them the All-Holy, the All-Just, and the Self-Subsistent.",
    ['divine-names', 'knowledge-of-god'], ['divine-names', 'marifetullah', 'tevhid']],
  [31, 'The Thirty-First Flash',
    "Companion outline in preparation. Read the original on the official source.",
    [], [], { note: 'TODO(review): subject and place within the collection to be confirmed before authoring an essence.' }],
  [32, 'The Thirty-Second Flash',
    "Companion outline in preparation. Read the original on the official source.",
    [], [], { note: 'TODO(review): subject and place within the collection to be confirmed before authoring an essence.' }],
  [33, 'The Thirty-Third Flash',
    "Companion outline in preparation. Read the original on the official source.",
    [], [], { note: 'TODO(review): subject and place within the collection to be confirmed before authoring an essence.' }],
];

const block = (key, text, indent = '') =>
  `${indent}${key}: >-\n${indent}  ${text.trim()}\n`;

const arr = (key, items) =>
  items.length ? `${key}: [${items.join(', ')}]\n` : `${key}: []\n`;

let written = 0;
let skipped = 0;
mkdirSync(OUT, { recursive: true });

for (const [n, title, essence, themes, concepts, extra = {}] of data) {
  const file = join(OUT, `${n}.md`);
  if (existsSync(file)) {
    skipped++;
    continue;
  }
  const note = extra.note ?? (erisalePage[n] ? undefined : PENDING_NOTE);
  const status = extra.status ?? 'stub';

  let fm = '---\n';
  fm += `number: ${n}\n`;
  fm += `title: "${title.replace(/"/g, '\\"')}"\n`;
  fm += block('essence', essence);
  fm += arr('themes', themes);
  fm += arr('keyConcepts', concepts);
  fm += 'source:\n';
  fm += `  erisaleUrlEn: ${erisaleUrl(n)}\n`;
  if (note) fm += block('note', note, '  ');
  fm += `status: ${status}\n`;
  fm += '---\n\n';

  const body =
    `These are companion notes in our own words — a map of the Flash, not its text.\n\n` +
    `A fuller outline and summary for this Flash are in preparation. In the meantime, ` +
    `read the original on the official source:\n\n` +
    `**[${title} on erisale.com →](${erisaleUrl(n)})**\n`;

  writeFileSync(file, fm + body, 'utf8');
  written++;
}

console.log(`Seed complete: ${written} written, ${skipped} skipped (already existed).`);
