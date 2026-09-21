import {useHistory} from '@docusaurus/router';
import {useActiveDocContext} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
  DOC_READING_ORDER,
  permalinkForDocId,
  resolveOrderIndex,
} from '@site/src/constants/docReadingOrder';

import styles from './styles.module.css';

const STORAGE_FRACTION = 'fc3d-doc-scroll-fraction';
const MIN_THUMB_PX = 36;
const NAV_DEBOUNCE_MS = 45;

function pageScrollFraction() {
  const max = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  return Math.min(1, Math.max(0, window.scrollY / max));
}

function scrollToFraction(fraction) {
  const max = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  );
  window.scrollTo(0, fraction * max);
}

function thumbMetrics(progress, trackHeight) {
  const total = DOC_READING_ORDER.length;
  const heightPx = Math.max(MIN_THUMB_PX, (1 / total) * trackHeight);
  const maxTop = Math.max(0, trackHeight - heightPx);
  const topPx = Math.min(maxTop, progress * maxTop);
  return {heightPx, topPx};
}

function clearSidebarPreview() {
  document
    .querySelectorAll('.fc3d-scroll-preview')
    .forEach((el) => el.classList.remove('fc3d-scroll-preview'));
  delete document.documentElement.dataset.fc3dScrollPreview;
}

function normalizeHref(href) {
  const raw = (href || '').split('?')[0].split('#')[0];
  if (!raw || raw === '/') {
    return '/';
  }
  return raw.replace(/\/$/, '');
}

function hrefMatchesDoc(href, docId, baseUrl) {
  const path = normalizeHref(href);
  const base = String(baseUrl || '/').replace(/\/$/, '');
  const target = normalizeHref(permalinkForDocId(docId, baseUrl));
  if (path === target) {
    return true;
  }
  if (docId === 'intro') {
    return path === '/' || path === base || path.endsWith(base);
  }
  return (
    path.endsWith(`/${docId}`) ||
    path.endsWith(docId) ||
    path.includes(`/${docId}`)
  );
}

function highlightSidebarForDoc(docId, baseUrl = '/') {
  clearSidebarPreview();
  if (!docId) {
    return;
  }

  document.documentElement.dataset.fc3dScrollPreview = docId;
  const root = document.querySelector('.theme-doc-sidebar-container');
  if (!root) {
    return;
  }

  /** @type {HTMLElement | null} */
  let matched = null;
  for (const link of root.querySelectorAll('a.menu__link')) {
    if (hrefMatchesDoc(link.getAttribute('href'), docId, baseUrl)) {
      matched = link;
      break;
    }
  }

  if (!matched) {
    return;
  }

  matched.classList.add('fc3d-scroll-preview');

  let node = matched.closest('.menu__list-item');
  while (node) {
    const category = node.parentElement?.closest(
      '.theme-doc-sidebar-item-category',
    );
    if (!category) {
      break;
    }
    const collapsible = category.querySelector(
      ':scope > .menu__list-item-collapsible',
    );
    const caret =
      collapsible?.querySelector('.menu__caret') ||
      collapsible?.querySelector('a.menu__link--sublist');
    const childList = category.querySelector(':scope > .menu__list');
    const hidden =
      childList &&
      (childList.hasAttribute('hidden') ||
        getComputedStyle(childList).display === 'none');
    if (hidden && caret instanceof HTMLElement) {
      caret.click();
    }
    collapsible?.classList.add('fc3d-scroll-preview');
    node = category;
  }

  matched.scrollIntoView({block: 'nearest', inline: 'nearest'});
}

/**
 * Globalny scrollbar dokumentacji:
 * - w trakcie przeciągania widać treść (live replace)
 * - lewy spis podświetla temat/subtemat pod kciukiem
 */
export default function DocumentScrollbar() {
  const {activeDoc} = useActiveDocContext(undefined);
  const {siteConfig} = useDocusaurusContext();
  const history = useHistory();
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const lastNavIndexRef = useRef(-1);
  const navTimerRef = useRef(null);
  const pendingNavRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [trackHeight, setTrackHeight] = useState(600);

  const pageIndex = resolveOrderIndex(activeDoc);
  const enabled = pageIndex >= 0;
  const baseUrl = siteConfig.baseUrl;

  const goToDoc = useCallback(
    (docId, fraction, index) => {
      sessionStorage.setItem(STORAGE_FRACTION, String(fraction));
      lastNavIndexRef.current = index;
      history.replace(permalinkForDocId(docId, baseUrl));
    },
    [history, baseUrl],
  );

  const scheduleNavigation = useCallback(
    (docId, fraction, index, immediate) => {
      pendingNavRef.current = {docId, fraction, index};
      if (immediate) {
        if (navTimerRef.current) {
          window.clearTimeout(navTimerRef.current);
          navTimerRef.current = null;
        }
        pendingNavRef.current = null;
        goToDoc(docId, fraction, index);
        return;
      }
      if (navTimerRef.current) {
        return;
      }
      navTimerRef.current = window.setTimeout(() => {
        navTimerRef.current = null;
        const pending = pendingNavRef.current;
        pendingNavRef.current = null;
        if (!pending) {
          return;
        }
        goToDoc(pending.docId, pending.fraction, pending.index);
      }, NAV_DEBOUNCE_MS);
    },
    [goToDoc],
  );

  const syncFromWindow = useCallback(() => {
    if (draggingRef.current || pageIndex < 0) {
      return;
    }
    const total = DOC_READING_ORDER.length;
    const fraction = pageScrollFraction();
    setProgress((pageIndex + fraction) / total);
    highlightSidebarForDoc(DOC_READING_ORDER[pageIndex], baseUrl);
    if (trackRef.current) {
      setTrackHeight(trackRef.current.getBoundingClientRect().height);
    }
  }, [pageIndex, baseUrl]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const pending = sessionStorage.getItem(STORAGE_FRACTION);
    if (pending != null) {
      sessionStorage.removeItem(STORAGE_FRACTION);
      const fraction = Number(pending);
      if (!Number.isNaN(fraction)) {
        requestAnimationFrame(() => {
          scrollToFraction(fraction);
          highlightSidebarForDoc(DOC_READING_ORDER[pageIndex], baseUrl);
        });
      }
    }

    syncFromWindow();
    window.addEventListener('scroll', syncFromWindow, {passive: true});
    window.addEventListener('resize', syncFromWindow);
    return () => {
      window.removeEventListener('scroll', syncFromWindow);
      window.removeEventListener('resize', syncFromWindow);
    };
  }, [enabled, pageIndex, syncFromWindow, baseUrl]);

  useEffect(() => {
    return () => {
      clearSidebarPreview();
      if (navTimerRef.current) {
        window.clearTimeout(navTimerRef.current);
      }
    };
  }, []);

  const jumpToProgress = useCallback(
    (nextProgress, {immediate = false} = {}) => {
      const total = DOC_READING_ORDER.length;
      const clamped = Math.min(1, Math.max(0, nextProgress));
      const absolute = clamped * total;
      let targetIndex = Math.floor(absolute);
      if (targetIndex >= total) {
        targetIndex = total - 1;
      }
      const fraction = Math.min(0.999, Math.max(0, absolute - targetIndex));
      const docId = DOC_READING_ORDER[targetIndex];

      setProgress(clamped);
      highlightSidebarForDoc(docId, baseUrl);

      if (targetIndex === pageIndex) {
        scrollToFraction(fraction);
        lastNavIndexRef.current = targetIndex;
        pendingNavRef.current = null;
        if (navTimerRef.current) {
          window.clearTimeout(navTimerRef.current);
          navTimerRef.current = null;
        }
        return;
      }

      if (targetIndex !== lastNavIndexRef.current || immediate) {
        scheduleNavigation(docId, fraction, targetIndex, immediate);
      } else {
        pendingNavRef.current = {docId, fraction, index: targetIndex};
      }
    },
    [pageIndex, scheduleNavigation, baseUrl],
  );

  const progressFromClientY = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) {
      return 0;
    }
    const rect = track.getBoundingClientRect();
    const y = clientY - rect.top;
    return Math.min(1, Math.max(0, y / Math.max(1, rect.height)));
  }, []);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    function onMove(event) {
      if (!draggingRef.current) {
        return;
      }
      event.preventDefault();
      jumpToProgress(progressFromClientY(event.clientY), {immediate: false});
    }

    function onUp(event) {
      if (!draggingRef.current) {
        return;
      }
      draggingRef.current = false;
      document.body.classList.remove(styles.draggingBody);
      jumpToProgress(progressFromClientY(event.clientY), {immediate: true});
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [enabled, jumpToProgress, progressFromClientY]);

  useEffect(() => {
    if (!draggingRef.current) {
      lastNavIndexRef.current = pageIndex;
    }
  }, [pageIndex]);

  if (!enabled) {
    return null;
  }

  const {heightPx, topPx} = thumbMetrics(progress, trackHeight);

  return (
    <div
      className={styles.track}
      ref={trackRef}
      role="scrollbar"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Przewijanie całej dokumentacji"
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return;
        }
        event.preventDefault();
        draggingRef.current = true;
        document.body.classList.add(styles.draggingBody);
        lastNavIndexRef.current = pageIndex;
        jumpToProgress(progressFromClientY(event.clientY), {
          immediate: false,
        });
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }}
    >
      <div
        className={styles.thumb}
        style={{
          height: `${heightPx}px`,
          top: `${topPx}px`,
        }}
      />
    </div>
  );
}
