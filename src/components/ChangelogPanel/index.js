import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {useCallback, useEffect, useId, useRef, useState} from 'react';

import {APP_VERSION} from '../../constants/appVersion';
import {CHANGELOG_ENTRIES} from './entries';
import styles from './styles.module.css';

const SEEN_ID_KEY = 'fc3d-changelog-seen-id';

function readSeenId() {
  try {
    return window.localStorage.getItem(SEEN_ID_KEY) || '';
  } catch {
    return '';
  }
}

function writeSeenId(id) {
  try {
    window.localStorage.setItem(SEEN_ID_KEY, id);
  } catch {
    /* ignore */
  }
}

function formatDate(isoDate) {
  if (!isoDate) {
    return '';
  }
  try {
    return new Intl.DateTimeFormat('pl-PL', {dateStyle: 'medium'}).format(
      new Date(`${isoDate}T12:00:00`),
    );
  } catch {
    return isoDate;
  }
}

function countUnread(entries, seenId) {
  if (!entries?.length) {
    return 0;
  }
  if (!seenId) {
    return entries.length;
  }
  const index = entries.findIndex((entry) => entry.id === seenId);
  if (index === -1) {
    return entries.length;
  }
  return index;
}

/**
 * Przycisk w headerze: APP_VERSION + ostatnie zmiany (ręczny dziennik po polsku).
 * Stan „przeczytane” jest lokalny — każdy użytkownik/przeglądarka osobno.
 */
export default function ChangelogPanel() {
  const panelId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [seenId, setSeenId] = useState('');
  const [highlightCount, setHighlightCount] = useState(0);

  useEffect(() => {
    setSeenId(readSeenId());
  }, []);

  const entries = CHANGELOG_ENTRIES;
  const unread = countUnread(entries, seenId);
  const latestId = entries[0]?.id || '';

  const markRead = useCallback(() => {
    if (!latestId) {
      return;
    }
    writeSeenId(latestId);
    setSeenId(latestId);
    setHighlightCount(0);
  }, [latestId]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      if (prev) {
        setHighlightCount(0);
        return false;
      }
      setHighlightCount(countUnread(entries, readSeenId()));
      if (latestId) {
        writeSeenId(latestId);
        setSeenId(latestId);
      }
      return true;
    });
  }, [entries, latestId]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
        setHighlightCount(0);
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
        setHighlightCount(0);
      }
    }

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={clsx(styles.trigger, open && styles.triggerOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        title="Ostatnie zmiany dokumentacji"
      >
        <span className={styles.version}>v{APP_VERSION}</span>
        <span className={styles.triggerLabel}>Zmiany</span>
        {unread > 0 ? (
          <span className={styles.badge} aria-label={`${unread} nieprzeczytanych`}>
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className={styles.panel} id={panelId} role="dialog" aria-label="Ostatnie zmiany">
          <div className={styles.panelHead}>
            <div>
              <strong className={styles.panelTitle}>Ostatnie zmiany</strong>
              <p className={styles.panelMeta}>Wersja dokumentacji: {APP_VERSION}</p>
            </div>
            <button type="button" className={styles.markRead} onClick={markRead}>
              Oznacz przeczytane
            </button>
          </div>

          {entries.length === 0 ? (
            <p className={styles.status}>Brak wpisów w dzienniku zmian.</p>
          ) : null}

          <ul className={styles.list}>
            {entries.map((entry, index) => {
              const isNew = index < highlightCount;
              const body = (
                <>
                  <span className={styles.itemMsg}>{entry.title}</span>
                  <span className={styles.itemSummary}>{entry.summary}</span>
                  {entry.pages?.length ? (
                    <span className={styles.itemPages}>
                      Strony: {entry.pages.join(' · ')}
                    </span>
                  ) : null}
                  <span className={styles.itemMeta}>
                    {entry.author}
                    {' · '}
                    {formatDate(entry.date)}
                    {entry.version ? ` · v${entry.version}` : ''}
                  </span>
                </>
              );

              return (
                <li
                  key={entry.id}
                  className={clsx(styles.item, isNew && styles.itemNew)}
                >
                  {entry.href ? (
                    <Link className={styles.itemLink} to={entry.href} onClick={() => setOpen(false)}>
                      {body}
                    </Link>
                  ) : (
                    <div className={styles.itemLink}>{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
