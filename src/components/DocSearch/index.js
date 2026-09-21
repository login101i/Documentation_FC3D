import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import {useEffect, useId, useMemo, useRef, useState} from 'react';

import {searchDocs} from './searchEngine';
import styles from './styles.module.css';

const SEARCH_SEEN_KEY = 'fc3d-search-attention-seen';

/**
 * Reusable documentation search.
 *
 * @param {'hero' | 'compact'} [size]
 * @param {string} [placeholder]
 * @param {boolean} [autoFocus]
 * @param {string | null} [label]
 * @param {number} [limit]
 */
export default function DocSearch({
  size = 'hero',
  placeholder = 'Czego szukasz? np. ustalanie powierzchni, złącze QUICK, otwory…',
  autoFocus = false,
  label = null,
  limit = 7,
  className,
}) {
  const inputId = useId();
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [attention, setAttention] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => searchDocs(query, {limit}), [query, limit]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!autoFocus) {
      return undefined;
    }

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus({preventScroll: true});
    }, 80);

    let pulseTimer;
    try {
      if (!window.localStorage.getItem(SEARCH_SEEN_KEY)) {
        setAttention(true);
        window.localStorage.setItem(SEARCH_SEEN_KEY, '1');
        pulseTimer = window.setTimeout(() => setAttention(false), 500);
      }
    } catch {
      setAttention(true);
      pulseTimer = window.setTimeout(() => setAttention(false), 500);
    }

    return () => {
      window.clearTimeout(focusTimer);
      if (pulseTimer) {
        window.clearTimeout(pulseTimer);
      }
    };
  }, [autoFocus]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
      return;
    }
    if (!results.length) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) {
        const base = siteConfig.baseUrl.replace(/\/$/, '');
        history.push(`${base}${target.href}`);
      }
    }
  }

  const showEmpty = query.trim().length >= 2 && results.length === 0;

  return (
    <div
      className={clsx(
        size === 'hero' ? styles.hero : styles.compact,
        attention && styles.attention,
        className,
      )}
    >
      {label ? (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <div className={styles.inputWrap}>
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14"
          />
        </svg>
        <input
          id={inputId}
          ref={inputRef}
          className={clsx(styles.input, attention && styles.inputAttention)}
          type="search"
          value={query}
          autoComplete="off"
          spellCheck="false"
          placeholder={placeholder}
          aria-label="Szukaj w dokumentacji"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          aria-autocomplete="list"
          aria-controls={`${inputId}-results`}
        />
      </div>
      {results.length > 0 && (
        <ul className={styles.results} id={`${inputId}-results`} role="listbox">
          {results.map((item, index) => (
            <li key={item.id} role="option" aria-selected={index === activeIndex}>
              <Link
                className={clsx(styles.result, index === activeIndex && styles.active)}
                to={item.href}
              >
                <span className={styles.category}>{item.category}</span>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.summary}>{item.summary}</span>
                <span className={styles.reason}>{item.reason}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {showEmpty && (
        <p className={styles.empty} role="status">
          Brak dopasowań. Spróbuj: tekstura, złącze QUICK, otwór, oklejanie, migracja.
        </p>
      )}
    </div>
  );
}
