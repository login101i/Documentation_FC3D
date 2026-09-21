import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import React, {useMemo} from 'react';

// Reading order = left sidebar (content pages only).
// Keep in sync with docs/*/sidebar_position.
export const DOC_READING_ORDER = [
  'intro',
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

function normalizeDocId(id) {
  return String(id || '')
    .replace(/^docs\//, '')
    .replace(/\/index$/, '')
    .replace(/\.mdx?$/, '');
}

function useDocPagePosition() {
  const {activeDoc} = useActiveDocContext(undefined);

  return useMemo(() => {
    if (!activeDoc) {
      return null;
    }

    const id = normalizeDocId(activeDoc.id);
    const index = DOC_READING_ORDER.findIndex(
      (entry) =>
        entry === id ||
        activeDoc.path?.endsWith(`/${entry}`) ||
        activeDoc.path?.endsWith(entry),
    );

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
