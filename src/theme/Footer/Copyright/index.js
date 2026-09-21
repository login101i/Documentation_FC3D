import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import React, {useMemo} from 'react';

// Reading order = left sidebar (content pages).
// Keep in sync with docs/*/sidebar_position.
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

/** Główne tematy (generated-index) → pierwszy subtemat w kolejności. */
const CATEGORY_TO_FIRST_DOC = [
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

function normalizeDocId(id) {
  return String(id || '')
    .replace(/^docs\//, '')
    .replace(/^category\//, 'category/')
    .replace(/\/index$/, '')
    .replace(/\.mdx?$/, '');
}

function indexInOrder(docId) {
  const id = normalizeDocId(docId);
  return DOC_READING_ORDER.findIndex(
    (entry) => entry === id || id.endsWith(`/${entry}`) || id.endsWith(entry),
  );
}

function resolveOrderIndex(activeDoc) {
  if (!activeDoc) {
    return -1;
  }

  const id = normalizeDocId(activeDoc.id);
  const path = String(activeDoc.path || activeDoc.permalink || '');

  const direct = indexInOrder(id);
  if (direct >= 0) {
    return direct;
  }

  // Główny temat (category generated-index) → numer pierwszego subtematu
  if (id.startsWith('category/') || path.includes('/category/')) {
    for (const rule of CATEGORY_TO_FIRST_DOC) {
      if (rule.test(id, path)) {
        return indexInOrder(rule.first);
      }
    }
  }

  // Fallback: dopasuj po prefiksie folderu w id/path
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

function useDocPagePosition() {
  const {activeDoc} = useActiveDocContext(undefined);

  return useMemo(() => {
    const index = resolveOrderIndex(activeDoc);
    if (index < 0) {
      return null;
    }
    return {
      current: index + 1,
      total: DOC_READING_ORDER.length,
    };
  }, [activeDoc]);
}

export default function FooterCopyright({copyright}) {
  const position = useDocPagePosition();
  const pageLabel = position
    ? `Strona ${position.current}/${position.total}`
    : 'Strona —/—';

  return (
    <div className="footer__copyright footer-doc-status">
      <span
        className="footer-doc-status__text"
        dangerouslySetInnerHTML={{__html: copyright}}
      />
      <span className="footer-doc-status__page" aria-live="polite">
        {' | '}
        {pageLabel}
      </span>
    </div>
  );
}
