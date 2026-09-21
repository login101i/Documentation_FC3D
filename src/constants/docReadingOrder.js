/**
 * Reading order of documentation pages (= left sidebar).
 * Keep in sync with docs sidebar_position fields.
 */
export const DOC_READING_ORDER = [
  'intro',
  'procedura-konfiguracji-fc3d',
  'konfiguracja-bazy-zasobow',
  'parametry-zasobu/parametry-podstawowe',
  'parametry-zasobu/oklejanie-niestandardowe',
  'parametry-zasobu/kolory-plaszczyzn',
  'sety/zmienne-standardowe-i-indywidualne',
  'sety/powiazane-zlacz',
  'sety/powiazania-oklein-zlaczy',
  'sety/powiazania-uslug-otworow',
  'migracja/migracja-v4-v6',
  'parametry-do-uzupelnienia',
  'zmiany',
  'jak-edytowac-dokumentacje',
];

/** Category generated-index pages map to the first child doc. */
export const CATEGORY_TO_FIRST_DOC = [
  {
    test: (id, path) =>
      /parametry-zasobu/i.test(id) || /parametry-zasobu/i.test(path),
    first: 'parametry-zasobu/parametry-podstawowe',
  },
  {
    test: (id, path) =>
      /(^|\/)sety([/-]|$)/i.test(id) ||
      /sety-i-powiazania/i.test(id) ||
      /(^|\/)sety([/-]|$)/i.test(path) ||
      /sety-i-powiazania/i.test(path),
    first: 'sety/zmienne-standardowe-i-indywidualne',
  },
  {
    test: (id, path) => /migracja/i.test(id) || /migracja/i.test(path),
    first: 'migracja/migracja-v4-v6',
  },
];

export function normalizeDocId(id) {
  return String(id || '')
    .replace(/^docs\//, '')
    .replace(/^category\//, 'category/')
    .replace(/\/index$/, '')
    .replace(/\.mdx?$/, '');
}

export function indexInOrder(docId) {
  const id = normalizeDocId(docId);
  return DOC_READING_ORDER.findIndex(
    (entry) => entry === id || id.endsWith(`/${entry}`) || id.endsWith(entry),
  );
}

export function resolveOrderIndex(activeDoc) {
  if (!activeDoc) {
    return -1;
  }

  const id = normalizeDocId(activeDoc.id);
  const path = String(activeDoc.path || activeDoc.permalink || '');

  const direct = indexInOrder(id);
  if (direct >= 0) {
    return direct;
  }

  if (id.startsWith('category/') || path.includes('/category/')) {
    for (const rule of CATEGORY_TO_FIRST_DOC) {
      if (rule.test(id, path)) {
        return indexInOrder(rule.first);
      }
    }
  }

  for (const entry of DOC_READING_ORDER) {
    const folder = entry.includes('/') ? entry.split('/')[0] : null;
    if (folder && (id.startsWith(`${folder}/`) || path.includes(`/${folder}/`))) {
      return indexInOrder(
        DOC_READING_ORDER.find((e) => e.startsWith(`${folder}/`)) || entry,
      );
    }
  }

  return -1;
}

/** Permalink for a doc id relative to baseUrl (no trailing slash). */
export function permalinkForDocId(docId, baseUrl = '/') {
  const base = String(baseUrl || '/').replace(/\/$/, '');
  if (!docId || docId === 'intro') {
    return base || '/';
  }
  return `${base}/${docId}`.replace(/\/{2,}/g, '/');
}
