import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import React, {useMemo} from 'react';

import {
  DOC_READING_ORDER,
  resolveOrderIndex,
} from '@site/src/constants/docReadingOrder';

export {DOC_READING_ORDER};

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
