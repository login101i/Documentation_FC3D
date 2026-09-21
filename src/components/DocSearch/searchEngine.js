import {PHRASE_HINTS, SEARCH_DOCS, SYNONYM_GROUPS} from './searchIndex';

const STOPWORDS = new Set([
  'i',
  'w',
  'na',
  'do',
  'o',
  'z',
  'ze',
  'oraz',
  'czy',
  'jak',
  'jakie',
  'jakies',
  'sie',
  'to',
  'tym',
  'tej',
  'ten',
  'dla',
  'od',
  'po',
  'przy',
  'przez',
  'a',
  'the',
  'of',
  'np',
  'jakis',
  'cos',
  'czego',
  'szukam',
]);

const SUFFIXES = [
  'anie',
  'enie',
  'owanie',
  'ywanie',
  'acji',
  'acja',
  'owych',
  'owym',
  'owy',
  'owa',
  'owe',
  'ami',
  'ach',
  'owi',
  'ego',
  'emu',
  'ich',
  'ymi',
  'ym',
  'ie',
  'ia',
  'ow',
  'em',
  'om',
  'y',
  'i',
  'e',
  'a',
];

function stripDiacritics(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ł/g, 'l')
    .replace(/Ł/g, 'l');
}

export function normalize(value) {
  return stripDiacritics(String(value || '').toLowerCase())
    .replace(/[^a-z0-9_\s-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stem(token) {
  if (token.length < 5) {
    return token;
  }
  for (const suffix of SUFFIXES) {
    if (token.length - suffix.length >= 4 && token.endsWith(suffix)) {
      return token.slice(0, -suffix.length);
    }
  }
  return token;
}

function tokenize(value) {
  return normalize(value)
    .split(' ')
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stem);
}

function unique(items) {
  return [...new Set(items)];
}

function expandToken(token) {
  const expanded = [token, stem(token)];
  for (const group of SYNONYM_GROUPS) {
    const normalizedGroup = group.map((item) => stem(normalize(item)));
    if (normalizedGroup.some((item) => item === token || item.startsWith(token) || token.startsWith(item))) {
      expanded.push(...normalizedGroup);
    }
  }
  return unique(expanded.filter(Boolean));
}

function levenshtein(a, b) {
  if (a === b) {
    return 0;
  }
  if (!a.length) {
    return b.length;
  }
  if (!b.length) {
    return a.length;
  }
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cur = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = cur;
    }
  }
  return row[b.length];
}

function fuzzyHit(token, haystackTokens) {
  if (token.length < 4) {
    return haystackTokens.some((item) => item.includes(token) || token.includes(item));
  }
  return haystackTokens.some((item) => {
    if (item.includes(token) || token.includes(item)) {
      return true;
    }
    const maxLen = Math.max(item.length, token.length);
    return levenshtein(item, token) <= (maxLen >= 8 ? 2 : 1);
  });
}

function phraseBoosts(normalizedQuery) {
  const boosts = new Map();
  for (const hint of PHRASE_HINTS) {
    const matched = hint.patterns.some((pattern) => {
      const p = normalize(pattern);
      return normalizedQuery.includes(p) || p.split(' ').every((part) => normalizedQuery.includes(part));
    });
    if (matched) {
      hint.boostIds.forEach((id, index) => {
        boosts.set(id, Math.max(boosts.get(id) || 0, 40 - index * 8));
      });
    }
  }
  return boosts;
}

function matchReason(doc, queryTokens, expanded) {
  const titleTokens = tokenize(doc.title);
  const topicTokens = tokenize(doc.topics.join(' '));
  if (queryTokens.some((token) => titleTokens.includes(token))) {
    return 'Trafienie w tytule sekcji';
  }
  if (expanded.some((token) => topicTokens.includes(token) || topicTokens.some((item) => item.includes(token)))) {
    return 'Powiązane pojęcie w tej sekcji';
  }
  return 'Zbliżona treść dokumentacji';
}

/**
 * @param {string} query
 * @param {{limit?: number}} [options]
 */
export function searchDocs(query, options = {}) {
  const limit = options.limit ?? 8;
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) {
    return [];
  }

  const queryTokens = tokenize(normalizedQuery);
  const expanded = unique(queryTokens.flatMap(expandToken));
  const boosts = phraseBoosts(normalizedQuery);

  const scored = SEARCH_DOCS.map((doc) => {
    const titleN = normalize(doc.title);
    const blob = normalize(
      [doc.title, doc.summary, doc.category, doc.headings.join(' '), doc.topics.join(' '), doc.text].join(' '),
    );
    const blobTokens = tokenize(blob);
    const titleTokens = tokenize(doc.title);

    let score = boosts.get(doc.id) || 0;

    if (titleN.includes(normalizedQuery)) {
      score += 90;
    }

    for (const token of queryTokens) {
      if (titleTokens.some((item) => item.includes(token) || token.includes(item))) {
        score += 28;
      }
      if (blob.includes(token)) {
        score += 12;
      }
    }

    for (const token of expanded) {
      if (token.length < 3) {
        continue;
      }
      if (titleTokens.some((item) => item.includes(token) || token.includes(item))) {
        score += 16;
      }
      if (blobTokens.includes(token) || blob.includes(token)) {
        score += 8;
      } else if (fuzzyHit(token, blobTokens)) {
        score += 5;
      }
    }

    if (score <= 0) {
      return null;
    }

    return {
      ...doc,
      score,
      reason: matchReason(doc, queryTokens, expanded),
    };
  }).filter(Boolean);

  scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'pl'));
  return scored.slice(0, limit);
}
