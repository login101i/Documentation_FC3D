import clsx from 'clsx';
import {useCallback, useEffect, useId, useRef, useState} from 'react';

import {APP_VERSION} from '../../constants/appVersion';
import {displayAuthor} from './authors';
import styles from './styles.module.css';

const SEEN_SHA_KEY = 'fc3d-changelog-seen-sha';
const CACHE_KEY = 'fc3d-changelog-cache';
const CACHE_TTL_MS = 5 * 60 * 1000;
const REPO = 'login101i/Documentation_FC3D';
const COMMITS_URL = `https://api.github.com/repos/${REPO}/commits?per_page=12`;

function readSeenSha() {
  try {
    return window.localStorage.getItem(SEEN_SHA_KEY) || '';
  } catch {
    return '';
  }
}

function writeSeenSha(sha) {
  try {
    window.localStorage.setItem(SEEN_SHA_KEY, sha);
  } catch {
    /* ignore */
  }
}

function readCache() {
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.fetchedAt || Date.now() - parsed.fetchedAt > CACHE_TTL_MS) {
      return null;
    }
    return parsed.commits;
  } catch {
    return null;
  }
}

function writeCache(commits) {
  try {
    window.sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({fetchedAt: Date.now(), commits}),
    );
  } catch {
    /* ignore */
  }
}

function formatDate(iso) {
  if (!iso) {
    return '';
  }
  try {
    return new Intl.DateTimeFormat('pl-PL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 16).replace('T', ' ');
  }
}

function firstLine(message) {
  return (message || '').split('\n')[0].trim();
}

function countUnread(commits, seenSha) {
  if (!commits?.length) {
    return 0;
  }
  if (!seenSha) {
    return commits.length;
  }
  const index = commits.findIndex((c) => c.sha === seenSha);
  if (index === -1) {
    return commits.length;
  }
  return index;
}

/**
 * Przycisk w headerze: wersja APP_VERSION + ostatnie zmiany z GitHuba.
 * Stan „przeczytane” jest lokalny (localStorage) — każdy użytkownik/przeglądarka osobno.
 */
export default function ChangelogPanel() {
  const panelId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seenSha, setSeenSha] = useState('');

  useEffect(() => {
    setSeenSha(readSeenSha());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cached = readCache();
      if (cached) {
        if (!cancelled) {
          setCommits(cached);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(COMMITS_URL, {
          headers: {Accept: 'application/vnd.github+json'},
        });
        if (!response.ok) {
          throw new Error(`GitHub API: ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) {
          setCommits(data);
          writeCache(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Nie udało się pobrać zmian');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const unread = countUnread(commits, seenSha);
  const latestSha = commits[0]?.sha || '';

  const markRead = useCallback(() => {
    if (!latestSha) {
      return;
    }
    writeSeenSha(latestSha);
    setSeenSha(latestSha);
  }, [latestSha]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next && latestSha) {
        writeSeenSha(latestSha);
        setSeenSha(latestSha);
      }
      return next;
    });
  }, [latestSha]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
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

          {loading ? <p className={styles.status}>Ładowanie…</p> : null}
          {error ? (
            <p className={styles.status}>
              {error}.{' '}
              <a
                href={`https://github.com/${REPO}/commits`}
                target="_blank"
                rel="noreferrer"
              >
                Zobacz na GitHubie
              </a>
            </p>
          ) : null}

          {!loading && !error && commits.length === 0 ? (
            <p className={styles.status}>Brak commitów do wyświetlenia.</p>
          ) : null}

          <ul className={styles.list}>
            {commits.map((commit) => (
              <li key={commit.sha} className={styles.item}>
                <a
                  className={styles.itemLink}
                  href={commit.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.itemMsg}>
                    {firstLine(commit.commit?.message)}
                  </span>
                  <span className={styles.itemMeta}>
                    {displayAuthor(commit)}
                    {' · '}
                    {formatDate(commit.commit?.author?.date)}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            className={styles.allLink}
            href={`https://github.com/${REPO}/commits/main`}
            target="_blank"
            rel="noreferrer"
          >
            Pełna historia na GitHubie →
          </a>
        </div>
      ) : null}
    </div>
  );
}
