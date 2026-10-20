// Wiki Proverb — MVP client
// Loads the seed corpus and provides search, theme browse, and detail modal.

const LANG_LABEL = {
  en: 'English',
  el: 'Greek',
  es: 'Spanish',
  ar: 'Arabic',
  zh: 'Mandarin',
  ja: 'Japanese',
  ko: 'Korean',
  ru: 'Russian',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  tr: 'Turkish',
  fa: 'Persian',
  hi: 'Hindi',
  he: 'Hebrew',
  sw: 'Swahili',
  yo: 'Yoruba',
  pl: 'Polish',
  nl: 'Dutch',
  sv: 'Swedish',
  fi: 'Finnish',
  ga: 'Irish',
  yi: 'Yiddish',
  vi: 'Vietnamese',
  th: 'Thai',
  id: 'Indonesian',
  hu: 'Hungarian',
  cs: 'Czech',
  ro: 'Romanian',
};
// Native names for the language filter
const NATIVE_NAME = {
  en: 'English',
  el: 'Ελληνικά',
  es: 'Español',
  ar: 'العربية',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ru: 'Русский',
  fr: 'Français',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  tr: 'Türkçe',
  fa: 'فارسی',
  hi: 'हिन्दी',
  he: 'עברית',
  sw: 'Kiswahili',
  yo: 'Yorùbá',
  pl: 'Polski',
  nl: 'Nederlands',
  sv: 'Svenska',
  fi: 'Suomi',
  ga: 'Gaeilge',
  yi: 'ייִדיש',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  id: 'Bahasa Indonesia',
  hu: 'Magyar',
  cs: 'Čeština',
  ro: 'Română',
};
// Right-to-left scripts
const RTL = new Set(['ar', 'he', 'fa', 'yi']);

// Atlas plate — culture anchors at a cultural capital per language.
// Projected onto the equirectangular plate:
// (viewBox 1000×403, lon −180…180 → x 0…1000, lat 85…−60 → y 0…403)
const CULTURE_GEO = {
  en: [51.51, -0.13], // London
  el: [37.98, 23.73], // Athens
  es: [40.42, -3.7], // Madrid
  ar: [30.04, 31.24], // Cairo
  zh: [39.9, 116.4], // Beijing
  ja: [35.68, 139.69], // Tokyo
  ko: [37.57, 126.98], // Seoul
  ru: [55.76, 37.62], // Moscow
  fr: [48.86, 2.35], // Paris
  de: [52.52, 13.4], // Berlin
  it: [41.9, 12.5], // Rome
  pt: [38.72, -9.14], // Lisbon
  tr: [41.01, 28.98], // Istanbul
  fa: [35.69, 51.39], // Tehran
  hi: [28.61, 77.21], // Delhi
  he: [31.77, 35.21], // Jerusalem
  sw: [-1.29, 36.82], // Nairobi
  yo: [6.52, 3.37], // Lagos
  pl: [52.23, 21.01], // Warsaw
  nl: [52.37, 4.9], // Amsterdam
  sv: [59.33, 18.07], // Stockholm
  fi: [60.17, 24.94], // Helsinki
  ga: [53.35, -6.26], // Dublin
  yi: [54.69, 25.28], // Vilnius — 'Jerusalem of the North'
  vi: [21.03, 105.85], // Hanoi
  th: [13.76, 100.5], // Bangkok
  id: [-6.21, 106.85], // Jakarta
  hu: [47.5, 19.04], // Budapest
  cs: [50.08, 14.44], // Prague
  ro: [44.43, 26.1], // Bucharest
};
function projectAnchor(lang) {
  const [lat, lon] = CULTURE_GEO[lang];
  const x = ((lon + 180) / 360) * 1000;
  const y = ((85 - lat) / 145) * 403;
  const anchor = x > 840 ? 'end' : 'start';
  return {
    label: LANG_LABEL[lang] || lang,
    x: +x.toFixed(1),
    y: +y.toFixed(1),
    lx: +(anchor === 'start' ? x + 11 : x - 11).toFixed(1),
    ly: +(y + 4).toFixed(1),
    anchor,
  };
}
// Built at init from the languages actually present in the corpus
const ANCHORS = {};

// Short editorial labels for the plate's concept index
const SHORT_TITLE = {
  'pot-kettle': 'The pot & the kettle',
  'bird-in-hand': 'A bird in the hand',
  'silence-golden': 'Silence is golden',
  'time-heals': 'Time heals',
  'apple-tree': 'The apple & the tree',
  'one-swallow': 'One swallow',
  'haste-waste': 'Haste makes waste',
  'empty-vessel': 'Empty vessels',
  'many-hands': 'Many hands',
  'actions-words': 'Actions, not words',
  'grass-greener': 'Greener grass',
  'book-cover': 'The book & its cover',
  'money-root': 'The root of evil',
  'when-in-rome': 'When in Rome',
  'strike-iron': 'The hot iron',
  'early-bird': 'The early bird',
  'count-chickens': 'Unhatched chickens',
  'still-waters': 'Still waters',
  'friend-in-need': 'A friend in need',
  'too-many-cooks': 'Too many cooks',
  'walls-ears': 'Walls have ears',
  'once-bitten': 'Once bitten',
  'no-smoke': 'Smoke & fire',
  'after-rain': 'After rain, sun',
  'last-straw': 'The last straw',
  'slow-steady': 'Slow & steady',
  'blood-water': 'Blood & water',
  'new-brooms': 'New brooms',
  'barking-dogs': 'Barking dogs',
  'gift-horse': 'The gift horse',
  'shoemaker-barefoot': "The shoemaker's children",
  'measure-twice': 'Measure twice',
  'better-late': 'Better late',
  'tongue-wounds': 'The boneless tongue',
  'patience-sweet': 'Bitter patience',
  'drowning-straw': 'The drowning man',
  'rome-day': 'Rome in a day',
  'thousand-miles': 'The first step',
  'little-by-little': 'Little by little',
  'practice-master': 'Practice & mastery',
  'all-glitters': 'Not all gold',
  'cat-away': "The cat's away",
  'two-birds': 'Two birds, one stone',
  'birds-feather': 'Birds of a feather',
  'beauty-beholder': "The beholder's eye",
  'crow-crow': 'Crow & crow',
  'god-helps': 'Help yourself first',
  'forbidden-fruit': 'Forbidden fruit',
  'hunger-sauce': 'Hunger, the sauce',
  'beginnings-hard': 'Hard beginnings',
  'spilled-milk': 'Spilled milk',
  'cheap-expensive': 'Cheap is dear',
  'rose-thorn': 'Rose & thorn',
  'sow-reap': 'Sow & reap',
  'all-roads-rome': 'All roads to Rome',
  'fall-rise': 'Fall & rise',
  'old-ginger': 'Old ginger',
  'teach-expert': 'Teaching the expert',
  'man-proposes': 'Man proposes',
  'home-best': 'Home is best',
  'love-blind': 'Love is blind',
  'better-safe': 'Better safe',
  'ask-way': 'Ask the way',
  'fish-head': 'The fish & its head',
  'frog-well': 'The frog in the well',
  'tomorrow-never': 'Today, not tomorrow',
  'remember-source': 'Remember the source',
};
function shortTitle(c) {
  if (SHORT_TITLE[c.id]) return SHORT_TITLE[c.id];
  const t = c.title;
  return t.length > 26 ? t.slice(0, 24).replace(/\s+\S*$/, '') + '…' : t;
}

let CORPUS = { concepts: [] };
let FLAT = []; // flat list of {proverb, concept}

// ---------- emblem plates ----------
// Each concept may have an engraved emblem at art/<id>.jpg. Missing files
// degrade cleanly: the <img onerror> handler removes the element.
function plateNo(c) {
  return String(CORPUS.concepts.indexOf(c) + 1).padStart(2, '0');
}

// ---------- init ----------
async function init() {
  try {
    const res = await fetch('proverbs.json');
    CORPUS = await res.json();
  } catch (e) {
    console.error('Failed to load corpus', e);
    return;
  }

  // Flatten
  for (const c of CORPUS.concepts) {
    for (const p of c.proverbs) {
      FLAT.push({ proverb: p, concept: c });
    }
  }

  // Build one atlas anchor per language present in the corpus
  const corpusLangs = [...new Set(FLAT.map((e) => e.proverb.lang))];
  for (const lang of corpusLangs) {
    if (CULTURE_GEO[lang]) ANCHORS[lang] = projectAnchor(lang);
  }

  // Language filter — generated from the data
  const langFilter = document.getElementById('lang-filter');
  langFilter.innerHTML =
    '<option value="">All</option>' +
    corpusLangs
      .map((l) => ({ l, label: LANG_LABEL[l] || l }))
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(
        ({ l, label }) =>
          `<option value="${l}">${escape(label)} · ${escape(NATIVE_NAME[l] || l)}</option>`
      )
      .join('');

  wireSearch();
  renderFeatured();
  renderThemes();
  renderAtlas();
  renderPlate();
  wireModal();
}

// ---------- concept hopping ----------
function tagChip(term) {
  return `<button type="button" class="tag-chip" data-term="${escape(term)}">${escape(term)}</button>`;
}

function wireChips(root) {
  root.querySelectorAll('.tag-chip').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      hopTo(btn.dataset.term);
    });
  });
}

function hopTo(term) {
  const modal = document.getElementById('proverb-modal');
  if (modal.open) modal.close();
  const input = document.getElementById('q');
  input.value = term;
  input.dispatchEvent(new Event('input'));
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- search ----------
function wireSearch() {
  const input = document.getElementById('q');
  const clear = document.getElementById('clear');
  const search = input.closest('.search');
  const langFilter = document.getElementById('lang-filter');

  const doSearch = () => {
    const q = input.value.trim();
    search.classList.toggle('has-value', q.length > 0);
    render(q, langFilter.value);
  };

  input.addEventListener('input', doSearch);
  langFilter.addEventListener('change', doSearch);

  clear.addEventListener('click', () => {
    input.value = '';
    langFilter.value = '';
    doSearch();
    input.focus();
  });

  // Chips
  document.querySelectorAll('.chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.query;
      doSearch();
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function scoreEntry({ proverb, concept }, q) {
  if (!q) return 0;
  const qLower = q.toLowerCase();
  const qNormalized = normalize(qLower);

  const haystack = [
    proverb.original,
    proverb.transliteration,
    proverb.literal_en,
    proverb.meaning_en,
    proverb.notes,
    concept.title,
    concept.gloss,
    ...(concept.themes || []),
    ...(concept.keywords || []),
  ]
    .filter(Boolean)
    .join(' \n ');

  const haystackLower = haystack.toLowerCase();
  const haystackNorm = normalize(haystackLower);

  let score = 0;

  // Exact original match — huge boost
  if (proverb.original && proverb.original.toLowerCase().includes(qLower)) score += 40;

  // Transliteration match (normalized) — for "kallio pente"-style queries
  if (proverb.transliteration && normalize(proverb.transliteration.toLowerCase()).includes(qNormalized))
    score += 35;

  // Theme match
  if (concept.themes.some((t) => t.toLowerCase() === qLower)) score += 30;
  if (concept.themes.some((t) => t.toLowerCase().includes(qLower))) score += 15;

  // Keyword match
  if (concept.keywords.some((k) => k.toLowerCase() === qLower)) score += 25;
  if (concept.keywords.some((k) => k.toLowerCase().includes(qLower))) score += 12;

  // Title / gloss match
  if (concept.title.toLowerCase().includes(qLower)) score += 20;
  if (concept.gloss.toLowerCase().includes(qLower)) score += 10;

  // Literal / meaning
  if (proverb.literal_en && proverb.literal_en.toLowerCase().includes(qLower)) score += 10;
  if (proverb.meaning_en && proverb.meaning_en.toLowerCase().includes(qLower)) score += 8;

  // General haystack fallback (partial word or fuzzy)
  if (score === 0 && haystackNorm.includes(qNormalized)) score += 3;

  return score;
}

function normalize(s) {
  // Strip diacritics for approximate matching:
  // Latin combining marks, Hebrew niqqud/cantillation, Arabic harakat
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f\u0591-\u05c7\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06dc]/g, '');
}

function render(q, lang) {
  const resultsSection = document.getElementById('results');
  const countEl = document.getElementById('results-count');
  const list = document.getElementById('results-list');

  const hasQuery = q.length > 0 || lang.length > 0;
  resultsSection.hidden = !hasQuery;

  if (!hasQuery) {
    list.innerHTML = '';
    return;
  }

  let items = FLAT.map((e) => ({ ...e, score: scoreEntry(e, q) }));

  if (lang) items = items.filter((e) => e.proverb.lang === lang);
  if (q) items = items.filter((e) => e.score > 0);

  items.sort((a, b) => b.score - a.score);

  countEl.textContent =
    items.length === 0
      ? 'No proverbs found'
      : `${items.length} ${items.length === 1 ? 'proverb' : 'proverbs'} across ${
          new Set(items.map((i) => i.proverb.lang)).size
        } languages`;

  if (items.length === 0) {
    list.innerHTML = `<div class="no-results">Nothing here yet — but the corpus is small. <em>Contribute one?</em></div>`;
    return;
  }

  list.innerHTML = items.map(renderResult).join('');
  list.querySelectorAll('.result').forEach((el) => {
    el.addEventListener('click', () => openModal(el.dataset.pid));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(el.dataset.pid);
      }
    });
  });
  wireChips(list);
}

function renderResult({ proverb: p, concept: c }) {
  const rtl = RTL.has(p.lang) ? ' rtl' : '';
  const zh = p.lang === 'zh' ? ' zh' : '';
  // Equivalent = the English proverb in the same concept, if we're not looking at it
  const equivalent =
    p.lang !== 'en' ? c.proverbs.find((q) => q.lang === 'en') : c.proverbs.find((q) => q.lang !== 'en');
  return `
    <article class="result" data-pid="${p.id}" role="button" tabindex="0">
      <img class="result-thumb" src="art/${escape(c.id)}.jpg" alt="" loading="lazy" onerror="this.remove()">
      <div class="result-header">
        <span class="result-flag">${LANG_LABEL[p.lang]} · ${escape(p.region || '')}</span>
      </div>
      <p class="result-original${rtl}${zh}">${escape(p.original)}</p>
      ${
        p.transliteration
          ? `<p class="result-transliteration">${escape(p.transliteration)}</p>`
          : ''
      }
      <p class="result-literal">${escape(p.literal_en)}</p>
      ${
        equivalent
          ? `<p class="result-equivalent">${escape(equivalent.original)}</p>`
          : ''
      }
      <div class="result-tags">
        ${c.themes.map(tagChip).join('')}
      </div>
    </article>
  `;
}

// ---------- featured ----------
function renderFeatured() {
  // Deterministic daily pick
  const day = Math.floor(Date.now() / 86400000);
  const c = CORPUS.concepts[day % CORPUS.concepts.length];
  const p = c.proverbs[day % c.proverbs.length];
  const rtl = RTL.has(p.lang) ? ' rtl' : '';
  const zh = p.lang === 'zh' ? ' zh' : '';
  document.getElementById('featured-card').innerHTML = `
    <p class="featured-original${rtl}${zh}">${escape(p.original)}</p>
    ${p.transliteration ? `<p class="featured-literal">${escape(p.transliteration)}</p>` : ''}
    <p class="featured-literal">${escape(p.literal_en)}</p>
    <p class="featured-meta">${LANG_LABEL[p.lang]} · ${escape(c.title)}</p>
    <div style="margin-top:1.5rem;">
      <button class="btn btn-ghost" data-open="${p.id}">See equivalents in ${c.proverbs.length - 1} languages →</button>
    </div>
  `;
  const btn = document.querySelector('[data-open]');
  if (btn) btn.addEventListener('click', () => openModal(btn.dataset.open));
}

// ---------- themes ----------
function renderThemes() {
  const counts = new Map();
  for (const c of CORPUS.concepts) {
    for (const t of c.themes) counts.set(t, (counts.get(t) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
  const grid = document.getElementById('theme-grid');
  grid.innerHTML = sorted
    .map(
      ([t, n]) => `
    <button class="theme-card" data-theme="${escape(t)}">
      <div class="theme-name">${escape(t)}</div>
      <div class="theme-count">${n} concept${n === 1 ? '' : 's'}</div>
    </button>`
    )
    .join('');
  grid.querySelectorAll('.theme-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.dataset.theme;
      document.getElementById('q').value = q;
      document.getElementById('q').dispatchEvent(new Event('input'));
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ---------- atlas ----------
function renderAtlas() {
  // Concepts by cultures represented
  const cultures = document.getElementById('atlas-cultures');
  const allConcepts = [...CORPUS.concepts]
    .map((c) => ({ c, n: new Set(c.proverbs.map((p) => p.lang)).size }))
    .sort((a, b) => b.n - a.n);
  const sortedConcepts = allConcepts.slice(0, 7);
  const maxC = sortedConcepts[0]?.n || 1;
  cultures.innerHTML =
    sortedConcepts
      .map(
        ({ c, n }) => `
    <li>
      <div class="bar-label">
        <span>${escape(shortTitle(c))}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(n / maxC) * 100}%"></div></div>
      </div>
      <span class="bar-count">${n} langs</span>
    </li>`
      )
      .join('') +
    (allConcepts.length > sortedConcepts.length
      ? `<li class="bar-more">…and ${allConcepts.length - sortedConcepts.length} more concepts in the corpus</li>`
      : '');

  // Most used keywords (images/nouns)
  const kw = new Map();
  for (const c of CORPUS.concepts) {
    for (const k of c.keywords) kw.set(k, (kw.get(k) || 0) + 1);
  }
  // Filter to concrete nouns (rough: skip abstract theme-y keywords)
  const abstractSet = new Set([
    'silence',
    'speech',
    'wisdom',
    'love',
    'appearance',
    'evil',
    'greed',
    'other',
    'heal',
    'waste',
    'walk',
    'talk',
    'many',
    'help',
    'louder',
    'speak',
    'judge',
    'inside',
    'outside',
    'root',
    'hurry',
    'slow',
    'fast',
    'one',
    'forget',
    'pain',
    'years',
    'ignorance',
    'humility',
    'faults',
    'action',
    'restraint',
    'grass-is-greener',
    'custom',
    'new',
    'early',
    'late',
    'never',
    'hot',
    'cheap',
    'expensive',
    'sweet',
    'bitter',
    'safe',
    'sorry',
    'prevent',
    'cure',
    'beginning',
    'first',
    'start',
    'half',
    'deep',
    'quiet',
    'silent',
    'blind',
    'ask',
    'question',
    'shame',
    'teach',
    'lead',
    'way',
    'delay',
    'today',
    'tomorrow',
    'rot',
    'stink',
    'crooked',
    'kind',
    'taste',
    'beauty',
    'source',
    'origin',
    'work',
    'sow',
    'reap',
    'harvest',
    'rise',
    'fall',
    'failure',
    'success',
    'plan',
    'hatch',
    'spill',
  ]);
  const images = document.getElementById('atlas-images');
  const sortedKw = [...kw.entries()]
    .filter(([k]) => !abstractSet.has(k))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const maxK = sortedKw[0]?.[1] || 1;
  images.innerHTML = sortedKw
    .map(
      ([k, n]) => `
    <li>
      <div class="bar-label">
        <span>${escape(k)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(n / maxK) * 100}%"></div></div>
      </div>
      <span class="bar-count">${n}</span>
    </li>`
    )
    .join('');

  // Timeline — oldest attestations
  const timeline = document.getElementById('atlas-timeline');
  const parsed = CORPUS.concepts
    .map((c) => ({
      c,
      year: parseAttestationYear(c.first_attested),
    }))
    .filter((x) => x.year != null)
    .sort((a, b) => a.year - b.year)
    .slice(0, 7);
  timeline.innerHTML = parsed
    .map(
      ({ c, year }) => `
    <li>
      <span class="year">${formatYear(year)}</span>
      <span class="label">${escape(c.title)}</span>
    </li>`
    )
    .join('');
}

function parseAttestationYear(s) {
  if (!s) return null;
  // Handles "1620", "16th century", "~4th century BCE", "1st century CE", "~7th century BCE"
  const bce = /BCE|BC/i.test(s);
  const centuryMatch = s.match(/(\d+)(?:st|nd|rd|th)\s*(?:c|century)/i);
  if (centuryMatch) {
    const c = parseInt(centuryMatch[1], 10);
    return bce ? -(c * 100 - 50) : (c - 1) * 100 + 50;
  }
  const yearMatch = s.match(/(\d{3,4})/);
  if (yearMatch) return parseInt(yearMatch[1], 10);
  return null;
}
function formatYear(y) {
  if (y < 0) return `${Math.abs(y)} BCE`;
  return `${y} CE`;
}

// ---------- atlas plate ----------
const SVG_NS = 'http://www.w3.org/2000/svg';
function plateDefaultCaption() {
  return `${CORPUS.concepts.length} shared concepts · ${Object.keys(ANCHORS).length} traditions — trace a concept below.`;
}

function renderPlate() {
  const svg = document.getElementById('plate-svg');
  if (!svg) return;
  const arcsG = document.getElementById('plate-arcs');
  const nodesG = document.getElementById('plate-nodes');
  const index = document.getElementById('plate-index');
  const legend = document.getElementById('plate-legend');
  const caption = document.getElementById('plate-caption');

  // Proverb counts per culture
  const counts = {};
  for (const { proverb } of FLAT) counts[proverb.lang] = (counts[proverb.lang] || 0) + 1;

  // Arcs — with ~30 nodes and 60+ concepts the full all-pairs web would be
  // thousands of paths, so arcs are drawn on demand: the focused concept's
  // full pair-web, or a faint one-arc-per-concept sample when idle.
  const conceptLangs = (c) =>
    [...new Set(c.proverbs.map((p) => p.lang))].filter((l) => ANCHORS[l]);

  const makeArc = (a, b, liftScale, cls) => {
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const lift = dist * liftScale + 6;
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2 - lift;
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', cls);
    path.setAttribute(
      'd',
      `M${a.x} ${a.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`
    );
    arcsG.appendChild(path);
  };

  const drawArcs = (conceptId) => {
    arcsG.textContent = '';
    if (conceptId) {
      // Full pair-web for the focused concept only
      const c = CORPUS.concepts.find((x) => x.id === conceptId);
      const langs = conceptLangs(c);
      for (let i = 0; i < langs.length; i++) {
        for (let j = i + 1; j < langs.length; j++) {
          makeArc(
            ANCHORS[langs[i]],
            ANCHORS[langs[j]],
            0.12 + 0.05 * ((i + j) % 3),
            'plate-arc active'
          );
        }
      }
    } else {
      // Idle sample — one arc per concept, between its two farthest-apart cultures
      CORPUS.concepts.forEach((c, ci) => {
        const langs = conceptLangs(c);
        if (langs.length < 2) return;
        let best = [langs[0], langs[1]];
        let bestD = -1;
        for (let i = 0; i < langs.length; i++) {
          for (let j = i + 1; j < langs.length; j++) {
            const d = Math.hypot(
              ANCHORS[langs[j]].x - ANCHORS[langs[i]].x,
              ANCHORS[langs[j]].y - ANCHORS[langs[i]].y
            );
            if (d > bestD) {
              bestD = d;
              best = [langs[i], langs[j]];
            }
          }
        }
        makeArc(ANCHORS[best[0]], ANCHORS[best[1]], 0.1 + 0.02 * (ci % 5), 'plate-arc');
      });
    }
  };
  drawArcs(null);

  // Culture nodes
  const filterByCulture = (lang) => {
    const langFilter = document.getElementById('lang-filter');
    langFilter.value = lang;
    langFilter.dispatchEvent(new Event('change'));
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  for (const [lang, a] of Object.entries(ANCHORS)) {
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'plate-node');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute(
      'aria-label',
      `${a.label} — filter search to ${counts[lang] || 0} proverbs`
    );

    const hit = document.createElementNS(SVG_NS, 'circle');
    hit.setAttribute('class', 'node-hit');
    hit.setAttribute('cx', a.x);
    hit.setAttribute('cy', a.y);
    hit.setAttribute('r', 16);
    const halo = document.createElementNS(SVG_NS, 'circle');
    halo.setAttribute('class', 'node-halo');
    halo.setAttribute('cx', a.x);
    halo.setAttribute('cy', a.y);
    halo.setAttribute('r', 8);
    const core = document.createElementNS(SVG_NS, 'circle');
    core.setAttribute('class', 'node-core');
    core.setAttribute('cx', a.x);
    core.setAttribute('cy', a.y);
    core.setAttribute('r', 3.5);
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('x', a.lx);
    text.setAttribute('y', a.ly);
    text.setAttribute('text-anchor', a.anchor);
    text.textContent = a.label + ' ';
    const count = document.createElementNS(SVG_NS, 'tspan');
    count.setAttribute('class', 'node-count');
    count.textContent = `· ${counts[lang] || 0}`;
    text.appendChild(count);

    g.append(hit, halo, core, text);
    g.addEventListener('click', () => filterByCulture(lang));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        filterByCulture(lang);
      }
    });
    nodesG.appendChild(g);

    // Mobile legend twin (svg labels hide at small sizes)
    const li = document.createElement('button');
    li.type = 'button';
    li.className = 'plate-legend-item';
    li.textContent = `${a.label} · ${counts[lang] || 0}`;
    li.addEventListener('click', () => filterByCulture(lang));
    legend.appendChild(li);
  }

  // Concept index
  let activeConcept = null;
  const setFocus = (conceptId) => {
    activeConcept = conceptId;
    svg.classList.toggle('is-focused', !!conceptId);
    drawArcs(conceptId);
    index.querySelectorAll('.plate-concept').forEach((b) => {
      b.classList.toggle('active', b.dataset.concept === conceptId);
    });
    if (conceptId) {
      const c = CORPUS.concepts.find((x) => x.id === conceptId);
      caption.textContent = `${c.gloss}${c.first_attested ? ` — first attested ${c.first_attested}.` : ''}`;
    } else {
      caption.textContent = plateDefaultCaption();
    }
  };
  caption.textContent = plateDefaultCaption();

  CORPUS.concepts.forEach((c) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'plate-concept';
    btn.dataset.concept = c.id;
    btn.textContent = shortTitle(c);
    btn.title = c.title;
    btn.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') setFocus(c.id);
    });
    btn.addEventListener('focus', () => {
      if (btn.matches(':focus-visible')) setFocus(c.id);
    });
    btn.addEventListener('click', () => {
      // First tap (touch) highlights; second tap — or a click while hovered — opens the cluster.
      if (activeConcept === c.id) {
        const p = c.proverbs.find((x) => x.lang === 'en') || c.proverbs[0];
        if (p) openModal(p.id);
      } else {
        setFocus(c.id);
      }
    });
    index.appendChild(btn);
  });
  index.addEventListener('mouseleave', () => setFocus(null));
}

// ---------- modal ----------
function wireModal() {
  const modal = document.getElementById('proverb-modal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.open) modal.close();
  });
}

function openModal(pid) {
  const entry = FLAT.find((e) => e.proverb.id === pid);
  if (!entry) return;
  const { proverb: p, concept: c } = entry;
  const rtl = RTL.has(p.lang) ? ' rtl' : '';
  const zh = p.lang === 'zh' ? ' zh' : '';
  const others = c.proverbs.filter((q) => q.id !== p.id);

  document.getElementById('modal-inner').innerHTML = `
    <button class="modal-close" aria-label="Close" onclick="document.getElementById('proverb-modal').close()">×</button>
    <figure class="modal-plate">
      <img src="art/${escape(c.id)}.jpg" alt="${escape(c.title)} — emblem" onerror="this.parentElement.remove()">
      <figcaption>Plate ${plateNo(c)}</figcaption>
    </figure>
    <p class="modal-concept-title">Concept</p>
    <p class="modal-concept-gloss">${escape(c.title)}</p>

    <div class="modal-selected">
      <div class="result-header">
        <span class="result-flag">${LANG_LABEL[p.lang]} · ${escape(p.region || '')}</span>
      </div>
      <p class="result-original${rtl}${zh}">${escape(p.original)}</p>
      ${p.transliteration ? `<p class="result-transliteration">${escape(p.transliteration)}</p>` : ''}
      <p class="result-literal">${escape(p.literal_en)}</p>
      ${p.meaning_en ? `<p class="result-equivalent"><strong style="font-family:var(--font-ui);font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--muted);font-weight:400;">Meaning</strong><br>${escape(p.meaning_en)}</p>` : ''}
      ${p.notes ? `<p class="equivalent-notes" style="margin-top:0.75rem;">${escape(p.notes)}</p>` : ''}
    </div>

    <p class="modal-equivalents-title">Equivalents in ${others.length} other language${others.length === 1 ? '' : 's'}</p>
    <div class="modal-equivalents">
      ${others.map(renderEquivalent).join('')}
    </div>

    <div class="modal-sources">
      <p class="modal-tags-label">Concept themes</p>
      <div class="modal-tags">${c.themes.map(tagChip).join('')}</div>
      <p class="modal-tags-label">Keywords &amp; images</p>
      <div class="modal-tags">${(c.keywords || []).map(tagChip).join('')}</div>
      ${c.first_attested ? `<p><strong>First attested:</strong> ${escape(c.first_attested)}${c.attestation_source ? ' — ' + escape(c.attestation_source) : ''}</p>` : ''}
      <p><strong>License:</strong> Wiki Proverb data is licensed under <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.</p>
    </div>
  `;
  wireChips(document.getElementById('modal-inner'));
  document.getElementById('proverb-modal').showModal();
}

function renderEquivalent(p) {
  const rtl = RTL.has(p.lang) ? ' rtl' : '';
  const zh = p.lang === 'zh' ? ' zh' : '';
  return `
    <div class="equivalent">
      <p class="equivalent-meta">${LANG_LABEL[p.lang]} · ${escape(p.region || '')}</p>
      <p class="equivalent-original${rtl}${zh}">${escape(p.original)}</p>
      ${p.transliteration ? `<p class="result-transliteration">${escape(p.transliteration)}</p>` : ''}
      <p class="equivalent-literal">${escape(p.literal_en)}</p>
      ${p.notes ? `<p class="equivalent-notes">${escape(p.notes)}</p>` : ''}
    </div>
  `;
}

// ---------- utils ----------
function escape(s) {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

init();
