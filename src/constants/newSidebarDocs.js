import {CHANGELOG_ENTRIES} from '../components/ChangelogPanel/entries';

/** Przez ile dni pokazywać żółtą gwiazdkę „new” w lewym spisie. */
export const SIDEBAR_NEW_DAYS = 21;

/**
 * Ręczna lista nowych stron w sidebarze.
 * path = ścieżka docs (bez baseUrl), np. '/jak-edytowac-dokumentacje'
 * docId = id dokumentu Docusaurus (opcjonalnie)
 */
export const NEW_SIDEBAR_DOCS = [
  {
    path: '/parametry-do-uzupelnienia',
    docId: 'parametry-do-uzupelnienia',
    added: '2026-09-25',
  },
  {
    path: '/procedura-konfiguracji-fc3d',
    docId: 'procedura-konfiguracji-fc3d',
    added: '2026-09-21',
  },
  {
    path: '/jak-edytowac-dokumentacje',
    docId: 'jak-edytowac-dokumentacje',
    added: '2026-09-21',
  },
];

function normalizePath(path, baseUrl = '/') {
  if (!path) {
    return '';
  }
  let value = String(path).split('?')[0].split('#')[0].trim();
  const base = (baseUrl || '/').replace(/\/$/, '');
  if (base && value.startsWith(base + '/')) {
    value = value.slice(base.length) || '/';
  } else if (base && value === base) {
    value = '/';
  }
  // strip accidental duplicated base segments
  if (base && value.startsWith(base)) {
    value = value.slice(base.length) || '/';
  }
  if (!value.startsWith('/')) {
    value = `/${value}`;
  }
  if (value.length > 1 && value.endsWith('/')) {
    value = value.slice(0, -1);
  }
  return value;
}

function isWithinNewWindow(addedDate, now = Date.now()) {
  if (!addedDate) {
    return false;
  }
  const added = new Date(`${addedDate}T00:00:00`).getTime();
  if (Number.isNaN(added)) {
    return false;
  }
  const expires = added + SIDEBAR_NEW_DAYS * 24 * 60 * 60 * 1000;
  return now >= added && now < expires;
}

function collectNewEntries(now = Date.now()) {
  /** @type {{path: string, docId?: string}[]} */
  const entries = [];

  for (const item of NEW_SIDEBAR_DOCS) {
    if (isWithinNewWindow(item.added, now)) {
      entries.push({
        path: normalizePath(item.path),
        docId: item.docId,
      });
    }
  }

  for (const entry of CHANGELOG_ENTRIES) {
    if (!entry.markSidebarNew || !entry.href) {
      continue;
    }
    if (isWithinNewWindow(entry.date, now)) {
      const path = normalizePath(entry.href);
      entries.push({
        path,
        docId: path.replace(/^\//, '') || 'intro',
      });
    }
  }

  return entries;
}

function matchesNew(entry, path, docId) {
  if (entry.path && path) {
    if (entry.path === path || path.endsWith(entry.path) || entry.path.endsWith(path)) {
      return true;
    }
  }
  if (entry.docId && docId) {
    if (entry.docId === docId || docId.endsWith(entry.docId)) {
      return true;
    }
  }
  if (entry.docId && path) {
    const asPath = normalizePath(entry.docId);
    if (asPath === path || path.endsWith(asPath)) {
      return true;
    }
  }
  return false;
}

/**
 * Czy dany link sidebara ma pokazać żółtą gwiazdkę „new”.
 */
export function isSidebarItemNew(href, customProps, baseUrl = '/', docId) {
  const now = Date.now();

  if (customProps?.added && isWithinNewWindow(customProps.added, now)) {
    return true;
  }
  if (customProps?.isNew === true || customProps?.new === true) {
    return true;
  }

  const path = normalizePath(href, baseUrl);
  const id = docId || customProps?.docId || '';
  const entries = collectNewEntries(now);

  return entries.some((entry) => matchesNew(entry, path, id));
}
